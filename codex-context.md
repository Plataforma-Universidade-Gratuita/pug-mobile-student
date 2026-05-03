# PUG Mobile Student Context

This file is the working contract for `pug-mobile-student`. It defines the architectural baseline for the mobile app and replaces the copied web-admin context as the source of truth for this repo.

If this file conflicts with assumptions imported from `pug-web-admin`, prefer this file. If this file conflicts with the current working code and the code has clearly established a better mobile pattern, follow the working code and then update this file.

## What this project is

- `pug-mobile-student` is an Expo + React Native application for the student-facing PUG experience.
- It uses:
  - Expo
  - Expo Router
  - React Native
  - TypeScript
  - TanStack Query
  - React Hook Form
  - Zod
  - Zustand
  - i18next
- The mobile app is being built with `pug-web-admin` as a reference source, not as a direct code template.

## Primary migration rule

- Reuse shared contracts, schemas, locale content, and portable helper logic.
- Rebuild platform behavior for mobile.
- Do not carry over Next.js request infrastructure, cookie-based auth assumptions, browser DOM helpers, or web design-system abstractions as-is.

In practical terms:

- safe to reuse:
  - `schemas/**`
  - `types/api/**`
  - selected `types/client/**`
  - `hooks/useLocalizedZodForm.ts`
  - `constants/react-query.ts`
  - portable locale utilities
  - locale JSON files
- must be adapted:
  - `api/**`
  - auth/session handling
  - i18n bootstrap
  - theme bootstrap
  - navigation config
  - feedback/toast layer
- do not port:
  - `app/api/**`
  - `api/web/**`
  - `proxy.ts`
  - cookie helpers
  - DOM theme helpers
  - web shell/docs/component-system contracts

## Non-negotiable rules

- Use `@/` for internal imports.
- Do not introduce new relative imports for internal modules when an `@/` path is appropriate.
- Do not import a layer's own barrel from inside that same layer.
  - Examples:
    - files under `schemas/**` must not import `@/schemas`, `@/schemas/api`, or `@/schemas/client`
    - files under `types/**` must not import `@/types`, `@/types/api`, or `@/types/client`
    - files under `store/**` must not import `@/store`
    - files under `hooks/**` must not import `@/hooks`
- Prefer direct leaf-module imports for runtime schemas used by transport, auth, and store code.
  - Good: `@/schemas/api/identity/auth`
  - Avoid: `@/schemas/api`
- Keep raw static config under `constants/`.
- Keep shared types and interfaces under `types/`.
- Keep Zod schemas under `schemas/`.
- Keep reusable hooks under `hooks/`.
- Keep reusable helper functions out of `.tsx` files when they are not tightly coupled to local component state. Put them in adjacent `utils.ts` when local to a feature/component folder.
- Keep all user-facing copy in locales. Do not add new hardcoded UI copy in screens, components, or features.
- When changing shared copy, update both locale files:
  - `locales/en-US/common.json`
  - `locales/pt-BR/common.json`
- Prefer reusing existing mobile primitives and patterns before introducing new abstractions.
- Do not port web UI primitives just because they exist in the web repo.

## Current tech and runtime facts

- Package manager: `npm`
- Router: Expo Router
- App entry: `expo-router/entry`
- Core platform behavior should follow Expo SDK compatibility, not arbitrary latest-major upgrades.
- Current dependency strategy:
  - Expo-managed packages should stay aligned with the installed Expo SDK.
  - Non-Expo packages should be upgraded conservatively and only when compatible.

## High-level folder contract

- `app/`: Expo Router route tree, layouts, route groups, screen entrypoints
- `components/`: shared React Native UI primitives and compositions
- `constants/`: static configuration, enums, route metadata, query defaults, app-level config
- `hooks/`: shared custom hooks
- `features/`: feature-level mobile surfaces and workflows
- `schemas/`: Zod schemas
- `store/`: Zustand client-state stores
- `types/`: API and client type contracts
- `utils/`: cross-cutting helpers
- `api/`: backend client functions and API-layer helpers
- `locales/`: i18n dictionaries

## Route structure

