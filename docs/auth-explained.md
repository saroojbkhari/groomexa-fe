# How the frontend talks to the backend: RTK Query, hooks, axios and the dashboard guard

This guide explains how sign-up, email verification, login/logout, forgot/reset password and the protected dashboard work, using the same project structure and API pattern as our other React app (the `src copy/` reference, specifically its **Journeys** feature). Read it top to bottom once; after that, use the folder map to jump to a part.

---

## 1. The big picture

Every API call follows the same path:

```
Component (views/Signup)                 "the user clicked Create my salon"
   │  const { register } = useRegister()
   ▼
Feature hook (hooks/auth/useRegister.ts) wraps the generated RTK Query hook, returns { ok } or { ok: false, error }
   │  registerMutation(payload)
   ▼
Endpoint (state/auth/authQuery.ts)       baseApi.injectEndpoints: URL, method, body for each backend endpoint
   │  { url: "/auth/register", method: "POST", body }
   ▼
Base query (state/baseQuery.ts)          the one createApi; sends every request through axios
   │  http.request(...)
   ▼
axios instance (utils/fetch.ts)          interceptors: add token, refresh expired token, normalise errors
   │  POST http://localhost:3000/auth/register   (straight from the browser; CORS allows localhost:3001)
   ▼
Backend (groomexa-be)
```

Each layer has one job, so when something breaks you know where to look:

| Layer | Its only job |
|---|---|
| view / component | Show UI, collect input, show errors |
| feature hook | Give components a simple function to call (`register(values)`) and the data they need; side effects like saving tokens or navigating |
| endpoint (`*Query.ts`) | Know the URLs and request/response types |
| base query | Plug RTK Query into axios; turn failures into one error shape |
| fetch (axios) | Cross-cutting HTTP rules: auth header, token refresh, error format, timeout |
| slice | Client-side state that isn't a server response (the logged-in user) |

---

## 2. Folder map (same layout as `src copy/`)

```
src/
  app/                      Next.js routes. Thin files: metadata + render a view.
  views/<Page>/             Page components (reference: pages/). Page-only parts in components/.
  components/<Name>/        Shared components: <Name>.tsx + index.ts
    ui/                     shadcn/ui primitives (our UI kit, like @kyc-ui/react in the reference)
  state/
    store.ts                makeStore(), RootState, AppDispatch
    baseQuery.ts            baseApi = createApi(...) with an axios base query
    auth/authQuery.ts       authApi = baseApi.injectEndpoints(...) + generated hooks (useLoginMutation, …)
    auth/slice.ts           client-side auth state (user)
  hooks/
    common/useDispatch.ts   typed dispatch
    common/useSelector.ts   typed selector
    auth/use*.ts            one hook per feature action, plus useSession()
    common/useCooldown.ts   "try again in N s" countdown
  middlewares/errorHandler.ts   ApiError / AuthError classes + Redux middleware
  containers/
    StoreProvider.tsx       gives the app the Redux store
    SessionProvider.tsx     startup refresh + keeps Redux in sync with the session + cross-tab logout
    AuthRoute.tsx           guard for app pages (waits for the startup refresh)
    GuestRoute.tsx          login/signup/forgot: logged in → go to ?next= or the dashboard
  typings/                  auth.ts, common.ts, dashboard.ts, content.ts (interfaces I…, enums E…)
  constants/                storage.ts (localStorage key, lock name), network.ts (API_URL, timeout), auth.ts (60 s cooldown), home.ts
  utils/
    fetch.ts                axios instance + interceptors
    request.ts              toRequestResult(): mutation result → { ok } / { ok: false, error }
    storage.ts              the session: access token (memory), refresh token (localStorage), subscribers
    validation.ts           Zod schemas for the forms
    formHelper.ts           applyApiError(): show API errors on a form
    common.ts               cn(), safeNext()
  mock/dashboard.ts         demo dashboard data
  themes/fonts.ts           app fonts
  config/site.ts            site config + routes
  proxy.ts                  server-side guard: no session cookie → /login before any app page renders
```

How this maps to the reference's Journeys feature:

