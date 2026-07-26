import { OPERATING_REGION } from '@entities/operator/model/options'
import type { CrewDto } from '@api/dto/operatorDto'

export const mockCrews: CrewDto[] = [
  {
    id: 'crew-aurora',
    name: 'Aurora Crew',
    operating_region: OPERATING_REGION.LUNAR_CORRIDOR,
    lead_operator_id: 'operator-002',
  },
  {
    id: 'crew-zenith',
    name: 'Zenith Crew',
    operating_region: OPERATING_REGION.LOW_EARTH_ORBIT,
    lead_operator_id: 'operator-010',
  },
  {
    id: 'crew-polaris',
    name: 'Polaris Crew',
    operating_region: OPERATING_REGION.MARS_RELAY,
    lead_operator_id: 'operator-018',
  },
  {
    id: 'crew-atlas',
    name: 'Atlas Crew',
    operating_region: OPERATING_REGION.DEEP_SPACE_NETWORK,
    lead_operator_id: 'operator-026',
  },
  {
    id: 'crew-kepler',
    name: 'Kepler Crew',
    operating_region: OPERATING_REGION.LOW_EARTH_ORBIT,
    lead_operator_id: 'operator-034',
  },
  {
    id: 'crew-vega',
    name: 'Vega Crew',
    operating_region: OPERATING_REGION.MARS_RELAY,
    lead_operator_id: 'operator-042',
  },
]
