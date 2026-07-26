import { SERVICE_LINES } from '@entities/mission-order/model/options'
import { OPERATING_REGIONS, OPERATOR_ROLES } from '@entities/operator/model/options'
import type { LedgerFilters } from '@entities/ledger/model/types'

export const getEmptyLedgerFilters = (): LedgerFilters => ({
  from: '',
  to: '',
  operatingRegion: '',
  crewId: '',
  role: '',
  serviceLine: '',
})

const getSingleValue = (value: unknown) => {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : ''

  return typeof value === 'string' ? value : ''
}

const isValidDateValue = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const date = new Date(`${value}T00:00:00.000Z`)

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

const getAllowedValue = <T extends string>(value: string, allowedValues: readonly T[]): T | '' =>
  allowedValues.includes(value as T) ? (value as T) : ''

export const normalizeLedgerFilters = (
  raw: Partial<Record<keyof LedgerFilters, unknown>>,
  crewIds: readonly string[] = [],
): LedgerFilters => {
  const crewId = getSingleValue(raw.crewId).trim()
  const from = getSingleValue(raw.from)
  const to = getSingleValue(raw.to)

  return {
    from: isValidDateValue(from) ? from : '',
    to: isValidDateValue(to) ? to : '',
    operatingRegion: getAllowedValue(getSingleValue(raw.operatingRegion), OPERATING_REGIONS),
    crewId: !crewIds.length || crewIds.includes(crewId) ? crewId : '',
    role: getAllowedValue(getSingleValue(raw.role), OPERATOR_ROLES),
    serviceLine: getAllowedValue(getSingleValue(raw.serviceLine), SERVICE_LINES),
  }
}
