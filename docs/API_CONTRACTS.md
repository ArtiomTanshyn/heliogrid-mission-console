# HelioGrid API Contracts

This document defines a lightweight backend contract for HelioGrid Mission Console. It mirrors the current mock API facade while preserving the app data path:

```text
backend DTO -> API layer -> Pinia store -> mapper/domain model -> page composable -> template
```

The app still runs entirely on fictional local mock data. These contracts are for future backend replacement work and should not bypass the existing API, store, mapper, or feature boundaries.

## Contract Rules

- External payloads use backend-like `snake_case` fields.
- Frontend domain models use `camelCase` fields after mapper conversion.
- Product data must remain fictional in mock fixtures and demos.
- Access scoping must be enforced by a real backend. The current frontend access policy is demo logic only.
- Dates are ISO 8601 strings. Date-only filters use `YYYY-MM-DD`.
- Money values are numeric base units already used by the UI formatters.
- Percent values are numbers from `0` to `100`.

## Shared Enums

```ts
type AccessRole = 'Control Admin' | 'Crew Lead' | 'Operator'

type OperatingRegion = 'Low Earth Orbit' | 'Lunar Corridor' | 'Mars Relay' | 'Deep Space Network'

type OperatorRole = 'Field Operator' | 'Crew Lead' | 'Mission Strategist' | 'Flight Director'

type OperatorStatus = 'ready' | 'paused' | 'onboarding'

type ServiceLine = 'Satellite Deployment' | 'Cargo Resupply' | 'Orbital Imaging' | 'Research Payload'

type MissionOrderStatus = 'confirmed' | 'incident' | 'recovered'
```

## DTO Payloads

### Operator DTO

```ts
interface OperatorDto {
  id: string
  operator_name: string
  email: string
  operating_region: OperatingRegion
  role: OperatorRole
  crew_id: string
  crew_lead_id: string | null
  status: OperatorStatus
  avatar_url: string | null
  joined_at: string
}
```

Notes:

- `id` format in mocks is `operator-001`, `operator-002`, and so on.
- `avatar_url` may be `null`; the frontend mapper derives initials fallback from `operator_name`.
- Mock email domain is `heliogrid.demo`.

### Crew DTO

```ts
interface CrewDto {
  id: string
  name: string
  operating_region: OperatingRegion
  lead_operator_id: string
}
```

### Mission Order DTO

```ts
interface MissionOrderDto {
  id: string
  operator_id: string
  service_line: ServiceLine
  mission_value: number
  ops_credit: number
  status: MissionOrderStatus
  created_at: string
}
```

Notes:

- Value-bearing mission orders have status `confirmed` or `recovered`.
- `incident` mission orders count toward incident metrics but not mission value or ops credit totals.

## Domain Outputs After Mapping

The frontend API layer should continue returning domain models to stores, not raw DTOs.

```ts
interface Operator {
  id: string
  name: string
  email: string
  operatingRegion: OperatingRegion
  role: OperatorRole
  crewId: string
  crewLeadId: string | null
  status: OperatorStatus
  avatarUrl: string
  initials: string
  joinedAt: string
}

interface OperatorPerformance {
  operatorId: string
  totalMissionOrders: number
  activeMissionOrders: number
  totalMissionValue: number
  totalOpsCredit: number
  incidentCount: number
  incidentRate: number
  reliabilityRate: number
  readinessRate: number
  missionScore: number
  valueContributionScore: number
  incidentPenalty: number
}

interface OperatorWithMetrics extends Operator {
  crewName: string
  metrics: OperatorPerformance
}
```

```ts
interface MissionOrder {
  id: string
  operatorId: string
  serviceLine: ServiceLine
  missionValue: number
  opsCredit: number
  status: MissionOrderStatus
  createdAt: string
}

interface Crew {
  id: string
  name: string
  operatingRegion: OperatingRegion
  leadOperatorId: string
}
```

## Access Context

The current frontend stores pass this context into the API facade:

```ts
interface AccessContext {
  role: AccessRole
  crewLeadOperatorId: string
  currentOperatorId: string
}
```

For a real backend, derive this from authenticated session state rather than trusting client-provided role or operator IDs.

## Endpoint Contracts

The endpoint paths below are recommended backend shapes. Current local equivalents are TypeScript functions under `src/api`.

