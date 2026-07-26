import { describe, expect, it } from 'vitest'
import { SERVICE_LINE } from '@entities/mission-order/model/options'
import { OPERATING_REGION, OPERATOR_ROLE, OPERATOR_STATUS } from '@entities/operator/model/options'
import { getEmptyOperatorsFilters, normalizeOperatorsFilters, pruneEmptyOperatorsFilters } from './filters'

describe('operators filters', () => {
  it('normalizes valid query-like values', () => {
    expect(
      normalizeOperatorsFilters({
        search: '  astra  ',
        operatingRegion: [OPERATING_REGION.LUNAR_CORRIDOR],
        role: OPERATOR_ROLE.FIELD_OPERATOR,
        crewId: ' crew-aurora ',
        status: OPERATOR_STATUS.READY,
        serviceLine: SERVICE_LINE.RESEARCH_PAYLOAD,
        from: '2026-07-01',
        to: '2026-07-31',
      }),
    ).toEqual({
      search: 'astra',
      operatingRegion: OPERATING_REGION.LUNAR_CORRIDOR,
      role: OPERATOR_ROLE.FIELD_OPERATOR,
      crewId: 'crew-aurora',
      status: OPERATOR_STATUS.READY,
      serviceLine: SERVICE_LINE.RESEARCH_PAYLOAD,
      from: '2026-07-01',
      to: '2026-07-31',
    })
  })

  it('drops invalid enum and date values', () => {
    expect(
      normalizeOperatorsFilters({
        operatingRegion: 'Venus Loop',
        role: 'Pilot',
        status: 'archived',
        serviceLine: 'Unknown Line',
        from: '2026-02-30',
        to: 'not-a-date',
      }),
    ).toEqual(getEmptyOperatorsFilters())
  })

  it('prunes empty values while preserving filter order', () => {
    expect(
      pruneEmptyOperatorsFilters({
        ...getEmptyOperatorsFilters(),
        search: 'astra',
        serviceLine: SERVICE_LINE.ORBITAL_IMAGING,
      }),
    ).toEqual({
      search: 'astra',
      serviceLine: SERVICE_LINE.ORBITAL_IMAGING,
    })
  })
})
