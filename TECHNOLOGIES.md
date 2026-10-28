# Added technologies

Technologies added on top of the initial project setup, and why.

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
