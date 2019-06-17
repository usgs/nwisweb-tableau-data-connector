//jest.mock('../../src/utils.js');

import { shallowMount } from '@vue/test-utils'

import {getData, getSchema, generateURL} from '../../src/components/WDCMethods.js'
import {get} from '../../src/utils.js'


let fake_url = 'https://fake.service.com/request';
let real_url = 'https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01646500,05437641&period=P1D&parameterCd=00060,00065&siteStatus=all'
let table = {};


describe('getData of WDCMethods', () => {

it('The url passed to the get command is used to make a request', () => {
  get(fake_url);
   expect(global.recentRequest).toEqual(fake_url);
  // const requests = jasmine.Ajax.requests;
  // const thisRequest = requests.mostRecent();

  // expect(requests.count()).toBe(1);
  // expect(thisRequest.url).toBe(FAKE_SERVICE);
  // expect(thisRequest.method).toBe('GET');
});

it('get is calling open', () => {
  const spy = jest.spyOn(xmlFunctionHolder,'open');
  get(fake_url);
  expect(spy.value).toEqual();
});

it('The response of the promise is defined', () => {
  //expect.assertions(1);
  return get(fake_url).then(data => expect(data.params).toBeDefined());
});

it('The response of the promise is correct', () => {
  //expect.assertions(1);
  return get(fake_url).then(data => expect(data.params).toEqual("00060"));
});

});