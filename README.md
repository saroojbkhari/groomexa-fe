# Groomexa — frontend

Booking, client and reminder system for independent US grooming salons (1–5 groomers).
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · Redux Toolkit · axios · react-hook-form + Zod.

```bash
npm install
npm run dev      # http://localhost:3001
npm run build && npm start
npm run lint
```

Copy `.env.example` to `.env.local`: `NEXT_PUBLIC_SITE_URL` (canonical URLs, sitemap, Open Graph) and `NEXT_PUBLIC_API_URL` (the backend, e.g. `http://localhost:3000`). The browser calls the backend directly; its CORS allows `http://localhost:3001`.

## Pages

| URL | What |
| --- | --- |
| `/` | Marketing landing page (static, SEO-optimised) |
| `/login`, `/signup`, `/verify-email?token=…`, `/forgot-password`, `/reset-password?token=…` | Auth, calling the backend's `/auth/*` endpoints (see `docs/auth-explained.md`) |
| `/dashboard` | Signed-in app (guarded on the server by `src/proxy.ts` and in the browser by `containers/AuthRoute`); dashboard data is still mock data |

## Structure

Follows the same layout as our other React projects:

```
src/
  app/                 Next.js routes only (thin page.tsx/layout.tsx files that render a view)
    (auth)/            login, signup, verify-email, forgot-password, reset-password
    (app)/             signed-in app (layout = sidebar shell + AuthRoute, noindex)
  views/<Page>/        one folder per page: <Page>.tsx, index.ts, components/ (page-only parts)
                       (`views`, not `pages`: Next.js reserves src/pages for its Pages Router)
  components/<Name>/   shared components: <Name>.tsx + index.ts (default export)
    ui/                shadcn/ui primitives only (generated, then themed)
  state/               Redux Toolkit + RTK Query: store.ts, baseQuery.ts (createApi),
                       <feature>/<feature>Query.ts (endpoints), <feature>/slice.ts (client state)
  hooks/<feature>/     one hook per feature action, wraps the RTK Query hooks, e.g. hooks/auth/useRegister.ts
  hooks/common/        typed useDispatch / useSelector
  middlewares/         Redux middleware + error classes (errorHandler.ts)
  containers/          StoreProvider (Redux), SessionProvider (startup refresh, cross-tab logout), AuthRoute / GuestRoute (guards)
  typings/             TypeScript interfaces (I-prefix) and enums (E-prefix)
  constants/           routes-independent constants: storage keys, network, page content
  utils/               fetch.ts (axios + interceptors), request.ts, storage.ts (session: access token in memory, refresh token in localStorage), validation.ts (Zod), formHelper.ts, common.ts
  mock/                demo data until the backend has the endpoint
  themes/              fonts
  config/site.ts       site name, URLs, routes
  proxy.ts             server-side guard for app pages (session flag cookie)
```

### Calling an API

`component → hook (hooks/<feature>) → RTK Query endpoint (state/<feature>/<feature>Query.ts) → baseQuery.ts → utils/fetch.ts (axios + token refresh) → backend`

Same pattern as the reference's Journeys feature (`src copy/state/journey/journeyQuery.ts` + `hooks/journey/useJourney.ts`):

1. Types in `src/typings/<feature>.ts`.
2. Endpoints in `src/state/<feature>/<feature>Query.ts` with `baseApi.injectEndpoints`: `build.query` for reads (with `providesTags`), `build.mutation` for writes (with `invalidatesTags`). Add new tag names to `tagTypes` in `state/baseQuery.ts`. Public endpoints pass `skipAuth: true`.
3. A hook in `src/hooks/<feature>/` that wraps the generated `use…Query` / `use…Mutation` hooks; mutations return `toRequestResult(...)` → `{ ok }` / `{ ok: false, error }`.
4. In the component: `const res = await doThing(values); if (!res.ok) applyApiError(form, res.error);`

Full walkthrough: [docs/auth-explained.md](docs/auth-explained.md).

### UI: shadcn/ui

- Add a component: `npx shadcn@latest add <name>` (config in `components.json`). Files land in `src/components/ui/`.
- Theme lives in `src/app/globals.css`: shadcn tokens (`--primary`, `--muted-foreground`, …) are mapped to the Groomexa palette; brand tokens (`ink`, `coral`, `teal`, `cream`…) stay available as utilities.
- `Button` has extra brand variants: `dark`, `strong` (marketing outline) and size `xl`. For links use `<Button asChild><Link href="…">…</Link></Button>`.
- Use `text-muted-foreground` for secondary text (not `text-muted`, which is a background colour in shadcn).

### Forms: react-hook-form + Zod

- Schemas in `utils/validation.ts`; `useForm({ resolver: zodResolver(schema), defaultValues, mode: "onTouched" })`.
- Text inputs: `<TextFormField control={form.control} name="email" label="Email" />` (add `revealable` for passwords). Other controls: `Controller` + shadcn `Field`, `FieldLabel`, `FieldError` (see the terms checkbox in `views/Signup`).
- API errors: `applyApiError(form, res.error)` (`utils/formHelper.ts`) puts field errors under inputs and the rest in `errors.root`, shown in a destructive `Alert`.

### Adding an app screen

1. Create `src/app/(app)/<route>/page.tsx` (server component, export `metadata = { title }`).
2. Put the page in `src/views/<Page>/<Page>.tsx` (+ `index.ts`, page-only parts in `components/`), API calls as above.
3. Add it to `NAV` in `src/components/Sidebar/Sidebar.tsx`, and its path to `matcher` in `src/proxy.ts`. (The `app/(app)/` layout's `AuthRoute` guards it in the browser either way.)
