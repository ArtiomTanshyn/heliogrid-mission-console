# Next Steps

This file tracks the practical refinement backlog for HelioGrid Mission Console after the mock universe update.

## Immediate

- Push the local project to `ArtiomTanshyn/heliogrid-mission-console` and enable GitHub Pages with GitHub Actions as the source.

## Soon

- Add an adapter for switching between mock and backend APIs.

## Later

- Run an accessibility review.

## Documentation Ownership

Keep these documents current:

- `README.md` - concise project entry point.
- `docs/NEXT_CHAT_HANDOFF.md` - compact startup context and starter prompt for future implementation sessions.
- `docs/APP_INVESTIGATION.md` - technical map of the current state.
- `docs/NEXT_STEPS.md` - short working backlog.
- `docs/MOCK_UNIVERSE_PLAN.md` - historical mock universe migration plan if it remains in the repository.

## Completed

- GitHub Actions CI workflow runs `npm run check` and `npm run build` on Node `22.18.0` from `.nvmrc`.
- Error-path API/store tests cover failed ledger dependencies and async store load failures.
- Operator details clear stale data while an inaccessible or missing details route resolves to the existing error fallback.
- Mission monthly chart grouping uses year-month keys and year-aware labels.
- Operators URL filter reloads are debounced, and stale operators responses cannot overwrite newer results.
- Avatar smoke tests cover inline SVG avatars and initials fallback rendering.
- Playwright e2e smoke tests cover Dashboard, Operators, Operator Details, inaccessible details fallback, Ledger, and Settings.
- Lightweight backend API contracts are documented in `docs/API_CONTRACTS.md`.
- Generated `dist` artifacts stay ignored and are not committed.
- GitHub Pages deployment is configured for `ArtiomTanshyn/heliogrid-mission-console` with a Pages artifact workflow and SPA fallback.
- PrimeVue 4 migration with `helioGridPreset`.
- Feature/entity/shared module ownership for icons, UI variants, statuses, roles, service lines, table settings, chart settings, and export settings.
- Backend-like mock DTOs with mapper layer between API payload and frontend domain models.
- HelioGrid Mission Console visible copy across layout, dashboard, operators, details, ledger, settings, tables, charts and exports.
- Scenario-driven mock universe with 48 operators, 6 crews, 4 operating regions, 4 balanced service lines and 480 UTC mission orders.
- Dashboard page-level display logic in `useDashboardPage`.
- Operator details page-level display logic in `useOperatorDetailsPage`.
- Ledger page-level display logic in `useLedgerPage`.
- Operators page URL filter and loading wiring in `useOperatorsPage`.
- Access/role rules centralized in `src/app/access/policy.ts`.
- Dashboard summary uses role-scoped operator and mission order data.
- Ledger generation uses role-scoped operator data before preview/export.
- Operators filters use explicit Apply/Reset, validated URL query params, stable PrimeVue 4 layout, and 2025-2026 mock mission scenarios.
- Ledger filters use explicit Apply/Reset controls, result summary, and value normalization before generation.
- Full `npm run build` passed on local Node `v22.22.2`.
- Vitest + Vue Test Utils test stack added.
- Unit tests cover operator performance formulas, mission order analytics, DTO mappers, access policy, operators filters, ledger filters, CSV export, and `StateBlock`.
- Import boundary check added through `npm run check:boundaries`.
- `npm audit --audit-level=high` found 0 vulnerabilities after pinning Vue Test Utils.
- ESLint flat config and Prettier config added.
- Store/API scoped dashboard and ledger tests added.
- Next-chat handoff document added.
- Retired vocabulary check added and wired into `npm run check`.
