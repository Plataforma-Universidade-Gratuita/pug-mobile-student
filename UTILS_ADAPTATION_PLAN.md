# Utils Adaptation Plan

## Objective

Adapt `utils/` to the mobile app with a strict pruning rule:

- keep only utilities that are used now
- keep only utilities that are clearly required by upcoming mobile work
- delete web-specific helpers
- delete broad or speculative helpers that may vary a lot later

This plan is intentionally more aggressive than the API migration.

## Scope

Target folder:

- `utils/`

Related surfaces that may need coordination:

- `constants/`
- `i18n/`
- `stores/`
- `api/`
- `types/`

## Hard Rules

### 1. `utils/` is for runtime helpers only

Do not keep constants in `utils/` if they belong in `constants/`.

Do not keep types in `utils/`. Those belong in `types/`.

### 2. Delete “maybe useful later” helpers

If a helper is not used now and is not clearly needed by the next mobile milestones, delete it.

If the same behavior is needed later, re-add it in the smallest valid ownership location.

### 3. Delete web-specific behavior

Anything tied to browser-only assumptions should be removed or rewritten:

- `window`
- `document`
- cookie-only flows
- web-only API error classes
- helpers designed around Next.js page/runtime behavior

### 4. Prefer feature-local or domain-local ownership

If a helper is only used by one feature or one domain later, move it out of root `utils/`.

Root `utils/` should contain only small, stable helpers with more than one meaningful caller.

## Current Audit

Current files:

- `utils/api-errors.ts`
- `utils/auth.ts`
- `utils/constants.ts`
- `utils/index.ts`
- `utils/lang.ts`
- `utils/locale.ts`
- `utils/storage.ts`
- `utils/theme-value.ts`
- `utils/utils.ts`

### Current direct usage

Used by current app code:

- `utils/api-errors.ts`
  - used by `features/auth/login/LoginScreen.tsx`
- `utils/auth.ts`
  - used by `stores/auth.ts`
- `utils/lang.ts`
  - used by `features/auth/login/LoginScreen.tsx`
  - used by `features/home/HomeScreen.tsx`
- `utils/locale.ts`
  - used by `features/auth/login/LoginScreen.tsx`
  - used by `features/home/HomeScreen.tsx`
- `utils/storage.ts`
  - used by `stores/theme.ts`
- `utils/theme-value.ts`
  - used by `components/navigation/root-layout/RootNavigator.tsx`
  - used by `stores/theme.ts`
- `utils/utils.ts`
  - only used indirectly by `utils/api-errors.ts` through `normalizePathSegments(...)`
- `utils/constants.ts`
  - only used by `utils/utils.ts`

### Immediate problems

1. `utils/api-errors.ts` still references `WebApiError`, but the old `api/web` tree is gone.
2. `utils/constants.ts` only contains `LANG_ALIASES`, which already belongs in `constants/locale.ts`.
3. `utils/utils.ts` still contains broad generic helpers that are not currently used by app code.
4. `utils/index.ts` should not export dead or duplicate helpers just because they exist.

## Keep / Adapt / Delete Decisions

### Keep

These are valid mobile utilities and are currently justified:

- `utils/auth.ts`
- `utils/locale.ts`
- `utils/storage.ts`
- `utils/theme-value.ts`

### Keep, but adapt

- `utils/api-errors.ts`
  - remove dependence on deleted web API classes
  - normalize around the root mobile API error model only
- `utils/lang.ts`
  - keep as the canonical language coercion helper
- `utils/utils.ts`
  - keep only if `normalizePathSegments(...)` is still needed after cleanup
  - otherwise delete it completely

### Delete

- `utils/constants.ts`
  - redundant with `constants/locale.ts`
- any unused generic helpers inside `utils/utils.ts`
  - `isAppLang(...)` if only `coerceLang(...)` is used externally
  - `normalizeTextForSearch(...)` if no active caller remains
  - `compareNormalizedText(...)` if no active caller remains

