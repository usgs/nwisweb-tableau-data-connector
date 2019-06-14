import { shallowMount } from '@vue/test-utils'

import Main from '@/components/Main.vue'

describe('Main.vue', () => {

  it('has a button', () => {
    const wrapper = shallowMount(Main)
   // expect(tableau).toBe(undefined)
    expect(wrapper.exists()).toBe(true)
  })
})
