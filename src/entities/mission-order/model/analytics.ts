import type { MissionOrder, ServiceLine } from './types'
import { MISSION_ORDER_STATUS, VALUE_BEARING_MISSION_ORDER_STATUSES } from './options'

const DEFAULT_CHART_YEAR = 2025

interface MissionMonth {
  year: number
  month: number
}

export const isValueMissionOrder = (missionOrder: MissionOrder) =>
  VALUE_BEARING_MISSION_ORDER_STATUSES.includes(missionOrder.status)

const getMissionMonth = (missionOrder: MissionOrder): MissionMonth | null => {
  const date = new Date(missionOrder.createdAt)
  if (Number.isNaN(date.getTime())) return null

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
  }
}

const getMonthKey = ({ year, month }: MissionMonth) => `${year}-${String(month + 1).padStart(2, '0')}`

const getMonthLabel = ({ year, month }: MissionMonth) =>
  new Date(Date.UTC(year, month, 1)).toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

const compareMissionMonths = (first: MissionMonth, second: MissionMonth) =>
  first.year === second.year ? first.month - second.month : first.year - second.year

const getMonthlyRange = (missionOrders: MissionOrder[]) => {
  const months = missionOrders
    .map(getMissionMonth)
    .filter((month): month is MissionMonth => Boolean(month))
    .sort(compareMissionMonths)

  if (!months.length) {
    return Array.from({ length: 12 }, (_, month) => ({ year: DEFAULT_CHART_YEAR, month }))
  }

  const start = months[0]
  const end = months[months.length - 1]
  const range: MissionMonth[] = []

  for (let year = start.year, month = start.month; year < end.year || (year === end.year && month <= end.month);) {
    range.push({ year, month })
    month += 1
    if (month === 12) {
      year += 1
      month = 0
    }
  }

  return range
}

export function groupMissionValueByMonth(missionOrders: MissionOrder[]) {
  const missionValueByMonth = missionOrders.reduce<Record<string, number>>((acc, missionOrder) => {
    const month = getMissionMonth(missionOrder)
    if (!month || !isValueMissionOrder(missionOrder)) return acc

    const key = getMonthKey(month)
    acc[key] = (acc[key] ?? 0) + missionOrder.missionValue
    return acc
  }, {})

  return getMonthlyRange(missionOrders).map((month) => ({
    label: getMonthLabel(month),
    missionValue: missionValueByMonth[getMonthKey(month)] ?? 0,
  }))
}

export function groupMissionOrdersByServiceLine(missionOrders: MissionOrder[]) {
  return missionOrders.reduce<Record<ServiceLine, number>>(
    (acc, missionOrder) => {
      acc[missionOrder.serviceLine] = (acc[missionOrder.serviceLine] ?? 0) + 1
      return acc
    },
    {} as Record<ServiceLine, number>,
  )
}

export function groupIncidentsByMonth(missionOrders: MissionOrder[]) {
  const incidentsByMonth = missionOrders.reduce<Record<string, number>>((acc, missionOrder) => {
    const month = getMissionMonth(missionOrder)
    if (!month || missionOrder.status !== MISSION_ORDER_STATUS.INCIDENT) return acc

    const key = getMonthKey(month)
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})

  return getMonthlyRange(missionOrders).map((month) => ({
    label: getMonthLabel(month),
    count: incidentsByMonth[getMonthKey(month)] ?? 0,
  }))
}