| Reference (Journeys) | Here (auth) |
|---|---|
| `state/baseQuery.ts` → `baseApi = createApi(...)` | `state/baseQuery.ts` → `baseApi = createApi(...)` |
| `state/journey/journeyQuery.ts` → `journeyApi = baseApi.injectEndpoints(...)` | `state/auth/authQuery.ts` → `authApi = baseApi.injectEndpoints(...)` |
| `state/journey/slice.ts` (UI state: selected journey…) | `state/auth/slice.ts` (UI state: logged-in user) |
| `hooks/journey/useJourney.ts` wraps `useGetJourneysQuery`, `useCreateJourneyMutation`… | `hooks/auth/use*.ts` wrap `useRegisterMutation`, `useLoginMutation`… |
| `typings/journey.ts` | `typings/auth.ts` |

### Where we differ from `src copy/` and why

| Reference | Here | Why |
|---|---|---|
| `src/pages/` | `src/views/` | In Next.js, `src/pages/` is a special folder: every file in it becomes a URL (the old Pages Router). Using it would break the app. |
| `routes.ts` + react-router | `src/app/` folders | Next.js routes by folders. `app/` files just render a view. |
| `export const store = configureStore(...)` | `makeStore()` + `StoreProvider` | Next.js also renders client components **on the server**, for many users. A single shared store could leak one user's state into another's page. Redux's Next.js guide creates one store per browser tab. |
| `fetchBaseQuery` (uses `fetch`) | a small axios base query | You asked for axios with interceptors. RTK Query lets you swap the base query; everything else (endpoints, hooks, tags) is identical. |
| one `useJourney` hook per resource, returns many functions | one hook per action (`useLogin`, `useLogout`…) | Your earlier request: "a separate hook call for each feature". Auth actions live on different pages, so each page imports only what it uses. |
| imports `src/...` | imports `@/...` | Next.js and shadcn already use `@/`. Same idea, different prefix. |
| Vite env `import.meta.env.VITE_*` | `process.env.*` in `next.config.ts` | Next.js env conventions. |

---

## 3. Config: `.env`

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3000
```

- The browser calls the backend **directly**. The backend's CORS setting allows exactly `http://localhost:3001` (its `APP_URL`), so these calls are allowed.
- `NEXT_PUBLIC_` means Next.js copies the value into the browser bundle at build time. That's fine: an API URL isn't a secret. (Never put secrets in `NEXT_PUBLIC_` variables.) Changing it needs a rebuild / dev-server restart.
- `next.config.ts` stops the build if it's missing, so you find out immediately.
- No cookies are involved: tokens travel in JSON bodies and the `Authorization` header, so there's no `withCredentials` / `credentials: "include"`.

Why not proxy through Next.js (`/api/*` rewrite, what we had before)? The backend rate limits per IP address (e.g. 5 sign-ups per hour per IP). Through a proxy, every user would appear to come from the Next.js server's IP and share one limit.

---

## 4. axios: `utils/fetch.ts`

```ts
export function createInstance(config = {}) {
  const instance = axios.create({ baseURL: API_URL, timeout: 15000, headers: {...}, ...config });
  instance.interceptors.request.use(...);   // 1
  instance.interceptors.response.use(...);  // 2
  return instance;
}
```

`state/baseQuery.ts` creates one instance with this and sends every RTK Query request through it (section 6).

### What is an interceptor?

An interceptor is a function axios runs on **every** request before it's sent, or on **every** response before your code sees it. You write the rule once instead of in every call.

### 1. Request interceptor: attach the token

```ts
const token = storage.getAccessToken();
if (token && !requestConfig.skipAuth) requestConfig.headers.set("Authorization", `Bearer ${token}`);
```

`skipAuth` is our own option. It's added to axios's types with *module augmentation*:

```ts
declare module "axios" {
  interface AxiosRequestConfig { skipAuth?: boolean; _retry?: boolean }
}
```

Public endpoints (login, register…) pass `{ skipAuth: true }`.

### 2. Response interceptor: refresh expired tokens, normalise errors

```ts
async (error) => {
  const original = error.config;
  if (error.response?.status === 401 && original && !original.skipAuth) {
    if (original._retry) return Promise.reject(new AuthError()); // still 401 after a refresh: give up
    original._retry = true;
    if (await refreshSession()) return instance(original);      // new token → repeat the request once
    if (storage.getRefreshToken()) return Promise.reject(new ApiError(0, "REFRESH_FAILED", "...")); // offline etc.
    return Promise.reject(new AuthError());                       // the backend ended the session
  }
  return Promise.reject(ApiError.from(error));
}
```

