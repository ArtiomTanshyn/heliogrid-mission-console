import { SERVICE_LINES } from '@entities/mission-order/model/options'
import { OPERATING_REGIONS, OPERATOR_ROLES, OPERATOR_STATUSES } from '@entities/operator/model/options'
import type { OperatorsFilters } from '@api/operatorsApi'

export const OPERATORS_FILTER_KEYS = [
  'search',
  'operatingRegion',
  'role',
  'crewId',
  'status',
  'serviceLine',
  'from',
  'to',
] as const

export const getEmptyOperatorsFilters = (): OperatorsFilters => ({
  search: '',
  operatingRegion: '',
  role: '',
  crewId: '',
  status: '',
  serviceLine: '',
  from: '',
  to: '',
})

const getSingleQueryValue = (value: unknown) => {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : ''

  return typeof value === 'string' ? value : ''
}

const isValidDateValue = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const date = new Date(`${value}T00:00:00.000Z`)

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

const getAllowedValue = <T extends string>(value: string, allowedValues: readonly T[]) =>
  allowedValues.includes(value as T) ? value : ''

export const normalizeOperatorsFilters = (raw: Partial<Record<keyof OperatorsFilters, unknown>>): OperatorsFilters => {
  const search = getSingleQueryValue(raw.search).trim()
  const operatingRegion = getAllowedValue(getSingleQueryValue(raw.operatingRegion), OPERATING_REGIONS)
  const role = getAllowedValue(getSingleQueryValue(raw.role), OPERATOR_ROLES)
  const crewId = getSingleQueryValue(raw.crewId).trim()
  const status = getAllowedValue(getSingleQueryValue(raw.status), OPERATOR_STATUSES)
  const serviceLine = getAllowedValue(getSingleQueryValue(raw.serviceLine), SERVICE_LINES)
  const from = getSingleQueryValue(raw.from)
  const to = getSingleQueryValue(raw.to)

  return {
    search,
    operatingRegion,
    role,
    crewId,
    status,
    serviceLine: serviceLine as OperatorsFilters['serviceLine'],
    from: isValidDateValue(from) ? from : '',
    to: isValidDateValue(to) ? to : '',
  }
}

export const pruneEmptyOperatorsFilters = (filters: OperatorsFilters) =>
  Object.fromEntries(OPERATORS_FILTER_KEYS.map((key) => [key, filters[key]]).filter(([, value]) => Boolean(value)))
