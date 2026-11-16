# Groomexa — frontend

Booking, client and reminder system for independent US grooming salons (1–5 groomers).
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · react-hook-form + Zod.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` for canonical URLs, sitemap and Open Graph.

## Pages

| URL | What |
| --- | --- |
| `/` | Marketing landing page (static, SEO-optimised) |
| `/login`, `/signup`, `/forgot-password`, `/reset-password?token=…` | Auth. `features/auth/service.ts` is a demo (any valid email + password succeeds) — replace its function bodies with your auth API |
| `/dashboard` | App shell with an empty dashboard — the starting point for building the app screen by screen |

## Structure

```
src/
  app/
    page.tsx, layout.tsx, sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx   marketing site + SEO
    (auth)/            login, signup, forgot-password, reset-password (shared layout)
    (app)/             signed-in app (layout = sidebar shell, noindex)
      dashboard/
  features/<name>/     one folder per feature: components, schemas.ts (Zod), service.ts (API calls)
  components/
    ui/                shadcn/ui primitives only (generated, then themed) — button, card, alert, input, field, checkbox, badge…
    forms/             react-hook-form helpers (TextFormField)
    shared/            brand components: icon, logo, page-header, section
    app/               app shell (Sidebar)
    layout/, sections/ marketing site
  config/site.ts       site name, URLs, routes
  lib/                 utils (cn), app fonts, structured data
```

### UI: shadcn/ui

- Add a component: `npx shadcn@latest add <name>` (config in `components.json`). Files land in `src/components/ui/`.
- Theme lives in `src/app/globals.css`: shadcn tokens (`--primary`, `--muted-foreground`, …) are mapped to the Groomexa palette; brand tokens (`ink`, `coral`, `teal`, `cream`…) stay available as utilities.
- `Button` has extra brand variants: `dark`, `strong` (marketing outline) and size `xl`. For links use `<Button asChild><Link href="…">…</Link></Button>`.
- Use `text-muted-foreground` for secondary text (not `text-muted`, which is a background colour in shadcn).

### Forms: react-hook-form + Zod

- Schema per feature in `features/<name>/schemas.ts`; `useForm({ resolver: zodResolver(schema), defaultValues, mode: "onTouched" })`.
- Text inputs: `<TextFormField control={form.control} name="email" label="Email" />` (add `revealable` for passwords). Other controls: `Controller` + shadcn `Field`, `FieldLabel`, `FieldError` (see the terms checkbox in `SignupForm`).
- Server/API errors: `form.setError("root", { message })`, shown in a destructive `Alert`.

### Adding an app screen

1. Create `src/app/(app)/<route>/page.tsx` (server component, export `metadata = { title }`).
2. Put its components and logic in `src/features/<name>/`.
3. Add it to `NAV` in `src/components/app/Sidebar.tsx`.
