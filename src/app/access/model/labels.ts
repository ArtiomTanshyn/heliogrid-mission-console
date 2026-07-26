import type { UserRole } from './types'

export const ACCESS_ROLE_LABEL: Record<UserRole, string> = {
  'Control Admin': 'Control Admin',
  'Crew Lead': 'Crew Lead',
  Operator: 'Operator',
}

export const getAccessRoleLabel = (value: UserRole | string) => ACCESS_ROLE_LABEL[value as UserRole] ?? value
