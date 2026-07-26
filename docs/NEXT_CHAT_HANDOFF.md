# Next Chat Handoff

Use this file as the compact starting context for the next implementation session.

`docs/MOCK_UNIVERSE_PLAN.md` remains the source of truth for the fictional business universe and data rules.

## Must Read First

1. `docs/NEXT_CHAT_HANDOFF.md`
2. `docs/MOCK_UNIVERSE_PLAN.md`
3. `docs/APP_INVESTIGATION.md`
4. `docs/NEXT_STEPS.md`

## Current State

- The app is `heliogrid-mission-console`, a Vue 3 + PrimeVue 4 SaaS dashboard demo.
- The active domain is HelioGrid Mission Console, a fully fictional orbital logistics and research operations console.
- The mock universe migration is complete across visible UI, route names, docs, DTO values, API layer, stores, mappers, composables, and exports.
- The desired data path is preserved:

```text
mock backend DTO -> API layer -> Pinia store -> mapper/domain model -> page composable -> template
```

- Mock files should continue to look like backend payloads, with snake_case DTO fields under `src/api/dto`.
- Domain models, labels, statuses, analytics, and DTO mappers belong under `src/entities`.
- Route-owned filtering, table, export, and page preparation logic belongs under `src/features`.
- `src/shared` is intentionally small and should contain only framework-agnostic helpers and reusable presentation primitives.
- `.github/workflows/ci.yml` runs `npm run check` and `npm run build` on Node from `.nvmrc`.
- Error-path tests now cover failed ledger API dependencies and async store load failures.
- Operator details stay on the details page for inaccessible or missing records and show the existing error fallback after stale detail data is cleared.
- Monthly mission charts now group by UTC year-month and render year-aware labels.
- Operators URL filter reloads are debounced, and the operators store ignores stale list responses.
- Avatar smoke tests cover mock inline SVG avatars and UI initials fallback rendering.
- Playwright e2e smoke tests cover Dashboard, Operators, Operator Details, inaccessible details fallback, Ledger, and Settings.
- Lightweight backend API contracts are documented in `docs/API_CONTRACTS.md`.
- Generated `dist` artifacts stay ignored and are not committed.
- GitHub Pages deployment is configured for `ArtiomTanshyn/heliogrid-mission-console`; expected Pages URL is `https://artiomtanshyn.github.io/heliogrid-mission-console/`.
- `vite.config.ts` reads `VITE_BASE_PATH`, and `src/app/router/index.ts` uses `import.meta.env.BASE_URL`.
- `.github/workflows/deploy-pages.yml` builds with `VITE_BASE_PATH=/heliogrid-mission-console/`, copies `dist/index.html` to `dist/404.html`, runs e2e smoke tests against that base path, and deploys the Pages artifact.

## Runtime

The project requires Node `^22.18.0 || >=24.11.0`.

This local machine has a working Node 22 binary at:

```bash
/Users/artem/.nvm/versions/node/v22.22.2/bin
```

Use this prefix when needed:

```bash
PATH=/Users/artem/.nvm/versions/node/v22.22.2/bin:$PATH npm run check
PATH=/Users/artem/.nvm/versions/node/v22.22.2/bin:$PATH npm run build
PATH=/Users/artem/.nvm/versions/node/v22.22.2/bin:$PATH npm run test:e2e
```

The default shell Node may be older and is not enough for the full Vite build or Playwright e2e run. Local Playwright browser binaries can be installed with `npx playwright install chromium`.

## Verification Commands

After each large pass:

```bash
npx vue-tsc -b
```

After logic, architecture, test, or toolchain changes:

```bash
npm run check
npm run build
npm run test:e2e
```

`npm run check` currently runs:

```text
vue-tsc -b
eslint .
prettier . --check
vitest run
node scripts/check-import-boundaries.mjs
node scripts/check-legacy-vocabulary.mjs
```

## Guardrails

- Do not change the established architecture without explicit agreement.
- Do not add real brands, real organizations, real people, real emails, or real places as product data.
- Do not reintroduce retired wording from the previous business concept into UI, docs, routes, or mock values.
- Keep behavior intact unless the user explicitly approves behavior changes.
- Keep mock data scenario-driven and connected across operators, crews, mission orders, dashboard summaries, details, filters, ledger preview, and exports.
- Use existing aliases and local patterns instead of creating parallel conventions.
- The project directory is not currently a git repository, so normal `git status` checks are unavailable here.

## Next Implementation Plan

1. Push the local project to `ArtiomTanshyn/heliogrid-mission-console`.
2. In GitHub, enable Pages with `Settings -> Pages -> Build and deployment -> Source: GitHub Actions`.
3. Add an adapter for switching between mock and backend APIs.

## Starter Prompt

```text
We are working in:
/Users/artem/Desktop/UP/heliogrid-mission-console

Before coding, read:
docs/NEXT_CHAT_HANDOFF.md
docs/MOCK_UNIVERSE_PLAN.md
docs/APP_INVESTIGATION.md
docs/NEXT_STEPS.md

Primary source of truth:
docs/MOCK_UNIVERSE_PLAN.md

Current goal:
Continue the stabilization plan from docs/NEXT_STEPS.md. Push the local project to `ArtiomTanshyn/heliogrid-mission-console`, then enable GitHub Pages with GitHub Actions as the source.

Constraints:
- Keep the current Vue 3 + PrimeVue 4 architecture.
- Preserve this data path: mock backend DTO -> API layer -> Pinia store -> mapper/domain model -> page composable -> template.
- Do not change app behavior without explicit agreement.
- Do not reintroduce retired wording from the previous business concept into UI, docs, routes, or mock values.
- Keep all product data fictional.
- After each large pass, run npx vue-tsc -b.
- For full checks/builds, use Node ^22.18.0 || >=24.11.0.

Useful local command prefix:
PATH=/Users/artem/.nvm/versions/node/v22.22.2/bin:$PATH
```