### `GET /api/crews`

Current facade: `getCrews()`

Response:

```ts
type GetCrewsResponse = CrewDto[]
```

### `GET /api/operators`

Current facade: `getOperators(filters)`

Query:

```ts
interface GetOperatorsQuery {
  search?: string
  operating_region?: OperatingRegion
  role?: OperatorRole
  crew_id?: string
  status?: OperatorStatus
  service_line?: ServiceLine
  from?: string
  to?: string
}
```

Response:

```ts
interface OperatorListItemDto extends OperatorDto {
  crew_name: string
  metrics: OperatorPerformanceDto
}

type GetOperatorsResponse = OperatorListItemDto[]
```

Backend behavior:

- `search` matches `operator_name` or `email`.
- `from` and `to` filter mission orders by `created_at` date slice.
- When `service_line`, `from`, or `to` is provided, include only operators with at least one matching mission order.
- Role scoping must be applied before returning rows.

### `GET /api/operators/:operator_id`

Current facade: `getOperatorById(operatorId)`

Response:

```ts
type GetOperatorResponse = OperatorListItemDto | null
```

Backend behavior:

- Return `null` or `404` for missing records.
- Return `403` or a safe empty result for records outside the current access scope.
- The current UI keeps the user on `/operators/:id` and renders the existing unavailable-details fallback.

### `GET /api/operators/:operator_id/mission-orders`

Current facade: `getMissionOrdersByOperator(operatorId)`

Response:

```ts
type GetOperatorMissionOrdersResponse = MissionOrderDto[]
```

Backend behavior:

- Rows are sorted by `created_at` descending.
- Access scoping must match `GET /api/operators/:operator_id`.

### `GET /api/mission-orders`

Current facade: `getMissionOrders()`

Response:

```ts
type GetMissionOrdersResponse = MissionOrderDto[]
```

### `GET /api/dashboard-summary`

Current facade: `getDashboardSummary(access)`

Response:

```ts
interface DashboardSummaryDto {
  total_mission_value: number
  total_ops_credit: number
  ready_operators: number
  average_reliability: number
  incident_rate: number
  top_operator: string
  charts: {
    mission_value_by_month: Array<{
      label: string
      mission_value: number
    }>
    mission_orders_by_service_line: Partial<Record<ServiceLine, number>>
    incident_trend: Array<{
      label: string
      count: number
    }>
    performance_by_role: Partial<Record<OperatorRole, number[]>>
  }
}
```

Backend behavior:

- Summary values must be calculated after access scoping.
- `mission_value_by_month` and `incident_trend` use year-month grouping, with labels such as `Jan 2026`.
- `top_operator` is `N/A` when no operator is available in scope.

### `GET /api/ledger`

Current facade: `generateLedger(filters, access)`

Query:

```ts
interface GetLedgerQuery {
  from?: string
  to?: string
  operating_region?: OperatingRegion
  crew_id?: string
  role?: OperatorRole
  service_line?: ServiceLine
}
```

Response:

```ts
interface LedgerRowDto {
  operator_id: string
  operator_name: string
  crew_name: string
  operating_region: OperatingRegion
  role: OperatorRole
  mission_orders: number
  mission_value: number
  ops_credit: number
  reliability_rate: number
  incident_rate: number
  mission_score: number
}

type GetLedgerResponse = LedgerRowDto[]
```

Backend behavior:

- Apply the same filters as `GET /api/operators`.
- Apply role scoping before returning ledger rows.
- Export permissions are controlled by access role; only `Control Admin` can export in the current demo.

## Error Handling

Recommended backend status mapping:

```text
400 invalid query value
401 unauthenticated session
403 authenticated but outside allowed scope
404 record not found
500 unexpected backend failure
```

Frontend store fallback copy currently used:

```text
Mission performance could not be loaded.
Operators could not be loaded.
Operator details are unavailable for the current access role.
Ledger could not be generated.
```

## Migration Notes

- Keep `src/api` as the adapter boundary when replacing mocks.
- Keep DTO contracts under `src/api/dto`.
- Keep DTO-to-domain mapping under `src/entities/*/api/mappers.ts`.
- Keep Pinia stores as page loading boundaries.
- Keep chart and metric calculations either backend-owned or mirrored by tested entity helpers, but do not duplicate divergent formulas.
