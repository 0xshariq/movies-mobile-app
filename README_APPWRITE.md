# Appwrite Integration (Movies Mobile App)

This document explains how to set up Appwrite authentication and database for this Expo React Native app, environment variables to set, how the code is wired, and how to test signup/login flows.

## Summary of what was implemented

- `app/lib/appwrite.ts` — Appwrite client and exported `account` and `databases` objects.
- `app/(auth)/signup.tsx` — Signup screen using Appwrite `account.create()` and `databases.createDocument()` to save a user record.
- `app/(auth)/login.tsx` — Login screen using Appwrite `account.createSession()`.
- `.env` — new environment variables were added (see below). Make sure to update with your real values.

## File-by-file changes (what I changed and why)

- `.env`
  - Added `EXPO_PUBLIC_APPWRITE_DATABASE_ID` and `EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID` placeholders.
  - Why: the app's signup flow creates a user document in a specific Appwrite database and collection. These env vars let you change the target DB/collection without editing code.
  - Action: Replace the placeholder values with your actual database and collection IDs from the Appwrite console.

- `app/lib/appwrite.ts`
  - Added a small Appwrite client module that:
    - Creates and configures a `Client` using `EXPO_PUBLIC_APPWRITE_ENDPOINT` and `EXPO_PUBLIC_APPWRITE_PROJECT_ID`.
    - Exports `account` and `databases` helper instances for use across the app.
  - Why: centralizes Appwrite configuration so auth and database calls use the same client and env settings.
  - Action: Ensure `EXPO_PUBLIC_APPWRITE_ENDPOINT` and `EXPO_PUBLIC_APPWRITE_PROJECT_ID` are correct in `.env`.

- `app/(auth)/signup.tsx`
  - Replaced the placeholder screen with a Tailwind-styled signup form.
  - Behavior:
    - Calls `account.create('unique()', email, password, name)` to create a user in Appwrite Auth.
    - If `EXPO_PUBLIC_APPWRITE_DATABASE_ID` is set, calls `databases.createDocument(databaseId, usersCollection, 'unique()', {...})` to create a corresponding user document.
  - Why: provide an end-to-end signup that both creates an auth user and stores profile data in the database.
  - Action: Adjust the created document fields to match your collection schema and set `EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID`.

- `app/(auth)/login.tsx`
  - Replaced the placeholder login screen with a Tailwind-styled form.
  - Behavior: calls `account.createSession(email, password)` to authenticate and create a session.
  - Why: allows users to sign in and create a session the app can use for subsequent API calls.
  - Action: Add navigation or state changes on successful login to move users into the protected app area.

- `README_APPWRITE.md`
  - Added this documentation file (you are reading it) and appended this file-by-file explanation.
  - Why: central documentation of the changes, env vars, and next steps.

Notes about styling and tooling

- Styling: I used Tailwind classes via `NativeWind` in the auth screens (the project already includes `nativewind` in `package.json`). This keeps UI concise and consistent with the project's styling approach.
- Appwrite SDK: the project does not yet include the `appwrite` package by default — install it with `pnpm add appwrite` or `npm install appwrite`. TypeScript lint errors in the IDE will disappear after installing the package.
- Linting: I fixed the Appwrite client to remove invalid client method calls that caused parse errors. If you see any lint warnings, run your linter or restart your editor after installing packages.

If you'd like, I can open a follow-up PR that:

- Adds form validation and inline error messages to the auth forms.
- Adds navigation (protected routes) so successful login redirects to the main tab.
- Adds an Appwrite Function template for safe server-side operations (so admin keys are never used in the client).


## Required environment variables

Edit your project's `.env` (already contains values). The important ones for Appwrite are:

- `EXPO_PUBLIC_APPWRITE_PROJECT_ID` — your Appwrite project id
- `EXPO_PUBLIC_APPWRITE_ENDPOINT` — Appwrite API endpoint (example: `https://fra.cloud.appwrite.io/v1`)
- `EXPO_PUBLIC_APPWRITE_DATABASE_ID` — your Appwrite database id (e.g. `database-...`)
- `EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID` — the collection id for users (e.g. `users`)
- `APPWRITE_API_KEY` / `APPWRITE_DEV_KEY` — admin keys (do NOT embed these in client builds; keep them for server-side or local development only)

