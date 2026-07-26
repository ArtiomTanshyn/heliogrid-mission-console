# HelioGrid Mission Console

A production-like Vue 3 dashboard demo for a fictional orbital logistics company. The app tracks operators, crews, operating regions, service lines, mission value, ops credit, reliability, incidents, readiness, and composite mission scores.

This project is designed as an Upwork portfolio case study for Middle/Senior Frontend Developer profiles. It focuses on frontend architecture, realistic business logic, mock API boundaries, complex UI states, charts, filters, tables, responsive layouts, and clean TypeScript code.

## Features

- Modern SaaS dashboard layout with sidebar navigation and top header
- Dashboard metrics: mission value, ops credit, ready operators, reliability, incident rate, and top operator
- Chart.js analytics for mission value by month, mission orders by service line, performance by operator role, and incident trends
- Operators page with search, filters, sorting, pagination, loading, empty, and error states
- URL-synced operator filters for shareable table views
- Operator details page with profile, metric cards, charts, latest mission orders, and score explanation
- Operations ledger page with filterable preview, CSV export, and JSON export
- Settings page with Control Admin, Crew Lead, and Operator access role switcher
- Role-based UI/data logic for full-console, crew-level, and own-operator views
- Mock API layer with async delays and no backend dependency
- Responsive desktop table and mobile card view for operators

## Tech Stack

- Vue 3
- Vite
- TypeScript
- Pinia
- Vue Router
- PrimeVue
- PrimeIcons
- Chart.js
- vue-chartjs
- Vitest
- Vue Test Utils
- Playwright
- Scoped CSS and CSS variables

## Business Logic

Operator performance metrics are calculated in `src/entities/operator/model/performance.ts`.
Mission order chart aggregations live in `src/entities/mission-order/model/analytics.ts`.

- `totalMissionOrders` = all mission order count
- `activeMissionOrders` = mission orders where status is `confirmed` or `recovered`
- `totalMissionValue` = sum of confirmed or recovered mission value
- `totalOpsCredit` = sum of confirmed or recovered ops credit
- `incidentRate` = incident mission orders / total mission orders * 100
- `reliabilityRate` = active mission orders / total mission orders * 100
- `valueContributionScore` = min(total mission value / 100000 * 100, 100)
- `missionScore` = valueContributionScore * 0.4 + reliabilityRate * 0.3 + readinessRate * 0.2 + incidentPenalty * 0.1

## Project Structure

```text
src/
  app/
    access/
    router/
  api/
    dto/
  entities/
    crew/
    ledger/
    mission-order/
    operator/
  features/
    dashboard/
    ledger/
    operator-details/
    operators/
  layouts/
  mock/
  pages/
  shared/
    lib/
    ui/
  stores/
```

## Run Locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Quality checks:

```bash
npm test
npm run lint
npm run format:check
npm run check:boundaries
npm run check:vocabulary
npm run check
npm run build
npm run test:e2e
```

The full build and Playwright smoke tests require Node `^22.18.0 || >=24.11.0`. Run `npx playwright install chromium` once before local e2e execution. On older Node versions, run `npx vue-tsc -b` for type validation.

## Deploy To GitHub Pages

This project is configured for a GitHub Pages project site at:

```text
https://artiomtanshyn.github.io/heliogrid-mission-console/
```

Deployment runs from `.github/workflows/deploy-pages.yml` on pushes to `main` and through manual workflow dispatch. The workflow builds with:

```bash
VITE_BASE_PATH=/heliogrid-mission-console/ npm run build
```

It uploads `dist` as a Pages artifact and creates `dist/404.html` for Vue Router history fallback. `dist` stays ignored and should not be committed.

In GitHub, enable Pages with `Settings -> Pages -> Build and deployment -> Source: GitHub Actions`.

## Why This Is a Production-Like Frontend Demo

The app separates business calculations, formatting, data access, state management, routing, and UI components into clear layers. The frontend behaves like it communicates with a real backend through async API modules, while remaining fully self-contained for portfolio publishing and GitHub review.

## Project Documentation

- [Next chat handoff](docs/NEXT_CHAT_HANDOFF.md) - compact context and starter prompt for continuing implementation.
- [App investigation](docs/APP_INVESTIGATION.md) - current architecture, flows, risks, and quality assessment.
- [Next steps](docs/NEXT_STEPS.md) - practical backlog for stabilizing and improving the app.
- [Mock universe plan](docs/MOCK_UNIVERSE_PLAN.md) - source of truth for fictional data and domain rules.
- [API contracts](docs/API_CONTRACTS.md) - lightweight backend contract for future adapter work.
