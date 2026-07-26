import { describe, expect, it } from 'vitest'
import { SERVICE_LINE } from '@entities/mission-order/model/options'
import { OPERATING_REGION, OPERATOR_ROLE } from '@entities/operator/model/options'
import { getEmptyLedgerFilters, normalizeLedgerFilters } from './filters'

describe('ledger filters', () => {
  it('normalizes valid values and crew ids', () => {
    expect(
      normalizeLedgerFilters(
        {
          from: '2025-12-01',
          to: '2025-12-31',
          operatingRegion: OPERATING_REGION.DEEP_SPACE_NETWORK,
          crewId: 'crew-vega',
          role: OPERATOR_ROLE.MISSION_STRATEGIST,
          serviceLine: SERVICE_LINE.CARGO_RESUPPLY,
        },
        ['crew-vega'],
      ),
    ).toEqual({
      from: '2025-12-01',
      to: '2025-12-31',
      operatingRegion: OPERATING_REGION.DEEP_SPACE_NETWORK,
      crewId: 'crew-vega',
      role: OPERATOR_ROLE.MISSION_STRATEGIST,
      serviceLine: SERVICE_LINE.CARGO_RESUPPLY,
    })
  })

  it('drops invalid enums, dates, and disallowed crew ids', () => {
    expect(
      normalizeLedgerFilters(
        {
          from: '2025-13-01',
          to: '2025-12-40',
          operatingRegion: 'Unknown Region',
          crewId: 'crew-shadow',
          role: 'Unknown Role',
          serviceLine: 'Unknown Line',
        },
        ['crew-vega'],
      ),
    ).toEqual(getEmptyLedgerFilters())
  })

  it('allows crew id values before the crew list has loaded', () => {
    expect(normalizeLedgerFilters({ crewId: 'crew-aurora' })).toEqual({
      ...getEmptyLedgerFilters(),
      crewId: 'crew-aurora',
    })
  })
})
