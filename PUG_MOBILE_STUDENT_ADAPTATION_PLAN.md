# PUG Mobile Student Adaptation Plan

This document defines how to adapt the folders copied from `pug-web-admin` into a React Native and Expo-ready implementation without losing the overall structure that now exists in `pug-mobile-student`.

## Purpose

The target state is:

- `pug-web-admin` remains the source of truth for folder layout, domain naming, exports, validation contracts, and slice organization
- `pug-mobile-partner` remains useful only as a reference for proven mobile runtime behavior
- `pug-mobile-student` must end up as a mobile app that keeps the web-admin structure but implements it with React Native semantics

## Core rules

- Preserve the imported structure unless there is a strict runtime reason not to.
- Prefer changing internals over renaming or moving folders.
- Keep the following folders as first-class surfaces: `api/`, `constants/`, `hooks/`, `i18n/`, `schemas/`, `stores/`, `types/`, `utils/`, and `scripts/`.
- Preserve root barrel exports and domain grouping.
- Do not reintroduce browser-only behavior such as cookies, `window`, `document`, `localStorage`, or Next route handlers.
- Do not let screens or feature components bypass the typed layers.
- Keep Zod validation at every transport boundary.

## Web-admin patterns that still apply

The web-admin development guide defines patterns that should survive the mobile adaptation:

- thin route or screen wrappers
- explicit layering
- provider-first app shell
- feature-sliced composition
- validation-first requests
- predictable naming and barrel exports

Those patterns still apply in mobile. The runtime changes, not the architectural discipline.

## Source-of-truth policy

When the repos disagree:

- `pug-web-admin` wins for structure, contracts, export shape, naming, and domain modeling
- `pug-mobile-partner` wins only for mobile runtime concerns such as Expo boot, secure token storage, device theme sync, native navigation flow, and mobile-safe persistence

This means `pug-mobile-student` should look like web-admin in shape, but behave like partner in runtime.

## Layer-by-layer adaptation

### API

Goal: keep the same web-admin `api/` structure, but make it correct for mobile.

Rules:

- Preserve `api/services/` and `api/web/`.
- Do not introduce a flat mobile API again unless absolutely unavoidable.
- `api/services/` should be the backend-facing layer.
- `api/web/` should remain the app-facing typed layer used by features and hooks.

How to adapt:

- Remove assumptions about Next route handlers and browser-local `/api/v1/*` routing.
- In mobile, `api/services/` should call the backend directly using a mobile-safe fetch wrapper.
- Base URL resolution must come from Expo runtime configuration, not web-specific environment assumptions spread across the codebase.
- Auth headers must be injected from the mobile session state.
- Refresh-token retry behavior must be handled in a centralized mobile-safe way.
- Browser redirects on `401` or `403` must become session invalidation and navigation/store actions.
- Timeout, offline, and cancellation behavior should be handled explicitly.
- UI code should call `api/web/`, not `api/services/`, except for intentionally centralized auth bootstrap or session maintenance code.

Practical guidance:

- Keep folder names, endpoint names, query keys, and domain boundaries aligned with web-admin.
- Rewrite transport behavior, not the slice shape.
- Start with `identity/auth`, because the rest of the API depends on session correctness.

### Utils

Goal: keep utility ownership clear while making it mobile-safe.

Rules:

- Preserve the web-admin utility surface where possible.
- Reintroduce missing mobile helpers only where the mobile runtime truly needs them.
- Avoid scattering runtime policy across feature code.

How to adapt:

- Separate runtime-agnostic helpers from mobile-runtime helpers.
- Replace browser storage helpers with `expo-secure-store` or another approved mobile-safe persistence mechanism.
- Rebuild session helpers around token persistence and refresh flow.
- Rebuild locale and theme helpers around native runtime behavior.
- Keep error utilities structured and typed.
- Prefer explicit helper APIs over ad hoc fetch or storage logic inside screens.

If an old partner utility is still needed:

- first try to place it into the nearest web-admin-aligned file or module
- only add temporary compatibility re-exports if needed to keep the migration moving

### Types

Goal: keep the type system aligned with the imported web-admin contracts while allowing mobile-specific runtime types.

Rules:

- Web-admin types are the baseline for API and domain contracts.
- Mobile-only types should exist only when they represent native runtime state, navigation, or device-driven behavior.
- Avoid duplicate type models for the same domain concept.

How to adapt:

- Keep API request and response types aligned with schemas.
- Remove or rewrite browser-only or Next-specific types.
- Consolidate store typing around `stores/`, not the old `store/`.
- Keep root exports coherent and predictable.
- Add mobile-specific presentation or navigation types only where needed, not as a parallel domain model.

### Schemas

Goal: preserve validation-first architecture with mobile-friendly input normalization where necessary.

Rules:

- Keep schema layout and domain grouping aligned with web-admin.
- API schemas must remain transport-accurate.
- Form schemas may adapt to mobile input realities, but should not distort the backend contract.

How to adapt:

