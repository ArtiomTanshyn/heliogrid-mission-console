import { HELIOGRID_COLORS } from './colors'
import { HELIOGRID_FOCUS_RING, HELIOGRID_FORM_FIELD } from './shared'

export const HELIOGRID_SEMANTIC_TOKENS = {
  primary: {
    50: HELIOGRID_COLORS.primary50,
    100: HELIOGRID_COLORS.primary100,
    200: HELIOGRID_COLORS.primary200,
    300: HELIOGRID_COLORS.primary300,
    400: HELIOGRID_COLORS.primary400,
    500: HELIOGRID_COLORS.primary500,
    600: HELIOGRID_COLORS.primary600,
    700: HELIOGRID_COLORS.primary700,
    800: HELIOGRID_COLORS.primary800,
    900: HELIOGRID_COLORS.primary900,
    950: HELIOGRID_COLORS.primary950,
  },
  colorScheme: {
    light: {
      primary: {
        color: HELIOGRID_COLORS.primary500,
        contrastColor: HELIOGRID_COLORS.surface0,
        hoverColor: HELIOGRID_COLORS.primary600,
        activeColor: HELIOGRID_COLORS.primary700,
      },
      surface: {
        0: HELIOGRID_COLORS.surface0,
        50: HELIOGRID_COLORS.surface50,
        100: HELIOGRID_COLORS.surface100,
        200: HELIOGRID_COLORS.surface200,
        300: HELIOGRID_COLORS.surface300,
        400: HELIOGRID_COLORS.surface400,
        500: HELIOGRID_COLORS.surface500,
        600: HELIOGRID_COLORS.surface600,
        700: HELIOGRID_COLORS.surface700,
        800: HELIOGRID_COLORS.surface800,
        900: HELIOGRID_COLORS.surface900,
        950: HELIOGRID_COLORS.surface950,
      },
      content: {
        background: HELIOGRID_COLORS.surface0,
        hoverBackground: HELIOGRID_COLORS.surface100,
        borderColor: HELIOGRID_COLORS.surface300,
        color: HELIOGRID_COLORS.surface900,
        hoverColor: HELIOGRID_COLORS.surface900,
      },
      text: {
        color: HELIOGRID_COLORS.surface900,
        hoverColor: HELIOGRID_COLORS.surface900,
        mutedColor: HELIOGRID_COLORS.surface600,
        hoverMutedColor: HELIOGRID_COLORS.surface800,
      },
      formField: HELIOGRID_FORM_FIELD,
      focusRing: HELIOGRID_FOCUS_RING,
    },
  },
}
