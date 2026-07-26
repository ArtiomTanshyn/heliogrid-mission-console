# HelioGrid Mock Universe State

This document is the source of truth for the current fictional mock universe used by HelioGrid Mission Console.

HelioGrid is a fictional orbital logistics and research operations company. The app helps mission control track operators, crews, service lines, mission value, reliability, incidents, recovery, and operational performance.

No real brands, real people, real emails, real teams, real places, or real organizations are used as business entities.

## Architecture Rules

- Keep the app's functionality intact.
- Keep the established architecture:

```text
mock backend DTO -> API layer -> Pinia store -> mapper/domain model -> page composable -> template
```

- Do not introduce backend/network calls.
- Keep mock files as backend-like DTO payloads.
- Keep mappers between backend DTO shape and frontend domain models.
- Keep Pinia stores as the data-loading boundary for pages.
- Keep page composables as the place where data is prepared for templates.
- Keep domain-specific constants, labels, statuses, analytics, types, and mappers under `src/entities`.
- Keep route/use-case filter, table, export, and page preparation logic under `src/features`.
- Keep only framework-agnostic helpers and reusable presentation primitives under `src/shared`.
- After each large pass, run `npx vue-tsc -b`.
- After logic or architecture changes, run `npm run check` on Node `^22.18.0 || >=24.11.0`.
- Full `npm run build` requires Node `^22.18.0 || >=24.11.0`; local shells on Node 18 should use `npx vue-tsc -b` for validation.

## Current Routes

- `/` - dashboard
- `/operators`
- `/operators/:id`
- `/ledger`
- `/settings`

## Access Roles

These roles control demo access/scoping in settings and stores.

- `Control Admin`
- `Crew Lead`
- `Operator`

## Operator Roles

These roles describe people in the business data.

- `Field Operator`
- `Crew Lead`
- `Mission Strategist`
- `Flight Director`

## Operator Statuses

- `ready`
- `paused`
- `onboarding`

## Mission Order Statuses

- `confirmed`
- `incident`
- `recovered`

## Operating Regions

- `Low Earth Orbit`
- `Lunar Corridor`
- `Mars Relay`
- `Deep Space Network`

## Service Lines

- `Satellite Deployment`
- `Cargo Resupply`
- `Orbital Imaging`
- `Research Payload`

## Crews

Current crew IDs and names:

- `crew-aurora` - `Aurora Crew`
- `crew-zenith` - `Zenith Crew`
- `crew-polaris` - `Polaris Crew`
- `crew-atlas` - `Atlas Crew`
- `crew-kepler` - `Kepler Crew`
- `crew-vega` - `Vega Crew`

## Operators

Current operator rules:

- IDs use `operator-001`, `operator-002`, and so on.
- Email domain is `heliogrid.demo`.
- Names are fictional.
- Some `avatar_url` records are `null` to verify initials fallback.
- `operator-002` is the seeded crew lead for scoped crew access.
- `operator-001` is the seeded operator for own-record access.

## Mission Orders

Current mission order rules:

- IDs use `mission-0001` and `mission-scenario-001` patterns.
- DTO fields use `operator_id`, `service_line`, `mission_value`, `ops_credit`, `status`, and `created_at`.
- Generated dates use an explicit UTC helper:

```ts
const toIsoDate = (year: number, month: number, day: number) => new Date(Date.UTC(year, month - 1, day)).toISOString()
```

- Filter comparisons use `YYYY-MM-DD` slices:

```ts
const date = missionOrder.createdAt.slice(0, 10)
```

Recommended mission value ranges:

| Service line         | Mission value range |
| -------------------- | ------------------- |
| Satellite Deployment | 35000-120000        |
| Cargo Resupply       | 18000-65000         |
| Orbital Imaging      | 8000-35000          |
| Research Payload     | 12000-55000         |

`ops_credit` stays formula-compatible with mission value:

- Recommended range: `7%-12%` of mission value.
- Numeric money formatting remains unchanged.

## Current Dataset Baseline

- `48` operators.
- `6` crews.
- `4` operating regions.
- `4` service lines.
- `480` mission orders across `2025-2026`.
- At least `20` mission orders per service line per year.
- At least one operator in every operator role.
- At least one operator in every operator status.
- At least one mission order for every mission status.

Current mission status distribution target:

- `confirmed`: about `65%-75%`
- `recovered`: about `15%-25%`
- `incident`: about `8%-15%`

Current service line distribution target:

- Each service line should stay between `20%-30%` of total mission orders.

## Required Scenarios

Scenario records should stay intentional, not only generated.

Minimum scenarios:

- A top operator with high mission value and high reliability.
- A low-performing operator with several incidents.
- An onboarding operator with zero or low mission activity.
- A paused operator with historical mission activity.
- An operator with no avatar to verify initials fallback.
- A crew lead whose scoped view shows only their crew.
- An operator scoped view that shows only their own record/details.
- An exportable ledger for Control Admin.
- A restricted export state for Operator.

Filter verification scenarios:

- Operating Region + Operator Role returns rows.
- Crew + Status returns rows.
- Service Line + Date Range returns rows.
- Search by name returns one clear operator.
- Search by email returns one clear operator.
- Combined filter returns one predictable row:
  `Lunar Corridor + Field Operator + Aurora Crew + Research Payload + July 2026`.
- Ledger filter returns predictable rows:
  `Deep Space Network + Mission Strategist + Cargo Resupply + Dec 2025`.

## Metric Semantics

Keep the formulas unless there is a separate explicit task to redesign scoring.

- `totalMissionOrders`: total mission orders.
- `activeMissionOrders`: confirmed or recovered mission orders.
- `totalMissionValue`: total mission value.
- `totalOpsCredit`: total ops credit.
- `incidentCount`: incident count.
- `incidentRate`: incident rate.
- `reliabilityRate`: reliability rate.
- `readinessRate`: readiness rate.
- `missionScore`: mission performance score.
- `valueContributionScore`: value contribution score.
- `incidentPenalty`: incident penalty.

## Verification Checklist

Run after large changes:

```bash
npx vue-tsc -b
npm run lint
npm run format:check
npm test
npm run check:boundaries
npm run check:vocabulary
npm run check
```

Verify manually:

- Dashboard loads for Control Admin, Crew Lead, and Operator.
- Operators page Apply/Reset works.
- URL filters normalize invalid query params.
- Each operator filter returns expected data.
- Operator details page loads correct mission orders.
- Ledger Apply/Reset works.
- CSV/JSON export filenames use HelioGrid terminology.
- Final UI, docs, routes, and mock values remain fictional.
