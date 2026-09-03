# Food Finder — Frontend

Next.js (App Router) + TypeScript + Tailwind CSS app for Food Finder: search packaged food products, view
nutrition details behind a Stripe-gated subscription, and switch between four UI languages.

The companion backend lives in a separate repo: `food-finder-api`.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui (`@base-ui/react` primitives, not Radix)
- `lucide-react` icons

See `DESIGN.md`-equivalent conventions in the main `food-finder` monorepo for the full UI design system
(fonts, color tokens, spacing/type scale, component rules) — this repo follows the same rules.

## Setup

```bash
cp .env.example .env      # point at your backend, see below
npm install
npm run dev                 # http://localhost:3000
```

This app expects the `food-finder-api` backend running (default `http://localhost:4000`). See that repo's
README for how to start it (database, `.env`, `npm run dev`).

### Environment variables

| Variable | Purpose |
|---|---|
| `BACKEND_INTERNAL_URL` | Server-side only — where `next.config.ts`'s `/api/*` rewrite proxies requests to. The browser never talks to the backend directly, so no CORS/cookie cross-origin issues in normal dev. |
| `NEXT_PUBLIC_API_URL` | Optional: bypass the proxy and call the backend directly from the browser instead (only needed if a rewrite isn't available in your deployment). |

## Tests

```bash
npm test
```

Covers the translation dictionaries (parity across all four locales) and the search form's interaction/
validation logic.

## Technical decisions & simplifications

- **API calls are proxied server-side**, not called cross-origin from the browser: `next.config.ts` rewrites
  `/api/*` to `BACKEND_INTERNAL_URL`, so the app and its API calls share an origin. This matters because auth
  uses an `httpOnly` session cookie — a same-origin request sends it automatically; a genuinely cross-origin
  `fetch()` to a different host (e.g. a dev tunnel URL) would need extra CORS/cookie configuration that this
  setup avoids entirely.
- **Auth state** (`useAuth` in `lib/auth/AuthProvider.tsx`) is a React Context that calls `GET /api/auth/me` on
  load and exposes `login`/`register`/`logout`, mirroring the session-cookie model on the backend — no tokens
  are held in JS-accessible storage.
- **shadcn/ui primitives** (`components/ui/*`) are built on `@base-ui/react`, using its `render` prop for
  polymorphism (not Radix's `asChild`). Restyling goes through the design tokens in `globals.css`, not by
  duplicating these primitives.
- **Access control (nutrition data) is not re-checked in the frontend** — it trusts the backend's response
  shape: `nutriments`/`nutriScore`/`novaGroup` simply aren't present in the JSON when the user lacks an active
  subscription, so the UI just renders whatever it's given (a locked-state card when those fields are absent).
- **Fonts are self-hosted** (`next/font/local`, vendored `.woff2` files under `src/app/fonts/`) rather than
  `next/font/google`, so the app has no runtime dependency on Google's font CDN.

## Internationalization

- Supported locales: **English, Dutch, German, French** (`Locale` type in `lib/i18n/translations.ts`).
- UI strings live in one dictionary file (`lib/i18n/translations.ts`); `useLocale()` (from
  `LocaleProvider.tsx`) exposes `t(key)`, falling back to English and then the raw key if a string is missing,
  so a missing translation never crashes the app or shows blank text.
- The chosen locale persists in `localStorage` (`food-finder-locale`) and is picked up on load — there's no
  server-side locale detection (`Accept-Language`) or URL-based locale routing (no `/en/...`, `/fr/...` paths).
- Product *data* (name, ingredients, nutrition labels) is localized separately: the selected locale is sent to
  the backend as `?locale=xx` on every search/lookup call, and the backend asks Open Food Facts for that
  language's fields with an English/generic fallback — this app doesn't localize product content itself.
- Adding a language: add its code to `Locale`/`LOCALES` in `translations.ts` and fill in the new dictionary key
  set — a test in `translations.test.ts` checks all locales have the same keys. (The backend's
  `middleware/locale.ts` also needs the new code added to its allowlist for product-data localization to work.)

## Known limitations

- Not SEO-friendly: no per-locale URLs, and locale is a client-side preference (localStorage), so a fresh
  visit or a shared link always starts in English regardless of the visitor's language.
- Dates/numbers aren't locale-formatted, only UI strings and (server-side) product content.
- i18n coverage is manual/curated (not machine-translated or professionally reviewed).
- Dark mode CSS tokens exist in `globals.css` but nothing in the app currently toggles the `.dark` class.
- No CI pipeline configured — tests/lint/build are run locally only.