## Target End State

Preferred final `utils/` shape:

- `utils/api-errors.ts`
- `utils/auth.ts`
- `utils/lang.ts`
- `utils/locale.ts`
- `utils/storage.ts`
- `utils/theme-value.ts`
- optional: `utils/utils.ts` only if one or two truly shared generic helpers survive
- `utils/index.ts` exporting only survivors

Files that should be gone if still unused:

- `utils/constants.ts`
- any dead helper blocks inside `utils/utils.ts`

## Execution Plan

### Phase 1: Lock the canonical keep list

- [x] Confirm actual imports outside `utils/`
- [x] Mark each file as keep / adapt / delete
- [x] Refuse speculative carryover helpers

Acceptance:

- [x] every file in `utils/` has an explicit reason to exist

### Phase 2: Normalize API error helpers

- [x] rewrite `utils/api-errors.ts` to depend only on the surviving root API error shape
- [x] remove references to deleted `api/web`
- [x] keep only behavior still used by mobile screens/forms

Acceptance:

- [x] no utility in `utils/` imports deleted API structures

### Phase 3: Collapse language helpers

- [x] make `utils/lang.ts` the only root language helper file
- [x] delete `utils/constants.ts`
- [x] move any remaining alias ownership to `constants/locale.ts`
- [x] remove duplicate language coercion logic from `utils/utils.ts`

Acceptance:

- [x] language coercion exists in one place only

### Phase 4: Shrink generic helpers

- [x] review `utils/utils.ts` helper by helper
- [x] keep only helpers with more than one real caller or a clear near-term need
- [x] delete broad helpers with no active consumer

Acceptance:

- [x] no kitchen sink utility file remains

### Phase 5: Rebuild the barrel

- [x] make `utils/index.ts` export only surviving files
- [x] avoid exporting helpers only because they existed in web-admin

Acceptance:

- [x] barrel matches the real surviving utility surface

## Deletion Bias

When in doubt:

1. delete web-specific behavior
2. delete unused broad helpers
3. keep only stable mobile runtime helpers
4. reintroduce later in a narrower ownership location if needed

## Notes for Later

When the `types/` cleanup starts, follow the same policy:

- keep only mobile-used types
- delete primitive or UI-library-specific web types that are not needed here
- do not preserve huge imported type surfaces just because they existed in web-admin

## Phase 1 Audit Output

### Confirmed external imports

Confirmed direct imports outside `utils/`:

- `@/utils/theme-value`
  - `components/navigation/root-layout/RootNavigator.tsx`
  - `stores/theme.ts`
- `@/utils/api-errors`
  - `features/auth/login/LoginScreen.tsx`
- `@/utils/lang`
  - `features/auth/login/LoginScreen.tsx`
  - `features/home/HomeScreen.tsx`
- `@/utils/locale`
  - `features/auth/login/LoginScreen.tsx`
  - `features/home/HomeScreen.tsx`
- `@/utils/auth`
  - `stores/auth.ts`
- `@/utils/storage`
  - `stores/theme.ts`

No external callers currently import:

- `@/utils/constants`
- `@/utils/utils` directly
- root `@/utils` barrel

### Locked file classification

#### Keep

- `utils/auth.ts`
  - required by `stores/auth.ts`
  - mobile-specific token validation logic
- `utils/locale.ts`
  - required by login/home language switching
  - thin runtime bridge to app i18n
- `utils/storage.ts`
  - required by `stores/theme.ts`
  - mobile-safe storage abstraction
- `utils/theme-value.ts`
  - required by root navigator and theme store
  - stable mobile theme derivation logic

#### Keep, but adapt

- `utils/api-errors.ts`
  - currently used
  - still references deleted web API shape
- `utils/lang.ts`
  - currently used
  - should become the only language coercion helper
- `utils/utils.ts`
  - not externally used
  - currently retained only because `api-errors.ts` depends on `normalizePathSegments(...)`
  - should be reduced to the minimum surviving helper set or deleted
