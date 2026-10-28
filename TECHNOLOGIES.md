# Added technologies

Technologies added on top of the initial project setup or updated in it, and why.

## msw

[Mock Service Worker](https://mswjs.io/) intercepts network requests and responds with mock data.

There is no real backend for this task, so `GET /api/filters` is served by MSW from `src/shared/temp/filterData.json`. The app code uses a regular `fetch` and knows nothing about the mock, so switching to a real API only requires removing the mock setup — components and hooks stay the same. The same request handlers are reused in tests (`msw/node`), so integration tests go through a real `fetch` as well.

- Handlers: `src/shared/api/mocks/handlers.ts`
- Test server: `src/shared/api/mocks/node.ts`, started in `setupTest.ts`
- Generated worker script: `public/mockServiceWorker.js` (do not edit manually)
- Enabled in `src/main.tsx` in every environment, including the production build, since there is no backend. **Remove once the real API is available.**

Version 2.x is used because msw 3 requires TypeScript ≥ 5.9 and Node ≥ 22.12.

## clsx + tailwind-merge

Used together in the `cn()` helper (`src/shared/lib/cn.ts`) to build `className` strings:

- `clsx` joins classes and skips falsy values, which makes conditional classes readable
- `tailwind-merge` resolves conflicting Tailwind classes so the last one wins. Without it, `className="px-4"` passed to a component with `px-6` inside gives an unpredictable result, because the winner is decided by the order of rules in the generated CSS, not by the order in the class string

## Updated: @typescript-eslint 6 → 8

`@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` were updated from 6.21 to 8.

Version 6 supports TypeScript `<5.4`, while the project uses TypeScript 5.8, so every lint run printed an "unsupported TypeScript version" warning in the terminal (it is shown only in an interactive terminal, so CI logs don't have it). Version 8 supports TypeScript `<6.1` and still works with ESLint 8 and the existing `.eslintrc.cjs`; the code needed no changes.

## Updated: @testing-library/react 14 → 16, added @testing-library/dom

Version 14 supports only React 18, while the project uses React 19, so a clean `pnpm install` reported unmet peer dependencies. Version 16 supports React 18 and 19. Since version 16, `@testing-library/dom` is a peer dependency instead of a bundled one, so it is installed explicitly.

With the new version React reports state updates made outside `act()`; the one test that starts a refetch directly through the query client wraps it in `act`.

## Updated: CI pipeline

`.github/workflows/pipeline.yml` was updated:

- **Node 22 and 24 instead of 18 and 20.** Node 18 and 20 reached end of life (April 2025 and April 2026). Node 22 and 24 are maintained LTS versions (until April 2027 and April 2028), and the matrix checks that the project works on both of them (one job per version)
- **pnpm version is pinned** in the `packageManager` field of `package.json` and installed with `pnpm/action-setup`. Previously the latest pnpm was installed on every run, so a new pnpm release could break the build
- **`pnpm install --frozen-lockfile`** fails if `pnpm-lock.yaml` doesn't match `package.json` instead of silently updating it
- **Dependencies are cached** by `actions/setup-node`, so repeated runs are faster
- **Tests are run** before the build; type checking is part of the build (`tsc`)
- **Actions updated to versions running on Node 24:** `actions/checkout@v7`, `actions/setup-node@v7`, `pnpm/action-setup@v6`. Older versions run on the deprecated Node 20 (or older) runtime, and GitHub marks every run with a deprecation warning
