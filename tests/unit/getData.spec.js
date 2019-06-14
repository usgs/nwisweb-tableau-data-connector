import { shallowMount } from '@vue/test-utils'

import Main from '@/components/Main.vue'

import {getData, getSchema} from '../../src/components/WDCMethods.js'

const fake_url = 'https://fake.service.com/request';
let table = {};


describe('getData of WDCMethods', () => {

it('The url passed to the get command is used to make a request', () => {
  getData(table, function(){})
  //return getData.get(fake_url)
    //.then(value => expect(value.exists()).toBe(true));
  // const requests = jasmine.Ajax.requests;
  // const thisRequest = requests.mostRecent();

  // expect(requests.count()).toBe(1);
  // expect(thisRequest.url).toBe(FAKE_SERVICE);
  // expect(thisRequest.method).toBe('GET');
});
})