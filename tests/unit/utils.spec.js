/* 
  This file contains tests for functions inside the util.js file.
*/

import { shallowMount } from '@vue/test-utils'
import { getData, getSchema, generateURL } from '../../src/components/WDCMethods.js'
import { get } from '../../src/utils.js'

// a URL that returns nothing
let fake_url = 'https://fake.service.com/request';
// a real request to NWISWEB that returns actual data
let real_url = 'https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01646500,05437641&period=P1D&parameterCd=00060,00065&siteStatus=all'

describe('Test for get() in utils.js', () => {

  /*
    This test will check that the URL used by get() matches fake_url
  */
  it('The url passed to get() is the same url used to make a request', () => {
    get(fake_url);
    // global.recentRequest is in jestSetup.js.  It is set to the most recently requested URL.
    expect(global.recentRequest).toEqual(fake_url);
  });

  /*
    This test will confirm that get() is calling open() in order 
    to make an HTTPrequest
  */
  it('Get is calling open to make a request', () => {
    const spy = jest.spyOn(xmlFunctionHolder, 'open');
    get(fake_url);
    expect(spy.value).toEqual();
  });

  /*
    This test will check that data.params is defined when it is 
    passed from testXML() in jestSetup.js
  */
  it('The response of the promise is defined', () => {
      //.then will run in place of the .then in getData() in WDCMethods.js
    return get(fake_url).then(data => expect(data.params).toBeDefined());
  });

  /*
    This test will check that data.params is correctly passed from 
    the contents of req.response in testXML() in jestSetup.js
  */
  it('The response of the promise is correct', () => {
        //.then will run in place of the .then in getData() in WDCMethods.js
     return get(fake_url).then(data => expect(data.params).toEqual("00060"));
  });

});