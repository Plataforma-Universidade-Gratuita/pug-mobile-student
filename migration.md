# PUG Mobile Student Migration Guide

This file is the migration handoff from `pug-web-admin` to `pug-mobile-student`.

It answers one question:

Which files from `pug-web-admin` can be reused in the mobile project, which need adaptation, and which should not be brought over at all.

This document is intentionally practical. It is written so a mobile-focused agent can move forward without re-auditing the web repo first.

---

## Scope

Source repo audited:
- `C:\Users\e-mateusf\Documents\college\PUG portfolio\pug-web-admin`

Target repo:
- `C:\Users\e-mateusf\Documents\college\PUG portfolio\pug-mobile-student`

Target stack:
- Expo
- React Native
- Expo Router
- TanStack Query
- React Hook Form
- Zod
- Zustand
- i18next

Important implication:
- Reuse pure data contracts, validation, query defaults, and locale content.
- Do not reuse Next.js request-layer code, browser DOM helpers, CSS-driven design-system types, or web proxy clients.

---

## Classification legend

- **Use as-is**: can be copied with no structural changes.
- **Use with tweaks**: worth reusing, but needs adaptation for Expo/mobile.
- **Do not use**: web-specific, Next-specific, browser-specific, or otherwise the wrong abstraction for mobile.

---

## Root-level files in `pug-web-admin`

### Use as-is

- `.prettierignore`
  - Tooling-level file. Safe if you want the same formatting ignores.

- `.prettierrc`
  - Safe if you want the same formatting rules.

- `codex-context.md`
  - Do not treat it as runtime code.
  - Use it as architectural reference only.

### Use with tweaks

- `.gitignore`
  - Reusable base.
  - Must be adjusted for Expo / React Native generated files.

- `.env.example`
  - Reusable as a pattern only.
  - The keys and loading mechanism must be mobile-specific.

- `README.md`
  - Reusable as structure or documentation tone.
  - Commands and architecture are currently web-oriented.

- `tsconfig.json`
  - Reuse strictness settings if desired.
  - Must be adapted for Expo / React Native TypeScript setup.

- `package.json`
  - Use as dependency reference only.
  - Do not copy directly.

- `package-lock.json`
  - Only relevant if dependency versions are intentionally aligned after rewriting `package.json`.

- `eslint.config.mjs`
  - Reusable as style reference.
  - Must be reworked for Expo linting instead of Next linting.

### Do not use

- `.env`
  - Project-local values.

- `mock-api.env`
  - Web mock workflow specific.

- `next-env.d.ts`
  - Next-only.

- `next.config.ts`
  - Next-only.

- `postcss.config.mjs`
  - Web/Tailwind/PostCSS pipeline only.

- `proxy.ts`
  - Next request gate only.

- `pug-web-admin.iml`
  - IDE metadata.

- `tsconfig.tsbuildinfo`
  - Generated cache.

- `codex-dev.log`
- `codex-dev.err.log`
  - Disposable logs.

- `.next/`
- `node_modules/`
  - Generated/vendor state, not migration material.

---

# Folder-by-folder migration

## 1. `api/`

### What this folder is in web

- `api/**` = direct backend client layer
- `api/web/**` = Next internal proxy client layer for browser-safe app code

### Use as-is

- none

### Use with tweaks

- `api/index.ts`
- all direct domain clients under:
  - `api/academic/*`
  - `api/geo/*`
  - `api/identity/*`
  - `api/partner/*`
  - `api/project/*`

Why:
- This is conceptually the right layer for mobile.
- Mobile should call the backend directly.
- These files already model the real API surface.

Why tweaks are needed:
- They depend on `utils/api.ts`.
- `utils/api.ts` currently has Next-aware token resolution behavior.
- Mobile must replace cookie/server token assumptions with mobile token storage.

Required adaptation:
- keep endpoint shapes
- keep request/response typing
- replace transport/token injection strategy

### Do not use

- all files under `api/web/**`

Why:
- These are built around internal Next proxy routes (`/api/v1/...`).
- Mobile should not route through the web app proxy.

### Recommendation

For mobile:
- port the direct `api/**` clients
- drop `api/web/**` entirely

---

## 2. `app/api/`

### What this folder is in web

- Next route handlers acting as an internal proxy layer.

### Use as-is

- none

### Use with tweaks

- none

### Do not use

- all files under `app/api/v1/**/route.ts`

Why:
- Expo mobile has no reuse path for Next route handlers.
- This folder is transport infrastructure for the web app, not domain logic.

### Recommendation

Ignore this folder completely for mobile.

---

## 3. `constants/`

### Use as-is

- `constants/react-query.ts`

Why:
- Pure TanStack Query defaults.
- Cross-platform.

### Use with tweaks

- `constants/api.ts`
  - Reuse route bases and versioning shape.
  - Replace `NEXT_PUBLIC_API_URL` assumptions with mobile env/config.

- `constants/auth.ts`
  - Reuse route names and auth concepts.
  - Remove cookie-centric assumptions and any web-only visual metadata if not needed.

- `constants/components.ts`
  - Reuse only if the mobile component system wants the same semantic enums/contracts.
  - Do not blindly port web design-system structure.

