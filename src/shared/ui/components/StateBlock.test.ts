import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { APP_ICON } from '@shared/ui/icons'
import StateBlock from './StateBlock.vue'

describe('StateBlock', () => {
  it('renders title, message, and default info icon', () => {
    const wrapper = mount(StateBlock, {
      props: {
        title: 'No mission orders',
        message: 'Adjust filters and try again.',
      },
    })

    expect(wrapper.text()).toContain('No mission orders')
    expect(wrapper.text()).toContain('Adjust filters and try again.')
    expect(wrapper.find('i').classes()).toContain(APP_ICON.INFO_CIRCLE.split(' ')[1])
  })

  it('renders a custom icon class when provided', () => {
    const wrapper = mount(StateBlock, {
      props: {
        title: 'Ledger error',
        message: 'Ledger could not be generated.',
        icon: APP_ICON.EXCLAMATION_TRIANGLE,
      },
    })

    expect(wrapper.find('i').classes()).toContain('pi-exclamation-triangle')
  })
})
