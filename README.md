# PUG Mobile Student

Expo + React Native mobile application for the student-facing PUG experience.

## Stack

- Expo
- Expo Router
- React Native
- TypeScript
- TanStack Query
- React Hook Form
- Zod
- Zustand
- i18next

## Project status

This repo is in active migration from `pug-web-admin`.

Shared contracts and validation layers are being reused from the web repo where they are platform-neutral. Transport, auth/session handling, theming, navigation, and UI composition are being rebuilt for mobile.

See:

- [codex-context.md](./codex-context.md)
- [migration.md](./migration.md)

## Development

Install dependencies:

```bash
npm install
```

Start the Expo dev server:

```bash
npm run start
```

Platform-specific shortcuts:

```bash
npm run android
npm run ios
npm run web
```

## Notes

- Internal imports should use `@/`.
- Expo-managed package versions should stay aligned with the installed Expo SDK.
- Do not port Next.js request-layer code, cookie-based auth flows, or web-only UI abstractions directly into this repo.