- `constants/locale.ts`
  - Good reuse candidate.
  - May need small changes depending on how Expo loads locale resources.

- `constants/navigation.ts`
  - Reuse as product-information source only.
  - Not as-is, because it depends on:
    - web routes
    - sidebar structure
    - `lucide-react`

- `constants/theme.ts`
  - Reuse theme values and enums if wanted.
  - Remove DOM bootstrap script and cookie-specific behavior.

### Do not use

- `constants/app-shell.ts`
  - Web shell only.

- `constants/docs.ts`
  - Internal web docs area only.

### Recommendation

Strongest reuse here:
- `locale.ts`
- `react-query.ts`
- API route base structure from `api.ts`

---

## 4. `hooks/`

### Use as-is

- `hooks/index.ts`
- `hooks/useLocalizedZodForm.ts`

Why:
- It is pure React Hook Form + Zod + i18n wiring.
- No Next/browser dependency.
- It already matches the mobile dependency stack.

### Use with tweaks

- none

### Do not use

- none

### Recommendation

This is one of the best direct reuse candidates in the whole repo.

---

## 5. `public/`

### Use as-is

- `public/locales/en-US/common.json`
- `public/locales/pt-BR/common.json`

Why:
- Locale dictionaries are portable.
- Same `i18next` version is already present in mobile.

### Use with tweaks

- none technically

Possible functional tweaks later:
- remove copy that only belongs to web shell/docs/admin-only surfaces
- keep only the student-mobile relevant subtree if you want a cleaner mobile locale file

### Do not use

- none

### Recommendation

Copy both locale files early.
Then prune product-irrelevant keys only if necessary.

---

## 6. `schemas/`

### Use as-is

- all files under:
  - `schemas/api/**`
  - `schemas/client/**`

Why:
- Pure Zod schemas.
- No web/Next coupling.
- Best source of shared validation truth.

Examples:
- API envelopes
- auth token response schemas
- domain entity schemas
- login form schema factory

### Use with tweaks

- none

### Do not use

- none

### Recommendation

This entire folder is a high-confidence shared layer.
It should be one of the first folders migrated.

---

## 7. `scripts/`

### Use as-is

- none

### Use with tweaks

- `scripts/checkMissingTranslations.js`
- `scripts/checkUnusedTranslations.js`
- `scripts/reorderTranslations.js`

Why:
- Useful if the mobile repo wants the same translation workflow.
- They are tied to the current locale file layout and repo assumptions.

Required adaptation:
- confirm path assumptions
- confirm JSON structure expectations
- confirm script integration with the Expo repo scripts

### Do not use

- `scripts/mock-api.mjs`
- `scripts/with-env.mjs`

Why:
- Web mock/dev workflow only.

### Recommendation

Only port translation scripts if you want the same translation discipline in mobile.
Ignore the rest.

---

## 8. `store/`

### Use as-is

- none

### Use with tweaks

- `store/index.ts`
  - Only as a barrel pattern, after real mobile stores exist.

### Do not use

- `store/app-shell.ts`

Why:
- This is a persisted web sidebar state store.
- It solves a web-shell problem, not a mobile problem.

### Recommendation

Do not port current store contents.
Create mobile-native stores from scratch as needed.

---

## 9. `types/`

## 9.1 `types/api/**`

### Use as-is

- all files under `types/api/**`
- `types/api/index.ts`

Why:
- Pure API contracts.
- Strong cross-platform reuse value.

### Use with tweaks

- none

### Do not use

- none

## 9.2 `types/client/**`

### Use as-is

- `types/client/auth.ts`
- `types/client/forms.ts`
- `types/client/locale.ts`
- `types/client/query.ts`
- `types/client/theme.ts`

Why:
- These are mostly platform-neutral client contracts.

### Use with tweaks

- `types/client/index.ts`
  - Re-export barrel will need pruning.

- `types/client/app.ts`
  - Reuse only if the app-level concepts still fit mobile.

- `types/client/navigation.ts`
  - Product concepts may help, but current file is heavily web-shell oriented.

- `types/client/store.ts`
  - Only if reused stores remain conceptually compatible.

- `types/client/docs.ts`
- `types/client/docs/particles.ts`
  - Only if you intentionally keep an internal docs system in mobile, which is unlikely.

### Do not use

- all files under:
  - `types/client/components/**`

Why:
- These are contracts for the web design system.
- They are tied to web primitives, not React Native UI.

### Recommendation

Prioritize:
- `types/api/**`
- a small curated subset of `types/client/**`

Do not port web component types.

---

## 10. `utils/`

### Use as-is

- `utils/lang.ts`
- `utils/theme-value.ts`

Why:
- Pure coercion logic.
- No web or Next coupling.

### Use with tweaks

- `utils/api.ts`
  - Good transport abstraction, but must be rewritten for mobile auth/token handling.

- `utils/api-errors.ts`
  - Good shared error normalization logic.
  - May need adaptation depending on the mobile toast/feedback layer.

- `utils/auth.ts`
  - JWT decode and admin validation logic is reusable if mobile needs the same claims logic.

