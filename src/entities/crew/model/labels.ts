const CREW_LABEL_BY_ID: Record<string, string> = {
  'crew-aurora': 'Aurora Crew',
  'crew-zenith': 'Zenith Crew',
  'crew-polaris': 'Polaris Crew',
  'crew-atlas': 'Atlas Crew',
  'crew-kepler': 'Kepler Crew',
  'crew-vega': 'Vega Crew',
}

export const getCrewLabel = (value: string, fallback = value) => CREW_LABEL_BY_ID[value] ?? fallback
