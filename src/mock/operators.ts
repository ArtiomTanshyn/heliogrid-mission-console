import { OPERATING_REGION, OPERATING_REGIONS, OPERATOR_ROLE, OPERATOR_STATUS } from '@entities/operator/model/options'
import { mockCrews } from './crews'
import type { OperatingRegion, OperatorRole, OperatorStatus } from '@entities/operator/model/types'
import type { OperatorDto } from '@api/dto/operatorDto'

const toIsoDate = (year: number, month: number, day: number) => new Date(Date.UTC(year, month - 1, day)).toISOString()

const operatorNames = [
  'Astra Vey',
  'Orin Sol',
  'Nyra Kade',
  'Sora Venn',
  'Kiro Nalen',
  'Mira Quell',
  'Tavi Rho',
  'Elio Voss',
  'Vexa Lior',
  'Nalo Veyr',
  'Cyra Kest',
  'Rilo Morn',
  'Kesa Vant',
  'Mavon Irix',
  'Zuri Kel',
  'Varo Nesh',
  'Liora Fen',
  'Daxen Orel',
  'Renn Solix',
  'Selka Vire',
  'Maeko Tern',
  'Kovan Lire',
  'Avra Sain',
  'Oryn Voss',
  'Paxa Ren',
  'Velin Ora',
  'Ivara Cale',
  'Nex Orel',
  'Tovan Vex',
  'Reva Miro',
  'Calen Rusk',
  'Syra Tor',
  'Zenna Vale',
  'Arlo Quen',
  'Myra Voss',
  'Kael Riven',
  'Osta Korr',
  'Viro Lenk',
  'Niva Sorel',
  'Eron Tyx',
  'Lysa Kade',
  'Corin Vaal',
  'Savi Mor',
  'Tyla Nox',
  'Orel Kint',
  'Vana Sol',
  'Mika Venn',
  'Daro Quill',
]

const crewLeadIds = new Set([2, 10, 18, 26, 34, 42])
const strategistIds = new Set([3, 11, 19, 27, 35, 43])
const flightDirectorIds = new Set([4, 20, 36])
const pausedIds = new Set([5, 17, 31, 44])
const onboardingIds = new Set([8, 22, 39, 47])
const nullAvatarIds = new Set([1, 9, 16, 27, 39, 47])

const regionOverrides: Record<string, OperatingRegion> = {
  'operator-001': OPERATING_REGION.LUNAR_CORRIDOR,
  'operator-002': OPERATING_REGION.LUNAR_CORRIDOR,
  'operator-003': OPERATING_REGION.LOW_EARTH_ORBIT,
  'operator-004': OPERATING_REGION.MARS_RELAY,
  'operator-006': OPERATING_REGION.MARS_RELAY,
  'operator-011': OPERATING_REGION.MARS_RELAY,
  'operator-019': OPERATING_REGION.LUNAR_CORRIDOR,
  'operator-027': OPERATING_REGION.DEEP_SPACE_NETWORK,
  'operator-035': OPERATING_REGION.MARS_RELAY,
  'operator-043': OPERATING_REGION.LUNAR_CORRIDOR,
}

const getOperatorRole = (idNumber: number): OperatorRole => {
  if (crewLeadIds.has(idNumber)) return OPERATOR_ROLE.CREW_LEAD
  if (strategistIds.has(idNumber)) return OPERATOR_ROLE.MISSION_STRATEGIST
  if (flightDirectorIds.has(idNumber)) return OPERATOR_ROLE.FLIGHT_DIRECTOR

  return OPERATOR_ROLE.FIELD_OPERATOR
}

const getOperatorStatus = (idNumber: number): OperatorStatus => {
  if (pausedIds.has(idNumber)) return OPERATOR_STATUS.PAUSED
  if (onboardingIds.has(idNumber)) return OPERATOR_STATUS.ONBOARDING

  return OPERATOR_STATUS.READY
}

const getOperatingRegion = (id: string, index: number): OperatingRegion =>
  regionOverrides[id] ?? OPERATING_REGIONS[(index + Math.floor(index / 8)) % OPERATING_REGIONS.length]

const getAvatarUrl = (idNumber: number) => {
  if (nullAvatarIds.has(idNumber)) return null

  const hue = (idNumber * 47) % 360
  const initials = operatorNames[idNumber - 1]
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="hsl(${hue} 72% 42%)"/><circle cx="70" cy="24" r="18" fill="white" opacity=".14"/><text x="48" y="56" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="800" fill="white">${initials}</text></svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const mockOperators: OperatorDto[] = operatorNames.map((fullName, index) => {
  const idNumber = index + 1
  const id = `operator-${String(idNumber).padStart(3, '0')}`
  const crew = mockCrews[Math.floor(index / 8)]
  const role = getOperatorRole(idNumber)
  const crewLeadId =
    role === OPERATOR_ROLE.CREW_LEAD || role === OPERATOR_ROLE.FLIGHT_DIRECTOR ? null : crew.lead_operator_id
  const emailName = fullName.toLowerCase().replace(/\s+/g, '.')

  return {
    id,
    operator_name: fullName,
    email: `${emailName}@heliogrid.demo`,
    operating_region: getOperatingRegion(id, index),
    role,
    crew_id: crew.id,
    crew_lead_id: crewLeadId,
    status: getOperatorStatus(idNumber),
    avatar_url: getAvatarUrl(idNumber),
    joined_at: toIsoDate(2022 + (index % 4), (index % 12) + 1, 4 + (index % 20)),
  }
})
