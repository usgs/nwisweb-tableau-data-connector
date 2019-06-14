import { shallowMount } from '@vue/test-utils'

import Main from '@/components/Main.vue'

import {getData, getSchema, generateURL} from '../../src/components/WDCMethods.js'
import {get} from '../../src/components/utils.js'


const fake_url = 'https://fake.service.com/request';
let table = {};


describe('getData of WDCMethods', () => {

it('The url passed to the get command is used to make a request', () => {
  //getData(table, function(){})
  return get(fake_url)
    .then(value => expect(value.exists()).toBe(true));
  // const requests = jasmine.Ajax.requests;
  // const thisRequest = requests.mostRecent();

  // expect(requests.count()).toBe(1);
  // expect(thisRequest.url).toBe(FAKE_SERVICE);
  // expect(thisRequest.method).toBe('GET');
});

// it('Empty url is returned if no sites are specified', () => {
//   let connectionData = {paramNums:"", siteNums:""};
//   let url = generateURL(connectionData);
//   expect(url).toContain("https://waterservices.usgs.gov/nwis/iv/?format=json&sites=&period=P1D&parameterCd=&siteStatus=all");
// });

// it('Correct url is returned if 1 site and 1 parameter are specified', () => {
//   let connectionData = {siteNums:"01646500", paramNums:"00060"};
//   let url = generateURL(connectionData);
//   expect(url).toContain("https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01646500&period=P1D&parameterCd=00060&siteStatus=all");
// });

})