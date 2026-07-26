# HelioGrid App Investigation

Updated: 2026-07-26

## 1. Snapshot

`heliogrid-mission-console` is a frontend SaaS dashboard demo for a fictional orbital logistics company. The app runs entirely on mock data, but follows a production-style approach: a separate API layer, Pinia stores, routing, reusable components, business calculations, operations ledger, and exports.

Current status: working Vue 3 + PrimeVue 4 prototype. The architecture preserves the `mock backend DTO -> API layer -> Pinia store -> mapper/domain model -> page composable -> template` boundary.

## 2. Stack And Commands

Core stack:

- Vue 3.5
- Vite 8
- TypeScript 5.9
- Pinia 4
- Vue Router 5
- PrimeVue 4 + `@primeuix/themes` + PrimeIcons
- Chart.js 4 + vue-chartjs
- Vitest 4 + Vue Test Utils 2 + jsdom
- Playwright for browser-level e2e smoke tests

Commands:

```bash
npm install
npm run dev
npx vue-tsc -b
npm run build
npm test
npm run lint
npm run format:check
npm run check:boundaries
npm run check:vocabulary
npm run check
npm run test:e2e
npm run preview
```

Runtime requirement:

- Node `^22.18.0 || >=24.11.0`
- `.nvmrc` pins local and CI execution to Node `22.18.0`.

On local Node 18, use `npx vue-tsc -b`; the full Vite build requires a newer Node version.

CI:

- `.github/workflows/ci.yml` installs with `npm ci`, then runs `npm run check`, `npm run build`, installs Chromium, and runs `npm run test:e2e` on the Node version from `.nvmrc`.
- `.github/workflows/deploy-pages.yml` builds a GitHub Pages artifact for `ArtiomTanshyn/heliogrid-mission-console`, validates it with Playwright, and deploys it through GitHub Pages.

## 3. Project Structure

```text
src/
  api/                 Mock API facade and backend-like DTO contracts
    dto/               Snake_case API payload TypeScript models
  app/
    access/            Demo access policy, access-role labels and role constants
    router/            Vue Router setup
  entities/            Domain models, labels, statuses, analytics and DTO mappers
    crew/
    ledger/
    mission-order/
    operator/
  features/            Route/use-case-owned UI preparation, filters, tables and exports
    dashboard/
    ledger/
    operator-details/
    operators/
  assets/styles/       Global theme and base styles
  assets/theme/        PrimeVue preset and tokens
  layouts/             Application shell
  mock/                Backend-like mock operators, crews and mission orders
  pages/               Route pages
  shared/lib/          Framework-agnostic formatting, CSV, date and option helpers
  shared/ui/           Reusable UI components and PrimeVue/chart presentation constants
  stores/              Pinia state modules
docs/
  API_CONTRACTS.md     Lightweight backend contract for future adapter work
```

Entry points:

- `src/main.ts` registers Vue, Pinia, Router, PrimeVue components, global styles.
- `src/App.vue` renders `RouterView`.
- `src/app/router/index.ts` defines the route tree under `AppLayout`.

Routes:

- `/` - Dashboard
- `/operators` - Operators table and filters
- `/operators/:id` - Operator details
- `/ledger` - Operations ledger preview and exports
- `/settings` - Access role demo switcher

## 4. Domain Model

Core entities:

- `Operator`: fictional crew member profile with crew, role, status, operating region and join date.
- `Crew`: fictional operating crew with region and lead operator id.
- `MissionOrder`: mission event with service line, mission value, ops credit, status and date.
- `OperatorPerformance`: derived metrics per operator.
- `LedgerRow`: flattened operations row for preview/export.
- API DTOs: backend-like snake_case payloads under `src/api/dto`.

Mock dataset:

- `mockOperators`: 48 generated operator DTOs with scenario-based roles, statuses, null-avatar cases, crew links and access-scope seeds.
- `mockCrews`: 6 fictional crew DTOs.
- `mockMissionOrders`: 480 mission order DTOs across 2025-2026 with balanced service lines and explicit verification scenarios.

Important statuses:

- Operator statuses: `ready`, `paused`, `onboarding`.
- Mission order statuses: `confirmed`, `incident`, `recovered`.
- Value-bearing mission orders: `confirmed` and `recovered`.

## 5. Business Logic

Business calculations live in entity model modules.

- `src/entities/operator/model/performance.ts`: operator performance formulas.
- `src/entities/mission-order/model/analytics.ts`: mission order grouping and value-bearing status helpers.

Current formulas:

