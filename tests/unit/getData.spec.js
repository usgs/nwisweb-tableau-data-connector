import { shallowMount } from '@vue/test-utils'

import Main from '@/components/Main.vue'

import {getData, getSchema} from '../../src/components/WDCMethods.js'


describe('Main.vue', () => {

  it('has a button', () => {
    const wrapper = shallowMount(Main)
   // expect(tableau).toBe(undefined)
    expect(wrapper.exists()).toBe(true)
  })
})

const fake_url = 'https://fake.service.com/request';

it('The url passed to the get command is used to make a request', () => {
  WDCMethods.get(fake_url);
  const requests = jasmine.Ajax.requests;
  const thisRequest = requests.mostRecent();

  expect(requests.count()).toBe(1);
  expect(thisRequest.url).toBe(FAKE_SERVICE);
  expect(thisRequest.method).toBe('GET');
});