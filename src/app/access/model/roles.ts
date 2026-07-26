import type { UserRole } from './types'

export const USER_ROLE = {
  ADMIN: 'Control Admin',
  CREW_LEAD: 'Crew Lead',
  OPERATOR: 'Operator',
} as const satisfies Record<string, UserRole>

export const USER_ROLE_OPTIONS: UserRole[] = [USER_ROLE.ADMIN, USER_ROLE.CREW_LEAD, USER_ROLE.OPERATOR]

export const USER_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [USER_ROLE.ADMIN]: [
    'Sees all operators, crews, operating regions, mission value, ops credit, ledger rows, and exports.',
  ],
  [USER_ROLE.CREW_LEAD]: [
    'Sees only operators from their assigned crew.',
    'Can view operator details for that crew.',
    'Cannot see company-wide mission value.',
  ],
  [USER_ROLE.OPERATOR]: [
    'Sees only their own operator data.',
    'Cannot export ledger rows.',
    'Cannot view other operators.',
  ],
}