- `totalMissionOrders`: count of all mission orders for the operator.
- `activeMissionOrders`: count of `confirmed` or `recovered` mission orders.
- `totalMissionValue`: sum of value-bearing mission order value.
- `totalOpsCredit`: sum of value-bearing ops credit.
- `incidentRate`: `incidentCount / totalMissionOrders * 100`.
- `reliabilityRate`: `activeMissionOrders / totalMissionOrders * 100`.
- `readinessRate`: synthetic score capped at 96.
- `valueContributionScore`: `totalMissionValue / 100000 * 100`, capped at 100.
- `incidentPenalty`: `100 - incidentRate`.
- `missionScore`: weighted blend of value contribution, reliability, readiness and incident risk.

Chart aggregations:

- `groupMissionValueByMonth`
- `groupMissionOrdersByServiceLine`
- `groupIncidentsByMonth`

Known limitation: monthly grouping uses month number only and hardcodes labels for 2025. If data spans multiple years, charts merge same months from different years.

## 6. Data Flow

High-level flow:

```text
Page -> feature model -> Pinia store -> api/* -> mock DTOs -> entity mappers -> domain models -> entity analytics -> UI
```

API layer:

- `operatorsApi.ts`: filtering, crew enrichment, operator metrics.
- `dashboardApi.ts`: scoped console summary and chart data.
- `ledgerApi.ts`: ledger rows from `getOperators`.
- `missionOrdersApi.ts`: mission order lookup.
- `mockApi.ts`: artificial async delay.

Mapper layer:

- `src/entities/operator/api/mappers.ts`: `OperatorDto`/`CrewDto` to frontend `Operator`/`Crew`/`OperatorWithMetrics`.
- `src/entities/mission-order/api/mappers.ts`: `MissionOrderDto` to frontend `MissionOrder`.
- DTO field names should not leak into pages, stores, or components.

Stores:

- `operatorsStore`: operators list, crews, selected operator, selected mission orders, role-scoped loading.
- `dashboardStore`: dashboard summary.
- `ledgerStore`: generated ledger rows.
- `userStore`: current demo access role and simple permission getters.

Page composables:

- `src/features/dashboard/model/useDashboardPage.ts`: prepares dashboard KPI cards and chart datasets for rendering.
- `src/features/operator-details/model/useOperatorDetailsPage.ts`: owns route-driven operator detail loading and prepares profile tags, KPI cards, chart datasets, latest mission orders and score formula rows.
- `src/features/ledger/model/useLedgerPage.ts`: owns ledger filters, initial loading, options, summary cards and export handlers.
- `src/features/operators/model/useOperatorsPage.ts`: owns operators URL filter synchronization, initial crews/operators loading and filter reset wiring.

The app currently has no persistence. Changing access role in Settings is an in-memory demo state and resets on reload.

## 7. Main User Flows

Dashboard:

- Loads scoped console summary on mount.
- Shows mission value, ops credit, ready operators, reliability, incident rate and top operator.
- Hides console-wide value and ops credit for scoped access roles only in UI rendering.
- Displays mission value, service line mix, role performance and incident charts.

Operators:

- Loads crews, then operators.
- Supports search, operating region, role, crew, status, service line and date filters.
- Applies filters explicitly through Apply/Reset controls.
- Validates and normalizes URL query parameters before applying them.
- Displays desktop table and mobile cards.
- Opens operator details from row/card action.

Operator Details:

- Loads crews and selected operator details.
- Enforces basic role scoping in `operatorsStore.loadOperatorDetails`.
- Shows profile, KPI cards, charts, latest mission orders and score explanation.

Operations Ledger:

- Loads crews and generates initial ledger preview.
- Supports date, operating region, crew, role and service line filters.
- Applies ledger filters explicitly through Apply/Reset controls.
- Normalizes filter values before generating preview rows.
- Scopes generated preview rows by current role before rendering/export.
- Exports CSV/JSON only when `userStore.canExport` is true.
- Preview uses PrimeVue `DataTable`.

Settings:

- Switches demo access role between `Control Admin`, `Crew Lead` and `Operator`.
- Shows access-role permission description.

## 8. Role and Access Model

Current role model:

- `Control Admin`: sees all operators and exports ledger rows.
- `Crew Lead`: operators list is scoped to assigned crew.
- `Operator`: operators list is scoped to the current operator.

Implementation notes:

- Role state lives in `src/stores/userStore.ts`.
- Access rules live in `src/app/access/policy.ts`.
- Operators list scoping is delegated from `operatorsStore.loadOperators` to access policy helpers.
- Operator details scoping is delegated from `operatorsStore.loadOperatorDetails` to access policy helpers.
- Ledger preview generation is scoped by role, and export buttons are disabled by `canExport`.
- Dashboard summary is scoped by role before metrics and charts are calculated.

Risk: this is acceptable for a demo, but not a secure authorization model. Real authorization must be enforced by backend/API contracts.