- Routing is file-based through Expo Router.
- Mobile route groups should be organized for user flows, not copied from the web app's layout structure.
- Do not recreate web route concepts such as:
  - `app/(app)` authenticated shell layout
  - `app/(auth)` auth shell layout
  - `app/api/**`
- Use route groups only when they clarify navigation structure or screen ownership.

## Auth and session behavior

- Mobile auth is not cookie-based.
- Do not port web session behavior that depends on:
  - cookies
  - `NextRequest`
  - `NextResponse`
  - server-side refresh in middleware/proxy
- Mobile auth should instead use:
  - secure client-side token storage
  - explicit session bootstrap on app startup
  - explicit refresh flow in the API transport layer

Auth source-of-truth rules:

- access and refresh token handling belongs in the mobile auth/session layer
- transport/token injection belongs in mobile API utilities
- UI components should consume session state through dedicated hooks/stores/providers, not decode tokens ad hoc inside screens

## Data and API conventions

- Mobile should call the backend directly.
- Do not route mobile traffic through the web app proxy layer.
- `api/**` is the correct long-term home for direct backend clients.
- `api/web/**` from the web project should not exist in mobile.

API migration rules:

- keep endpoint shapes when porting from web
- keep request/response typing
- keep Zod schema validation where it is already useful
- replace cookie/server token assumptions with mobile token access

Recommended API layering:

- `constants/api.ts`: API base URLs and route bases
- `utils/api.ts`: shared fetch/transport layer, auth header injection, refresh handling, response normalization
- `api/<domain>/**`: domain clients
- `features/**/queries.ts`: feature-local query keys and query hooks

## TanStack Query conventions

- TanStack Query is the default server-state layer.
- Use it for:
  - authenticated `me` or profile endpoints
  - dashboard or home data
  - lists, details, filters, and backend-backed screen content
  - mutations that should invalidate or refresh cached server state
- Do not use it for:
  - form field state
  - theme state
  - transient modal/sheet open state
  - local interaction state that belongs to one screen

Query ownership pattern:

- raw HTTP calls remain in `api/**`
- feature-local query keys and hooks live in feature-local `queries.ts`
- components consume query hooks instead of calling transport utilities directly

Avoid:

- ad hoc string query keys scattered through components
- duplicating server state into Zustand
- direct `fetch` calls inside screens for shared authenticated data

## Zustand conventions

- Zustand is the default client shared-state layer when state should outlive one component but should not be treated as server state.
- Store files belong under `store/`.
- Use Zustand for:
  - authenticated session coordination
  - persisted client preferences
  - feature-level shared workspace state
  - lightweight cross-screen coordination where React Query is not the right fit
- Do not use Zustand for:
  - API-backed data that belongs in TanStack Query
  - form field state that belongs in React Hook Form
  - screen-local toggle state that can remain local

Keep stores small and domain-oriented.

## Form and validation conventions

- React Hook Form + Zod is the standard form stack.
- `hooks/useLocalizedZodForm.ts` is a preferred shared abstraction when the schema depends on translations.
- Keep this separation:
  - schema definition in `schemas/`
  - form wiring in hooks/components
  - submit behavior in the feature layer
  - API/server error handling in the feature or API layer
- Do not build app-wide form state for unrelated forms.

## Localization

- All user-facing copy belongs in locale dictionaries.
- Shared locale files from the web project are valid reuse sources, but mobile should prune irrelevant admin-only or docs-only keys over time.
- Locale bootstrap should be mobile-specific.
- Do not port cookie or DOM language behavior from web.

Locale rules:

- keep locale helpers under `utils/` or `constants/` as appropriate
- keep translation resource loading explicit and predictable
- if new copy is added, update both locale files

## Theme conventions

- Theme behavior must be mobile-native.
- Do not port browser DOM mutation, cookie theme persistence, or web bootstrap scripts.
- Reuse portable theme enums or coercion logic when useful.
- Theme persistence and application should be implemented through React Native / Expo-compatible mechanisms.

## Component system

- Shared components should be React Native-first.
- Do not import or recreate the web component system mechanically.
- Do not port Radix wrappers, CSS-dependent contracts, or DOM-only accessibility patterns as-is.

Component rules:

