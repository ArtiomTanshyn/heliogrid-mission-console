import { getCrewLabel } from '@entities/crew/model/labels'
import { getOperatingRegionLabel, getOperatorRoleLabel } from '@entities/operator/model/labels'
import type { LedgerRow } from '@entities/ledger/model/types'

export const LEDGER_EXPORT_FILENAME = {
  CSV: 'heliogrid-operations-ledger.csv',
  JSON: 'heliogrid-operations-ledger.json',
} as const

export const LEDGER_EXPORT_MIME_TYPE = {
  CSV: 'text/csv',
  JSON: 'application/json',
} as const

export const mapRowsToLedgerExport = (rows: LedgerRow[]) =>
  rows.map((row) => ({
    operatorId: row.operatorId,
    operatorName: row.operatorName,
    crew: getCrewLabel(row.crewName),
    operatingRegion: getOperatingRegionLabel(row.operatingRegion),
    operatorRole: getOperatorRoleLabel(row.role),
    missionOrders: row.missionOrders,
    missionValue: row.missionValue,
    opsCredit: row.opsCredit,
    reliabilityRate: row.reliabilityRate,
    incidentRate: row.incidentRate,
    missionScore: row.missionScore,
  }))