- The access token lives **15 minutes**. After that, the backend answers **401** to a logged-in request. The interceptor gets a new token, then **retries** the request once. The user notices nothing.
- `_retry` makes sure we retry only once (no infinite loop).
- `!original.skipAuth`: a 401 from **login** means "wrong password", not "session expired", so we don't refresh there.
- If the refresh failed because the network is down, we keep the session and show an error, instead of logging the user out.

### 3. `refreshSession()`: the careful part

The backend's rules for refresh tokens:

- **Single use (rotation).** `/auth/refresh` returns a **new** refresh token every time; the old one is used up. We must save the new one immediately.
- **Reuse = theft.** If a used refresh token is sent again (after ~10 s), the backend assumes it was stolen and ends that device's login.

So two refreshes must **never** run at the same time with the same token. Two layers make sure of that:

```ts
let refreshing: Promise<boolean> | null = null;

export function refreshSession() {
  refreshing ??= withRefreshLock().finally(() => { refreshing = null; });  // 1. in this tab
  return refreshing;
}

async function withRefreshLock() {
  return await navigator.locks.request("groomexa-refresh", doRefresh);      // 2. across tabs
}

async function doRefresh() {
  const refreshToken = storage.getRefreshToken(); // read INSIDE the lock: another tab may have just rotated it
  ...POST /auth/refresh → storage.setSession(data)  (new access token in memory, new refresh token in localStorage)
  ...on 401 INVALID_REFRESH_TOKEN → storage.clearSession(), unless another tab already replaced the token
}
```

1. **In this tab (single-flight):** if three requests get a 401 at once, the first starts a refresh and the other two get the same `refreshing` promise. One request to `/auth/refresh`.
2. **Across tabs (Web Locks API):** all tabs share one refresh token in localStorage. `navigator.locks.request(name, fn)` is a browser-wide mutex: only one tab runs `fn` at a time; the others wait. When tab B gets the lock, it reads the token tab A just saved, so it never sends a used one.

You can see it in the Network tab: open the dashboard in two tabs and reload both. The two `/auth/refresh` calls carry **different** tokens, one after the other.

---

## 5. Errors: `middlewares/errorHandler.ts`

The backend always answers errors like `{ "error": { "code": "EMAIL_TAKEN", "message": "...", "details": [...] } }`.

`ApiError.from(err)` converts any failure:

| Situation | status | code | message shown |
|---|---|---|---|
| Backend unreachable | 0 | `NETWORK_ERROR` | "We couldn't reach the server…" |
| Too slow (15s) | 0 | `TIMEOUT` | "The server took too long…" |
| 4xx | 4xx | backend's code | backend's message (safe to show) |
| 501 | 501 | `NOT_IMPLEMENTED` | "This feature isn't available yet…" |
| other 5xx | 5xx | backend's code | generic "Something went wrong…" (hides internals) |

Validation errors (`details: [{ path: "email", message: "..." }]`) become `fieldErrors: { email: "..." }`.

`toJSON()` turns it into a plain object (`IApiError`). **Redux only stores plain, serializable data**, never class instances.

`AuthError` means "the session is gone, log in again".

### The Redux middleware

```ts
const errorHandler: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action) && action.payload?.name === "AuthError") storage.clearSession();
  return next(action);
};
```

A Redux middleware sees **every action** before the reducers do. When an RTK Query request fails, RTK Query dispatches a `…/rejected` action whose `payload` is the error from our base query. The middleware watches for one whose error is `AuthError` and ends the session (`storage.clearSession()`); `AuthRoute` then sends the user to log in. One rule, in one place, for every future API call. (The reference project does the same in its `errorHandler.ts`.)

---

## 6. RTK Query: `state/baseQuery.ts` and `state/auth/authQuery.ts`

### What RTK Query does for you

Without it, every API call needs the same boilerplate: a loading flag, an error variable, a "data" variable, try/catch, and actions to put it all in Redux. RTK Query generates that. You describe each endpoint once, and it gives you a ready-made React hook:

```ts
const [login, { isLoading, isSuccess, error, data }] = useLoginMutation();
```

Two kinds of endpoints:

| | `build.query` | `build.mutation` |
|---|---|---|
| For | reading data (GET a list of clients) | changing something (register, log in, create a client) |
| Runs | automatically when the component mounts, and is **cached** | only when you call the trigger function |
| Hook | `useGetClientsQuery(arg)` → `{ data, isLoading, error, refetch }` | `useCreateClientMutation()` → `[trigger, { isLoading, error, … }]` |