- `utils/index.ts`
  - not externally used now
  - should survive only as a strict barrel for kept files

#### Delete

- `utils/constants.ts`
  - no external callers
  - only feeds `utils/utils.ts`
  - duplicates ownership already better placed in `constants/locale.ts`

### Explicit anti-carryover decisions

These are rejected as reasons to keep a utility:

- “web-admin had it”
- “might be useful later”
- “generic helper libraries are convenient”
- “types may use it someday”

The default rule from this phase onward is:

- if a utility has no current caller and no clear near-term mobile use, delete it

### Phase 1 conclusions

1. The justified mobile utility surface is small.
2. `utils/constants.ts` is confirmed dead and should be removed in the next cleanup phase.
3. `utils/utils.ts` is on probation and should only survive if one concrete shared helper remains after Phase 2 and Phase 3.
4. The next high-value fix is `utils/api-errors.ts`, because it still depends on deleted web-era assumptions.

## Phase 2 Implementation Output

### What changed

`utils/api-errors.ts` was rewritten to depend only on the surviving root mobile API error shape:

- import now comes from `@/api/errors`
- deleted `WebApiError` handling was removed
- the surviving helpers were kept:
  - `getApiErrorMessage(...)`
  - `getApiErrorToastContent(...)`
  - `getApiErrorFieldErrors(...)`
  - `hasNestedFieldValue(...)`

### What was intentionally not changed yet

`hasNestedFieldValue(...)` still depends on `normalizePathSegments(...)` from `utils/utils.ts`.

That is acceptable for now because Phase 2 was about deleting API-layer assumptions, not yet collapsing generic helpers. The fate of `utils/utils.ts` is deferred to Phase 3 and Phase 4.

### Phase 2 conclusions

1. `utils/` no longer imports deleted API structures.
2. `utils/api-errors.ts` is now aligned with the surviving root API layer.
3. The next cleanup should remove the duplicate language helper ownership split between `utils/constants.ts`, `utils/lang.ts`, and `utils/utils.ts`.

## Phase 3 Implementation Output

### What changed

Language helper ownership was collapsed to one place:

- `constants/locale.ts` remains the owner of `LANG_ALIASES`
- `utils/lang.ts` is now the only root language coercion helper file

Removed in this phase:

- `utils/constants.ts`

Also removed from `utils/utils.ts`:

- `isAppLang(...)`
- `coerceLang(...)`

### Resulting ownership

After Phase 3:

- alias data lives in `constants/locale.ts`
- language coercion logic lives in `utils/lang.ts`
- `utils/utils.ts` now contains only generic helper candidates still pending review

### Phase 3 conclusions

1. Language coercion now exists in one place only.
2. The old `utils/constants.ts` split is gone.
3. `utils/utils.ts` is now much closer to a pure generic-helper file, which makes Phase 4 simpler.

## Phase 4 Implementation Output

### Generic helper review result

utils/utils.ts was reviewed helper by helper.

Result:

- 
ormalizeTextForSearch(...) deleted
- compareNormalizedText(...) deleted
- 
ormalizePathSegments(...) no longer kept as a shared root helper

Instead of preserving a one-function generic file, 
ormalizePathSegments(...) was inlined into utils/api-errors.ts, which is its only remaining owner.

### Phase 4 conclusion

There is no longer any justified generic catch-all utility file in root utils/.

## Phase 5 Implementation Output

### Barrel rebuilt

utils/index.ts now exports only the surviving utility files:

- uth
- pi-errors
- lang
- locale
- storage
- 	heme-value

### Final surviving utils surface

The root utils/ folder now contains:

- utils/api-errors.ts
- utils/auth.ts
- utils/index.ts
- utils/lang.ts
- utils/locale.ts
- utils/storage.ts
- utils/theme-value.ts

Deleted during the utils cleanup:

- utils/constants.ts
- utils/utils.ts

### Final conclusion

The utility surface is now small, mobile-focused, and justified by real current usage.
