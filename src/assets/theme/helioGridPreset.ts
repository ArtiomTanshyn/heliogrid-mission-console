import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import { HELIOGRID_COMPONENT_TOKENS } from './tokens/components'
import { HELIOGRID_DOMAIN_TOKENS } from './tokens/mission'
import { HELIOGRID_SEMANTIC_TOKENS } from './tokens/semantic'

export const helioGridPreset = definePreset(Aura, {
  semantic: HELIOGRID_SEMANTIC_TOKENS,
  components: HELIOGRID_COMPONENT_TOKENS,
  extend: HELIOGRID_DOMAIN_TOKENS,
})