- Preserve request and response parsing as mandatory.
- Add preprocessors or transforms only when mobile inputs require normalization, such as text-based numeric input, date handling, boolean coercion, or id shaping.
- Do not loosen schemas to hide caller mistakes.
- Fix the caller when a schema reveals a mismatch.

### Stores

Goal: make `stores/` the stable mobile state layer.

Rules:

- `stores/` is the target structure.
- Do not keep `store/` as the long-term primary surface.
- Persist state with mobile-safe storage mechanisms only.

How to adapt:

- Merge the proven mobile auth and theme behavior into `stores/`.
- Keep auth bootstrap, sign-in, refresh, sign-out, and invalid-session handling centralized.
- Keep theme hydration and device color-scheme synchronization centralized.
- Retain useful web-admin stores such as pagination or app-shell state, but replace browser persistence semantics.
- Use compatibility re-exports from `store/` only as a temporary bridge if compile stability needs it.

Important constraint:

- The final state should not depend on obsolete imports like `@/store` when `stores/` is the intended surface.

### Hooks

Goal: preserve reusable hook contracts, but rewrite browser-dependent behavior.

Rules:

- Keep hooks where they still represent useful reusable behavior.
- Do not keep hooks that secretly depend on browser UI or web-only primitives.

How to adapt:

- Retain pure hooks such as form helpers and query helpers where possible.
- Rewrite hooks that assume DOM behavior, browser navigation, Radix interaction patterns, or web-only overlays.
- Make mobile hooks integrate with Expo Router, native screen focus, AppState, gesture-based UI, and mobile-safe feedback patterns.
- If a hook really belongs to the state or transport layer, move the responsibility downward instead of keeping it in a UI-facing hook.

### I18n

Goal: preserve the key space and tooling discipline while making runtime loading mobile-safe.

Rules:

- Keep web-admin key naming and translation discipline.
- Keep mobile-only keys under `mobile.*`.
- Do not hardcode user-facing text outside translations.

How to adapt:

- Prefer bundled translation resources for app runtime behavior.
- Use HTTP translation loading only if there is a clear product reason.
- Keep locale switching explicit and controlled.
- Remove browser-locale assumptions.
- Keep translation scripts working against the mobile repo tree and folder names.

### Constants

Goal: keep constants organized and runtime-correct.

Rules:

- Preserve web-admin grouping where possible.
- Add mobile-only constants only when needed.
- Do not let runtime configuration leak as magic literals through the app.

How to adapt:

- Rebuild environment and provider constants for Expo runtime.
- Keep storage keys, API URLs, theme definitions, pagination defaults, supported locales, and component-level fixed values centralized.
- Reintroduce missing mobile constants only if they still have a clear ownership boundary.
- Keep barrel exports predictable.

### Scripts

Goal: keep developer workflow and translation tooling consistent after the import.

Rules:

- Preserve script intent and command naming when possible.
- Remove assumptions that only make sense in the web repo.

How to adapt:

- Fix repo-path assumptions such as `store/` versus `stores/`.
- Keep translation checks aligned with the mobile tree.
- Keep environment bootstrap scripts portable.
- Avoid coupling scripts to Next.js-only files or output.

## Current reconciliation hotspots

These are the kinds of mismatches to resolve first:

- mobile screens still importing old partner-era surfaces such as `@/store`
- provider imports expecting old mobile constants that no longer exist in the imported structure
- utility imports still pointing at partner files that disappeared after the web-admin copy
- store naming mismatch between `store/` and `stores/`
- web-admin slices assuming web transport behavior while the mobile runtime needs direct backend communication

Decision rule for each mismatch:

1. Prefer updating the caller to the intended imported structure.
2. If the structure is correct but the implementation is missing, rebuild the implementation inside that structure.
3. Use a compatibility shim only when it reduces migration risk and is clearly temporary.

## Execution order

1. Restore the compile-time module graph for the mobile shell.
2. Rebuild auth, persistence, and fetch foundations for mobile runtime.
3. Reconcile provider bootstrapping for query client, i18n, theme, and session state.
4. Adapt `api/services/` and `api/web/` slice by slice, starting with identity.
5. Align `utils/`, `constants/`, `hooks/`, and `stores/` around the mobile auth/runtime model.
6. Re-enable feature flows in dependency order.
7. Remove temporary compatibility bridges and dead partner-era ownership paths.
8. Validate after each phase with lint, typecheck, translation checks, and Expo smoke tests.

## Non-goals

- Do not flatten the imported web-admin structure back into the old partner shape.
- Do not bypass typed layers for speed.
- Do not solve runtime mismatches by weakening schemas or types.
- Do not scatter auth or persistence logic across screens.
- Do not keep both old and new ownership models alive longer than necessary.

## Done criteria

The adaptation is done when:

- the mobile app compiles without relying on misleading legacy ownership paths
- `api/web/` is the only normal UI-facing API layer
- auth and refresh work without cookies or browser primitives
- all persistence is mobile-safe
- stores, hooks, constants, utils, schemas, types, and i18n all follow one coherent ownership model
- the resulting repo still reflects the web-admin structure, but its implementation is production-ready for React Native and Expo
