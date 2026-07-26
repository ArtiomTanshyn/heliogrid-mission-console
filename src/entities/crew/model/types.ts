import type { OperatingRegion } from '@entities/operator/model/types'

export interface Crew {
  id: string
  name: string
  operatingRegion: OperatingRegion
  leadOperatorId: string
}
