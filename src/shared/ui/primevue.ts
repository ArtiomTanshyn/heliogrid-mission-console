export const TAG_SEVERITY = {
  SUCCESS: 'success',
  WARN: 'warn',
  DANGER: 'danger',
  INFO: 'info',
  SECONDARY: 'secondary',
} as const

export const BUTTON_SEVERITY = {
  SECONDARY: 'secondary',
} as const

export const METRIC_TONE = {
  BLUE: 'blue',
  GREEN: 'green',
  AMBER: 'amber',
  RED: 'red',
} as const

export type TagSeverity = (typeof TAG_SEVERITY)[keyof typeof TAG_SEVERITY]
