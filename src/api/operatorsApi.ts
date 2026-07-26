import { delayed } from './mockApi'
import { mapMissionOrderDtosToMissionOrders } from '@entities/mission-order/api/mappers'
import type { ServiceLine } from '@entities/mission-order/model/types'
import { mapCrewDtosToCrews, mapOperatorDtoToOperatorWithMetrics } from '@entities/operator/api/mappers'
import type { OperatorWithMetrics } from '@entities/operator/model/types'
import { mockCrews } from '@mock/crews'
import { mockMissionOrders } from '@mock/missionOrders'
import { mockOperators } from '@mock/operators'

export interface OperatorsFilters {
  search?: string
  operatingRegion?: string
  role?: string
  crewId?: string
  status?: string
  serviceLine?: ServiceLine | ''
  from?: string
  to?: string
}

export async function getOperators(filters: OperatorsFilters = {}) {
  return delayed(() => {
    const search = filters.search?.toLowerCase().trim()
    const crews = mapCrewDtosToCrews(mockCrews)
    const filteredMissionOrders = mapMissionOrderDtosToMissionOrders(mockMissionOrders).filter((missionOrder) => {
      const date = missionOrder.createdAt.slice(0, 10)
      return (
        (!filters.serviceLine || missionOrder.serviceLine === filters.serviceLine) &&
        (!filters.from || date >= filters.from) &&
        (!filters.to || date <= filters.to)
      )
    })

    return mockOperators
      .filter(
        (operator) =>
          !search ||
          operator.operator_name.toLowerCase().includes(search) ||
          operator.email.toLowerCase().includes(search),
      )
      .filter((operator) => !filters.operatingRegion || operator.operating_region === filters.operatingRegion)
      .filter((operator) => !filters.role || operator.role === filters.role)
      .filter((operator) => !filters.crewId || operator.crew_id === filters.crewId)
      .filter((operator) => !filters.status || operator.status === filters.status)
      .map<OperatorWithMetrics>((operator) =>
        mapOperatorDtoToOperatorWithMetrics(operator, crews, filteredMissionOrders),
      )
      .filter((operator) =>
        !filters.serviceLine && !filters.from && !filters.to ? true : operator.metrics.totalMissionOrders > 0,
      )
  })
}

export async function getOperatorById(operatorId: string) {
  return delayed(() => {
    const operator = mockOperators.find((item) => item.id === operatorId)
    if (!operator) return null
    return mapOperatorDtoToOperatorWithMetrics(
      operator,
      mapCrewDtosToCrews(mockCrews),
      mapMissionOrderDtosToMissionOrders(mockMissionOrders),
    )
  })
}

export async function getCrews() {
  return delayed(() => mapCrewDtosToCrews(mockCrews), 180)
}