- `utils/locale.ts`
  - Good i18n setup reference.
  - Needs adaptation because it currently imports locale JSON from the web repo structure and writes cookies / DOM language.

- `utils/mutation-toast.ts`
  - Good mutation feedback pattern.
  - Must be adapted to the mobile feedback primitive instead of the current web toast wrapper.

- `utils/session.ts`
  - Worth reusing conceptually for refresh logic.
  - Must be adapted away from current web token and envelope assumptions where needed.

### Do not use

- `utils/web-api.ts`
  - Specifically built for Next internal proxy calls.

- `utils/cookies.ts`
  - Next cookies + `NextResponse` only.

- `utils/route.ts`
  - Next route handler helpers only.

- `utils/theme.ts`
  - Browser DOM and cookie behavior only.

### Recommendation

Best reusable logic here:
- `lang.ts`
- `theme-value.ts`
- parts of `auth.ts`
- the ideas behind `api.ts`, `api-errors.ts`, and `session.ts`

Not reusable:
- anything tied to Next response objects, browser DOM, or internal web proxy fetches

---

# File-pattern guidance by folder

This is the fast rule-set a migration agent should follow.

## Copy directly now

- `hooks/useLocalizedZodForm.ts`
- `hooks/index.ts`
- `schemas/api/**`
- `schemas/client/**`
- `types/api/**`
- `types/client/auth.ts`
- `types/client/forms.ts`
- `types/client/locale.ts`
- `types/client/query.ts`
- `types/client/theme.ts`
- `constants/react-query.ts`
- `utils/lang.ts`
- `utils/theme-value.ts`
- `public/locales/en-US/common.json`
- `public/locales/pt-BR/common.json`

## Adapt before copying

- `api/**` direct clients
- `constants/api.ts`
- `constants/auth.ts`
- `constants/locale.ts`
- `constants/theme.ts`
- `constants/navigation.ts`
- `utils/api.ts`
- `utils/api-errors.ts`
- `utils/auth.ts`
- `utils/locale.ts`
- `utils/mutation-toast.ts`
- `utils/session.ts`
- translation scripts under `scripts/`
- selective `types/client/**` barrels and app/navigation/store types

## Do not port

- `app/api/**`
- `api/web/**`
- `constants/app-shell.ts`
- `constants/docs.ts`
- `store/app-shell.ts`
- `types/client/components/**`
- `utils/web-api.ts`
- `utils/cookies.ts`
- `utils/route.ts`
- `utils/theme.ts`
- web-only root files:
  - `next.config.ts`
  - `next-env.d.ts`
  - `postcss.config.mjs`
  - `proxy.ts`

---

# Recommended migration order

This order minimizes wasted work.

## Phase 1: shared contracts

Copy first:
- `schemas/api/**`
- `schemas/client/**`
- `types/api/**`
- selected `types/client/**`
- locale JSON files

Why:
- These define the backend contract and validation rules.
- They are the lowest-risk shared layer.

## Phase 2: shared behavior helpers

Copy or adapt:
- `hooks/useLocalizedZodForm.ts`
- `constants/react-query.ts`
- `utils/lang.ts`
- `utils/theme-value.ts`
- `utils/auth.ts`

Why:
- These are portable support layers with low UI coupling.

## Phase 3: transport layer

Adapt:
- `constants/api.ts`
- `utils/api.ts`
- `api/**`
- `utils/session.ts`
- `utils/api-errors.ts`

Why:
- This is where mobile diverges from web:
  - token storage
  - auth refresh flow
  - no internal Next proxy

## Phase 4: mobile-specific application state and UX

Build fresh:
- Zustand stores
- mobile navigation config
- toast/feedback bindings
- theme application layer
- auth persistence layer

Why:
- These are platform behavior decisions, not shared contracts.

---

# Important mobile-specific warnings

## 1. Do not port `api/web/**`

That layer exists because the web app uses internal Next proxy routes.
Mobile should talk to the backend directly.

## 2. Do not port cookie-based assumptions

The web app uses:
- cookies
- Next request helpers
- server-side token refresh hooks

Mobile should instead use:
- secure client-side token storage
- explicit auth/session bootstrap

## 3. Do not port web component or shell types

Anything tied to:
- sidebar
- topbar
- breadcrumb
- DOM theme manipulation
- CSS surface contracts

should be treated as web-only unless deliberately redesigned for mobile.

## 4. Locale reuse is high-value

The locale files are one of the best shared assets.
Do not rewrite them unless the mobile product surface genuinely differs.

---

# Concrete recommendation to the mobile agent

If the goal is speed with low risk:

1. Copy these immediately:
   - `schemas/**`
   - `types/api/**`
   - `hooks/useLocalizedZodForm.ts`
   - `constants/react-query.ts`
   - `utils/lang.ts`
   - `utils/theme-value.ts`
   - `public/locales/**`

2. Rebuild these using the web files only as references:
   - `api/**`
   - auth/session storage
   - theme application
   - navigation
   - stores
   - user feedback/toasts

3. Ignore these entirely:
   - `app/api/**`
   - `api/web/**`
   - all Next/browser/cookie helpers

That is the cleanest path forward.