Every auth endpoint changes something on the server, so they're all mutations. (The Journeys feature has both: `getJourneys` is a query, `createJourney` etc. are mutations.)

### `baseQuery.ts`: one API object for the whole app

```ts
const http = createInstance(); // axios + our interceptors

const axiosBaseQuery: BaseQueryFn<string | IRequestArgs, unknown, IApiError> = async (args) => {
  const { url, method = "GET", body, params, skipAuth } = typeof args === "string" ? { url: args } : args;
  try {
    const { data } = await http.request({ url, method, data: body, params, skipAuth });
    return { data };
  } catch (err) {
    return { error: ApiError.from(err).toJSON() };
  }
};

export const baseApi = createApi({
  reducerPath: "groomexaApi",
  baseQuery: axiosBaseQuery,
  tagTypes: [],
  endpoints: () => ({}),
});
```

- A **base query** is the function RTK Query calls to actually send a request. It must return `{ data }` or `{ error }`, never throw.
- The reference uses `fetchBaseQuery` (the browser's `fetch`). We wrote a small axios one so our interceptors (token, refresh + retry, error format) apply to every endpoint. That's an officially supported RTK Query pattern.
- `endpoints: () => ({})` is empty on purpose: each feature **injects** its own endpoints, so this file never grows with features.
- `tagTypes` is for caching queries (section 12 shows it).

### `auth/authQuery.ts`: the auth endpoints

```ts
export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<IMessageResponse, IRegisterPayload>({
      query: (payload) => ({ url: "/auth/register", method: "POST", body: payload, skipAuth: true }),
    }),
    login: build.mutation<IAuthTokensResponse, ILoginPayload>({
      query: (payload) => ({ url: "/auth/login", method: "POST", body: payload, skipAuth: true }),
    }),
    // verifyEmail, resendVerification, logout, forgotPassword, resetPassword …
  }),
  overrideExisting: false,
});

export const { useRegisterMutation, useLoginMutation, /* … */ } = authApi;
```

- `build.mutation<Response, Arg>`: the two types give you autocomplete on what you send and what comes back. They live in `typings/auth.ts` (copied from the backend's `auth.schemas.ts`).
- `skipAuth: true`: these endpoints are public. No token is attached, and a 401 from login means "wrong password", not "session expired".
- RTK Query names the hooks for you: endpoint `login` → `useLoginMutation`.

**Answer to your earlier DevTools question:** the browser sends the request itself, so in the Network tab you'll see `POST http://localhost:3000/auth/register` with a normal **JSON object** body. The earlier `[ {...} ]` array was the Server Action argument format, which we no longer use.

---

## 7. Redux state: `state/`

### `store.ts`

```ts
const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer, // RTK Query's cache and request state
  auth: authSlice.reducer,
});

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware).concat(errorHandler),
  });
```

- RTK Query needs two things registered: its **reducer** (where it keeps request status and cached responses) and its **middleware** (which runs the requests, caching and refetching). Same as the reference's `store.ts`.
- `combineReducers` is called once at module level. It runs a self-check that uses `Math.random()`, and Next.js (with Cache Components) refuses `Math.random()` while pre-rendering a page. Calling it here, not during render, avoids that build error.
- `RootState` / `AppDispatch` power the typed hooks.

### `auth/slice.ts`

```ts
export interface State {
  status: ESessionStatus;   // unknown (startup refresh running) | authenticated | anonymous
  user: IAuthUser | null;   // from the latest login or refresh
}

reducers: {
  setUser: (state, action: PayloadAction<IAuthUser | null>) => {
    state.user = action.payload;
    state.status = action.payload ? ESessionStatus.Authenticated : ESessionStatus.Anonymous;
  },
}
```

Same shape as the reference's `state/journey/slice.ts`: plain reducers for client-side state only.

**What goes where:**

| Kind of state | Where | Example |
|---|---|---|
| Request status, errors, server responses | RTK Query (automatic) | "is login loading?", "verify failed with message X" |
| Client state shared across screens | slice | session status, logged-in user |
| Form values, field errors | react-hook-form | the sign-up inputs |

Before RTK Query, the slice also had to hold `verifyEmailStatus`, `verifyEmailError` and `registeredEmail`, with `extraReducers` to update them. Now the mutation hooks give us that directly, so the slice is tiny.

Code inside reducers looks like mutation (`state.user = ...`). Redux Toolkit uses *Immer*, which turns this into a safe immutable update.

---

## 8. Hooks: `hooks/`

### Typed hooks: `hooks/common/`

```ts
const useDispatch = useReduxDispatch.withTypes<AppDispatch>();
const useSelector = useReduxSelector.withTypes<RootState>();
```

`useSelector((state) => state.auth.user)` now autocompletes and type-checks. (react-redux 9 uses `.withTypes<>()`; the reference's `createSelectorHook<RootState>()` is the older form.)

### One hook per feature: `hooks/auth/`

Like `useJourney`, each hook wraps the generated RTK Query hook and hides the details from components.

| Hook | Wraps | Returns | Used in |
|---|---|---|---|
| `useRegister()` | `useRegisterMutation` | `{ register, registeredEmail }` | `views/Signup` |
| `useVerifyEmail(token)` | `useVerifyEmailMutation` | `{ status, error }` (runs once on page load) | `views/VerifyEmail` |
| `useResendVerification()` | `useResendVerificationMutation` | `{ resend }` | `components/ResendVerificationForm` |
| `useLogin()` | `useLoginMutation` | `{ login }` (starts the session) | `views/Login` |
| `useLogout()` | `useLogoutMutation`, `useLogoutAllMutation` | `{ logout, logoutAll }` | `components/AccountMenu` |
| `useSession()` | (Redux) | `{ status, user }` | `AuthRoute`, `GuestRoute`, `AccountMenu` |
| `useForgotPassword()` | `useForgotPasswordMutation` | `{ requestReset }` | `views/ForgotPassword` |
| `useResetPassword()` | `useResetPasswordMutation` | `{ reset }` | `views/ResetPassword` |

The simplest one:

```ts
export default function useRegister() {
  const [registerMutation, { isSuccess, originalArgs }] = useRegisterMutation();

  const register = useCallback(
    (payload: IRegisterPayload) => toRequestResult(registerMutation(payload)),
    [registerMutation],
  );

  return { registeredEmail: isSuccess ? originalArgs?.email : undefined, register };
}
```

- `originalArgs` is what we sent, so after a successful sign-up we know which email to show in "Check your email". No slice needed.
- Mutation state belongs to the component that called the hook, so it starts fresh each time the page opens.
- `toRequestResult` (`utils/request.ts`) turns the mutation's `{ data }` / `{ error }` into `{ ok: true }` / `{ ok: false, error }`, which is what the forms use.
- `useCallback` keeps the function identity stable between renders.

`useLogin` starts the session after a successful call:

```ts
const response = await loginMutation(payload);
if (response.data) storage.setSession(response.data); // access token → memory, refresh token → localStorage, user → Redux
return toRequestResult(response);
```

It doesn't navigate: `GuestRoute` (on the login page) sees the session start and goes to `?next=` or the dashboard. One place decides where logged-in users go.

`useLogout` gives `logout` (this device: `POST /auth/logout` with the refresh token) and `logoutAll` (every device: `POST /auth/logout-all` with the access token). Both always end the local session, even if the request fails, and clear RTK Query's cache. They don't navigate either: `AuthRoute` sees the session end and goes to `/login`.

`useVerifyEmail` is worth a look:

```ts
const [verifyEmailMutation, { isUninitialized, isLoading, isSuccess, error }] = useVerifyEmailMutation();
const sent = useRef(false);
useEffect(() => {
  if (!token || sent.current) return;
  sent.current = true;
  removeQueryFromUrl(); // history.replaceState: the token leaves the address bar and history
  verifyEmailMutation(token);
}, [verifyEmailMutation, token]);
```

- The token is **single use**. Email scanners and link previews *load* URLs, but don't run JavaScript. Verifying in `useEffect` (browser only) means only a real browser uses the token.
- React Strict Mode runs effects **twice** in development. The `ref` guard stops the second call, which would fail with "already used".
- It's a mutation, not a query, because it changes the account (and a query could be re-sent automatically).

Components never import RTK Query hooks, `dispatch` or URLs directly. They only use the feature hook. If the API changes, the components don't.

---

## 9. Components using the hooks

```tsx
// views/Signup/Signup.tsx
const { registeredEmail, register } = useRegister();

const onSubmit = form.handleSubmit(async (values) => {
  const { salonName, ownerName, email, phone, password } = values; // drop UI-only `terms`
  const res = await register({ salonName, ownerName, email, phone, password });
  if (!res.ok) applyApiError(form, res.error, { EMAIL_TAKEN: "email", PASSWORD_TOO_COMMON: "password" });
});

if (registeredEmail) return <AuthCard title="Check your email">...</AuthCard>;
```

`applyApiError` (`utils/formHelper.ts`):

1. puts each `fieldErrors` entry under its input (`form.setError("email", …)`) and focuses the first one;
2. maps error **codes** to a field (`EMAIL_TAKEN` → email);
3. puts anything else in `errors.root`, which renders as a red alert at the top.

Form field names match the API field names (`salonName`, `ownerName`, …), so backend validation messages land on the right input automatically.

Login shows a "Resend verification email" button when the code is `EMAIL_NOT_VERIFIED`. The Sidebar's **Log out** is a `<button>` calling `useLogout()`, not a link. Logging out changes state, and links get prefetched.

---

## 10. Tokens and the guards

### `utils/storage.ts`: where the session lives

| What | Where | Why |
|---|---|---|
| Access token (JWT, 15 min) | a variable in memory | Never written anywhere. Lost on reload, which is fine: the startup refresh gets a new one. |
| Refresh token (30 days, single use) | `localStorage["groomexa.refreshToken"]` | Survives reloads and is shared by all tabs. |
| User | Redux (`state.auth.user`) | From the login / refresh response. There's no `/me` endpoint. |
| "Has a session" flag | cookie `gx_session=1` (30 days) | So the **server** knows whether to let you into app pages. Holds no token. |

`storage.setSession(tokens)` and `storage.clearSession()` are the only ways to start or end a session. Both tell their subscribers, and `SessionProvider` passes that on to Redux.

**Security:** localStorage can be read by any script running on the page, so an XSS bug would mean account takeover. Never render user data with `dangerouslySetInnerHTML` / `innerHTML`, don't add untrusted third-party scripts, never log tokens and never put them in URLs.

### `containers/SessionProvider.tsx`: startup and other tabs

Mounted once in `app/layout.tsx`:

1. **Startup refresh.** After a reload the access token is gone. If there's a refresh token, call `refreshSession()` once: that gives a new access token **and** the current user. Until it finishes, `status` is `unknown`.
2. **Sync.** Subscribes to `storage`, so every login / refresh / logout updates `state.auth`.
3. **Other tabs.** Listens for the browser's `storage` event. If another tab **removed** the refresh token (it logged out), this tab logs out too. If the token was only **changed** (another tab refreshed), nothing to do: the next refresh reads the new value.

### Guarding app pages: two layers

Typing `/dashboard` while logged out must never show the app, not even for a moment. But the tokens live in the browser, and the server renders the page before any browser code runs. So:

**1. `proxy.ts` (server, before rendering).** It runs for `/dashboard`, `/clients`, … and checks the `gx_session` flag cookie. No cookie → a `307` redirect to `/login?next=/dashboard`. The dashboard HTML is never sent.

```ts
export function proxy(request: NextRequest) {
  if (request.cookies.get("gx_session")?.value === "1") return NextResponse.next();
  return NextResponse.redirect(new URL(`/login?next=${...}`, request.url));
}
```

`storage.setSession()` sets the cookie and `storage.clearSession()` removes it, so it always follows the session.

**2. `containers/AuthRoute.tsx` (browser, wraps the whole app shell).** A cookie only proves there *was* a session. The refresh token may have expired or been revoked on the server, and only the startup refresh can tell.

```tsx
const { status } = useSession();
useEffect(() => {
  if (status === ESessionStatus.Anonymous) router.replace(`/login?next=${...}`);
}, [status]);
if (status !== ESessionStatus.Authenticated) return <FullPageLoader />;
return children; // sidebar + page
```

- `unknown` → a neutral full-page loader (the logo), no sidebar, no page.
- `anonymous` → `/login?next=…` on a first visit, plain `/login` after logging out. The failed refresh also removed the cookie, so the proxy won't let this browser in again.

Why not put the tokens in the cookie and check them on the server? The backend's contract keeps tokens out of cookies, and the flag is enough for routing: the backend still checks the real token on every API call.

### `containers/GuestRoute.tsx`: for log in, sign up, forgot password

When there's a session, go to `?next=` (same-site paths only, `safeNext`) or `/dashboard`. Not used on `/verify-email` and `/reset-password`: those must always work from an email link.

**The real security is the backend:** it verifies the JWT on every API call. The frontend guards only decide what to *show*.

### `containers/StoreProvider.tsx`

```tsx
"use client";
export default function StoreProvider({ children }) {
  const [store] = useState(makeStore); // created once per tab
  return <Provider store={store}>{children}</Provider>;
}
```

It wraps everything in `app/layout.tsx`, so any client component can use the hooks.

---

## 11. End-to-end flows

**Sign up**

1. Zod checks the form.
2. `useRegister` calls the `register` mutation, which sends `POST /auth/register`.
3. On 201, `isSuccess` becomes true and the page shows "Check your email" for `originalArgs.email`.

**Verify email**

1. The link opens `/verify-email?token=…`.
2. `useVerifyEmail` removes the token from the address bar and calls the `verifyEmail` mutation once. Its status goes from loading to success or error.
3. The page shows the matching screen.

**Log in**

1. `useLogin` calls the `login` mutation, which sends `POST /auth/login`.
2. `storage.setSession()`: access token in memory, refresh token in localStorage, user in Redux.
3. `GuestRoute` sees `authenticated` and goes to `?next=` or `/dashboard`.

**Reload the page**

1. `status` is `unknown`; `AuthRoute` shows a placeholder.
2. `SessionProvider` calls `refreshSession()` → new tokens + user → `authenticated` → the page renders.

**Later API call with an expired token**

1. The backend returns 401.
2. The interceptor calls `refreshSession()` (one at a time, see section 4), saves the new tokens and retries the call.
3. If the refresh token is rejected too, the result is `AuthError`. The middleware ends the session and `AuthRoute` goes to `/login`.

**Log out**

1. `useLogout` calls `POST /auth/logout` (or `/auth/logout-all`), then always ends the local session and clears RTK Query's cache.
2. `AuthRoute` goes to `/login`. Removing the refresh token fires a `storage` event in other tabs, so they log out too.

**Reset password**

1. `/reset-password?token=…` removes the token from the address bar.
2. On success the backend has logged out every device, so `useResetPassword` ends the local session too and goes to `/login?reset=success`.

---

## 12. Try it yourself

1. Run the backend on port 3000 and `npm run dev` (port 3001).
2. Open DevTools → Network → Fetch/XHR, then submit the sign-up form. You'll see `POST http://localhost:3000/auth/register` with a JSON object body.
3. Install the **Redux DevTools** browser extension. Watch `groomexaApi/executeMutation/pending` → `fulfilled` / `rejected`, and the `groomexaApi.mutations` state.
4. Submit with a 5-character password. You get an error under the field and **no** network request (Zod stopped it).
5. Open `/verify-email?token=wrong`. The address bar loses `?token=…`, exactly one `POST /auth/verify-email` is sent, and the page shows "Link not valid".
6. Open `/dashboard` in a private window. You're redirected to `/login?next=%2Fdashboard` by `AuthRoute`.
7. Log in, then DevTools → Application → Local Storage: only `groomexa.refreshToken`. No cookies, and the access token is nowhere in storage.
8. Open the dashboard in a second tab and log out in the first: the second tab goes to `/login` too.

**Exercise:** add a "clients" feature the same way, like Journeys.

1. `typings/client.ts`: `IClient`, `ICreateClientPayload`.
2. Add `"Clients"` to `tagTypes` in `state/baseQuery.ts`.
3. `state/client/clientQuery.ts`:

   ```ts
   export const clientApi = baseApi.injectEndpoints({
     endpoints: (build) => ({
       getClients: build.query<IClient[], void>({
         query: () => "/clients",              // a string means GET
         providesTags: [{ type: "Clients" }],  // "this data is the Clients list"
       }),
       createClient: build.mutation<IClient, ICreateClientPayload>({
         query: (body) => ({ url: "/clients", method: "POST", body }),
         invalidatesTags: [{ type: "Clients" }], // "the Clients list is now stale" → getClients refetches itself
       }),
     }),
     overrideExisting: false,
   });
   export const { useGetClientsQuery, useCreateClientMutation } = clientApi;
   ```

   No `skipAuth` here: these are logged-in calls, so they get the token, and the refresh + retry on 401, automatically.
4. `hooks/client/useClients.ts`: wrap both hooks, return `{ clients, loading, error, createClient }` (look at `src copy/hooks/journey/useJourney.ts`).
5. `views/Clients/Clients.tsx`, then `app/(app)/clients/page.tsx`.

Tags are how RTK Query keeps lists fresh: after creating a client you never call "reload the list" yourself.
