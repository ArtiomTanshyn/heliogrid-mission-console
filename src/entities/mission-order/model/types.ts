export type ServiceLine = 'Satellite Deployment' | 'Cargo Resupply' | 'Orbital Imaging' | 'Research Payload'
export type MissionOrderStatus = 'confirmed' | 'incident' | 'recovered'

export interface MissionOrder {
  id: string
  operatorId: string
  serviceLine: ServiceLine
  missionValue: number
  opsCredit: number
  status: MissionOrderStatus
  createdAt: string
}