- shared primitives live in `components/`
- feature-specific screen composition belongs in `features/`
- icons should use React Native-compatible libraries only
- component APIs should stay small, typed, and explicit

When deciding whether to share a component:

- if it solves a platform-neutral mobile UI pattern, put it in `components/`
- if it is feature-owned or screen-specific, keep it in `features/`

## Styling system

- Styling must follow React Native patterns, not the web app's CSS utility system.
- Do not port:
  - Tailwind utility contracts blindly
  - CSS token files as runtime styling
  - DOM class-based theme bootstrapping
- Reuse design values conceptually when useful, but express them in mobile-native form.

Good mobile styling defaults:

- consistent spacing scales
- predictable typography tokens
- restrained surface depth
- stable component sizing
- clear pressed/disabled/loading states

## Navigation conventions

- Navigation should be mobile-first and task-oriented.
- Do not copy the web sidebar/breadcrumb/navigation config as structure.
- Web route names, product domains, and labels may still be useful as product-reference input.

Navigation rules:

- route groups and tabs should reflect mobile workflows
- avoid deep web-style navigation hierarchies unless the product truly needs them
- keep screen ownership clear
- navigation labels and titles should still be localized

## Reuse map from the web repo

### Reuse directly

- `schemas/api/**`
- `schemas/client/**`
- `types/api/**`
- `types/client/auth.ts`
- `types/client/forms.ts`
- `types/client/locale.ts`
- `types/client/query.ts`
- `types/client/theme.ts`
- `hooks/useLocalizedZodForm.ts`
- `hooks/index.ts`
- `constants/react-query.ts`
- `utils/lang.ts`
- `utils/theme-value.ts`
- locale JSON files

### Reuse with adaptation

- `api/**` direct domain clients
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
- selective client barrels and app/navigation/store types

### Do not reuse

- `app/api/**`
- `api/web/**`
- `proxy.ts`
- `utils/web-api.ts`
- `utils/cookies.ts`
- `utils/route.ts`
- `utils/theme.ts`
- `constants/app-shell.ts`
- `constants/docs.ts`
- `store/app-shell.ts`
- `types/client/components/**`

## Recommended migration order

1. Copy shared contracts:
   - `schemas/**`
   - `types/api/**`
   - selected `types/client/**`
   - locale files
2. Copy shared behavior helpers:
   - `hooks/useLocalizedZodForm.ts`
   - `constants/react-query.ts`
   - `utils/lang.ts`
   - `utils/theme-value.ts`
   - selected auth/i18n helpers
3. Rebuild the transport layer:
   - `constants/api.ts`
   - `utils/api.ts`
   - `api/**`
   - `utils/session.ts`
   - `utils/api-errors.ts`
4. Build mobile-native app behavior:
   - auth persistence
   - mobile navigation
   - mobile feedback/toast bindings
   - theme application
   - Zustand stores

## What to check before finishing work

- verify Expo-managed package versions remain SDK-compatible
- verify internal imports use `@/`
- verify no module imports its own barrel from inside the same top-level layer
- verify new user-facing copy exists in both locale files
- verify shared contracts live in `schemas/`, `types/`, `constants/`, `hooks/`, or `utils/` as appropriate
- verify backend calls go through the mobile transport layer rather than ad hoc screen-level fetches
- verify server state uses TanStack Query rather than duplicated local state
- verify web-only files or assumptions were not reintroduced

## Practical default workflow for changes

1. Read the relevant feature, route, schema, and API files first.
2. Check whether the needed logic already exists in the web repo as a portable contract or helper.
3. Reuse shared schemas/types/helpers where they are platform-neutral.
4. Rebuild transport, auth, navigation, and UI behavior in mobile-native form.
5. Keep internal imports on `@/`.
6. Keep new copy in locales.
7. Run targeted validation for the changed area.

## Exceptions and judgment

- Framework-required route exports should stay in the Expo Router files that own them.
- React contexts are runtime objects and belong where their behavior is most understandable; do not move them just to satisfy folder purity.
- Component-local logic that is tightly coupled to state, refs, or rendering may stay inside `.tsx` files.
- Do not abstract early just because the web repo had a heavier pattern. Mobile should stay lean until repeated behavior justifies a shared layer.
