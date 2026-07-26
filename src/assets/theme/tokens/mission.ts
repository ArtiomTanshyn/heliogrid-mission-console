import { HELIOGRID_COLORS } from './colors'

export const HELIOGRID_DOMAIN_TOKENS = {
  mission: {
    card: {
      radius: '0.5rem',
      shadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
    },
    metric: {
      blue: {
        color: HELIOGRID_COLORS.primary500,
        background: HELIOGRID_COLORS.primary50,
      },
      green: {
        color: HELIOGRID_COLORS.success,
        background: HELIOGRID_COLORS.successSoft,
      },
      amber: {
        color: HELIOGRID_COLORS.warning,
        background: HELIOGRID_COLORS.warningSoft,
      },
      red: {
        color: HELIOGRID_COLORS.danger,
        background: HELIOGRID_COLORS.dangerSoft,
      },
    },
  },
}
