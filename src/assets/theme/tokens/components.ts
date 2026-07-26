import { HELIOGRID_COLORS } from './colors'
import { HELIOGRID_FOCUS_RING, HELIOGRID_FORM_FIELD } from './shared'

export const HELIOGRID_COMPONENT_TOKENS = {
  button: {
    root: {
      borderRadius: '0.5rem',
      roundedBorderRadius: '999px',
      gap: '0.5rem',
      paddingX: '0.875rem',
      paddingY: '0.625rem',
      iconOnlyWidth: '2.5rem',
      label: {
        fontWeight: '700',
      },
      focusRing: HELIOGRID_FOCUS_RING,
    },
  },
  inputtext: {
    root: HELIOGRID_FORM_FIELD,
  },
  select: {
    root: HELIOGRID_FORM_FIELD,
    dropdown: {
      width: '2rem',
      color: HELIOGRID_COLORS.surface600,
    },
    overlay: {
      background: HELIOGRID_COLORS.surface0,
      borderColor: HELIOGRID_COLORS.surface300,
      borderRadius: '0.5rem',
      color: HELIOGRID_COLORS.surface900,
      shadow: HELIOGRID_COLORS.shadow,
    },
    option: {
      focusBackground: HELIOGRID_COLORS.primary50,
      selectedBackground: HELIOGRID_COLORS.primary50,
      selectedFocusBackground: HELIOGRID_COLORS.primary100,
      color: HELIOGRID_COLORS.surface900,
      focusColor: HELIOGRID_COLORS.primary600,
      selectedColor: HELIOGRID_COLORS.primary600,
      selectedFocusColor: HELIOGRID_COLORS.primary700,
      padding: '0.625rem 0.75rem',
      borderRadius: '0.375rem',
    },
  },
  datatable: {
    root: {
      borderColor: HELIOGRID_COLORS.surface300,
    },
    headerCell: {
      background: HELIOGRID_COLORS.surface0,
      hoverBackground: HELIOGRID_COLORS.surface0,
      borderColor: HELIOGRID_COLORS.surface300,
      color: HELIOGRID_COLORS.surface600,
      hoverColor: HELIOGRID_COLORS.surface800,
      padding: '0.875rem 1rem',
      focusRing: HELIOGRID_FOCUS_RING,
    },
    row: {
      background: HELIOGRID_COLORS.surface0,
      hoverBackground: HELIOGRID_COLORS.surface50,
      color: HELIOGRID_COLORS.surface700,
      hoverColor: HELIOGRID_COLORS.surface900,
      focusRing: HELIOGRID_FOCUS_RING,
    },
    bodyCell: {
      borderColor: HELIOGRID_COLORS.surface300,
      padding: '0.875rem 1rem',
    },
  },
  tag: {
    root: {
      fontSize: '0.75rem',
      fontWeight: '700',
      padding: '0.125rem 0.5rem',
      borderRadius: '999px',
      roundedBorderRadius: '999px',
    },
    colorScheme: {
      light: {
        success: {
          background: HELIOGRID_COLORS.successSoft,
          color: HELIOGRID_COLORS.success,
        },
        warn: {
          background: HELIOGRID_COLORS.warningSoft,
          color: HELIOGRID_COLORS.warning,
        },
        danger: {
          background: HELIOGRID_COLORS.dangerSoft,
          color: HELIOGRID_COLORS.danger,
        },
        info: {
          background: HELIOGRID_COLORS.primary50,
          color: HELIOGRID_COLORS.primary500,
        },
        secondary: {
          background: HELIOGRID_COLORS.surface100,
          color: HELIOGRID_COLORS.surface600,
        },
      },
    },
  },
  skeleton: {
    root: {
      background: HELIOGRID_COLORS.surface200,
      animationBackground: HELIOGRID_COLORS.surface100,
    },
  },
}