## 9. UI Architecture

Layout:

- `AppLayout.vue` provides sidebar, topbar and route content.
- Pages use shared `.page`, `.panel`, `.grid-*` classes from global CSS.

Reusable UI components:

- `src/shared/ui/components/MetricCard.vue`: KPI card with icon/tone.
- `src/shared/ui/components/StateBlock.vue`: empty/error state.
- `src/shared/ui/components/ChartCard.vue`: chart container.
- `src/shared/ui/components/BaseChart.vue`: chart.js wrapper.

Feature UI components:

- `src/features/operators/ui/OperatorsFilters.vue`: operators filter form.
- `src/features/operators/ui/OperatorsTable.vue`: desktop table + mobile list.
- `src/features/operator-details/ui/MissionOrdersTable.vue`: compact mission order table.

Styling:

- Global tokens are in `src/assets/styles/theme.css`.
- PrimeVue 4 design tokens are in `src/assets/theme`.
- Global layout/table/helpers are in `src/assets/styles/base.css`.
- Component-specific styles are scoped.

## 10. Current Quality Assessment

Strengths:

- Clear separation between mock DTOs, API facade, entities, features, stores, pages, and shared UI/lib.
- TypeScript domain types are present and readable.
- Mock API layer makes future backend integration easier.
- Backend-like DTO mocks and mapper layer isolate API payload shape from UI/domain models.
- Access policy helpers centralize role permissions and operator scoping.
- Route-level lazy loading is already used.
- UI covers loading, empty and error states in key places.
- Mock universe includes balanced service lines, explicit scenarios, UTC dates and access-scope seeds.
- Unit tests cover the highest-risk domain, mapper, filter, access, CSV, and reusable UI contracts.
- Store/API tests cover scoped dashboard and ledger access paths plus async failure handling.
- Operators URL filter changes are debounced, and the operators store ignores stale list responses.
- Monthly mission charts group by UTC year-month instead of merging matching months across years.
- Inaccessible operator details stay on the details page and use the existing error fallback.
- Avatar smoke tests cover inline SVG data and initials fallback rendering.
- Playwright e2e smoke tests cover the main routes and the inaccessible details fallback.
- Lightweight backend API contracts are documented in `docs/API_CONTRACTS.md`.
- GitHub Pages deployment is configured with `VITE_BASE_PATH=/heliogrid-mission-console/`, Vue Router base history, and a `404.html` SPA fallback.
- Generated `dist` artifacts stay ignored and are not committed.
- ESLint and Prettier are wired into the quality scripts.
- Import boundary checks protect `shared`, `entities`, `features`, `api`, `stores`, and `mock` dependency direction.
- Retired vocabulary checks protect UI, docs, routes, and mock values from previous-domain regressions.
- `npm audit --audit-level=high` is clean after pinning Vue Test Utils.

Gaps:

- No `.env.example` or runtime configuration story.
- No accessibility pass beyond basic labels/icons.
- No visual regression checks.

## 11. Technical Risks

High priority:

- No high-priority technical risk is currently identified for the frontend-only demo scope.

Medium priority:

- Export uses object key order from first row; stable for current rows, but fragile if ledger shape changes.
- Mock avatars use inline SVG data URIs, with intentional null-avatar records for initials fallback.

Low priority:

- Global PrimeVue component registration is convenient but broad.
- Some copy is demo-oriented and may need a more product-like voice later.

## 12. Recommended Roadmap

Phase 1: Stabilize foundation

- Push the repository to GitHub and enable Pages with GitHub Actions as the source.

Phase 2: Tighten product behavior

- Add date range validation and clear filter labels.
- Improve empty/loading/error states for ledger and details.

Phase 3: Prepare backend integration

- Replace mock API with adapter pattern or service interface.
- Add environment config for API base URL.
- Add auth/session model and route guards.
- Add integration tests around data scoping.

Phase 4: Polish and scale

- Add accessibility pass.
- Add chart tooltip/legend refinements.
- Add saved ledger presets.
- Add CSV schema/version metadata if ledger exports become a product feature.

## 13. Suggested First Issues

1. Push the repository to GitHub and enable Pages with GitHub Actions as the source.
2. Add an adapter for switching between mock and backend APIs.
3. Add date range validation and clear filter labels.

## 14. Verification Notes

During this update:

- Core source files were reviewed.
- `npx vue-tsc -b` passed after each major stage.
- `npm test` passed on Node `v22.22.2`.
- `npm run lint` and `npm run format:check` passed.
- `npm run check:boundaries` passed.
- `npm run check:vocabulary` passed.
- `npm run build` passed on Node `v22.22.2`.
- Mock universe distribution was checked with a temporary Node command.
- Git status could not be used because the project directory is not a git repository.
