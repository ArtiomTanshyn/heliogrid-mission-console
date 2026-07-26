import { HELIOGRID_COLORS } from './colors'

export const HELIOGRID_FOCUS_RING = {
  width: '2px',
  style: 'solid',
  color: HELIOGRID_COLORS.primary200,
  offset: '2px',
  shadow: 'none',
}

export const HELIOGRID_FORM_FIELD = {
  background: HELIOGRID_COLORS.surface0,
  disabledBackground: HELIOGRID_COLORS.surface100,
  filledBackground: HELIOGRID_COLORS.surface100,
  filledHoverBackground: HELIOGRID_COLORS.surface100,
  filledFocusBackground: HELIOGRID_COLORS.surface0,
  borderColor: HELIOGRID_COLORS.surface300,
  hoverBorderColor: HELIOGRID_COLORS.surface400,
  focusBorderColor: HELIOGRID_COLORS.primary500,
  invalidBorderColor: HELIOGRID_COLORS.danger,
  color: HELIOGRID_COLORS.surface900,
  disabledColor: HELIOGRID_COLORS.surface500,
  placeholderColor: HELIOGRID_COLORS.surface600,
  invalidPlaceholderColor: HELIOGRID_COLORS.danger,
  shadow: 'none',
  paddingX: '0.875rem',
  paddingY: '0.6875rem',
  borderRadius: '0.5rem',
  focusRing: HELIOGRID_FOCUS_RING,
}