Example `.env` (already present in repo):

```env
EXPO_PUBLIC_APPWRITE_PROJECT_ID=68f34b6c003557880491
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_DATABASE_ID=database-68f4b80a00317c152ae0
EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
APPWRITE_API_KEY='standard_...'
APPWRITE_DEV_KEY='8a21df...'
```

Important: do NOT commit secrets (API keys) into version control. The `EXPO_PUBLIC_*` vars are safe to be public (client-side) but admin keys must stay private.

## Install Appwrite SDK

Run in your project root (choose pnpm or npm depending on your project):

```bash
pnpm add appwrite
# or
npm install appwrite
```

If using TypeScript and you get type issues, make sure TypeScript is at a compatible version.


## New frontend dependencies for validation

This project now uses `react-hook-form` and `zod` for form validation in the login and signup screens. Install them with:

```bash
pnpm add react-hook-form zod @hookform/resolvers
# or
npm install react-hook-form zod @hookform/resolvers
```

Restart Metro after installing these packages so the packager picks up the new modules.

## How the code works

- `app/lib/appwrite.ts` creates a `Client` and sets endpoint and project from env. It exports `account` (for auth calls) and `databases` (for document calls).
- `signup.tsx` calls:
  - `account.create('unique()', email, password, name)` — creates the user in Appwrite Auth
  - `databases.createDocument(databaseId, usersCollectionId, 'unique()', { appwriteId: user.$id, email, name })` — creates a user record in your database collection if `EXPO_PUBLIC_APPWRITE_DATABASE_ID` is set
- `login.tsx` calls `account.createSession(email, password)` to create a session for the user.

Adjust the document fields to match your users collection schema in Appwrite.

## Security notes

- Do NOT embed admin keys (`APPWRITE_DEV_KEY` or `APPWRITE_API_KEY`) in your published client app. Remove or secure them using server functions or environment-specific builds.
- For production, prefer server-side user creation (if you need to attach additional protected fields) via a trusted backend or Appwrite Functions.

Note: I removed the sample Appwrite Function template from the repo — the app now performs signup/login directly from the client using the Appwrite SDK in `app/(auth)/signup.tsx` and `app/(auth)/login.tsx`.

If you need secure server-side operations that require admin privileges, create an Appwrite Function and keep the admin key in the function's environment variables (do not put it in the client `.env`).

## Run & Test

1. Install dependencies: `pnpm install` or `npm install`.
2. Start Expo: `pnpm start` or `npm run start`.
3. On the device/emulator open the app and navigate to the signup screen: fill details and submit. Check Appwrite console for the new user and the user document in the database.
4. Login with the created user using the login screen. Confirm session in Appwrite console (Auth → Sessions) or inspect `account.get()`.

## Troubleshooting

- If you get module not found errors for `appwrite`, ensure you installed the package and restarted Metro.
- If `databases.createDocument` fails check your collection ID and permissions (rule/permissions on collection). The collection must accept writes from the project or appropriate roles.
- If signup works but `adb` is missing during Expo Android build: see your WSL notes earlier to install or expose Android SDK/adb.

## Next steps and improvements

- Add navigation after login to route users to the main app screen.
- Add email verification UX handling (Appwrite can require verification).
- Implement logout, password reset, and profile edit flows.
- Move any admin operations (server keys) to an Appwrite Function or backend.

If you'd like, I can also:

- Add form validation with informative errors.
- Wire navigation to a protected route after login.
- Create a serverless Appwrite Function for secure user creation.

## Navbar and route protection added

- I added a small top-right navbar in `app/(tabs)/_layout.tsx` with `Login` and `Sign up` buttons that navigate to `/(auth)/login` and `/(auth)/signup`.
- To protect certain routes I added layout wrappers:
  - `app/profile/_layout.tsx`
  - `app/saved/_layout.tsx`

  These use the same Appwrite `account.get()` check (via `app/lib/useAuth.ts`) and redirect unauthenticated users to `/(auth)/login`.

  Why: Expo Router doesn't have a server-style middleware for client-side auth checks in all environments, so protecting a route using a layout wrapper is a reliable pattern that keeps redirects local to the client and preserves router behaviour.
