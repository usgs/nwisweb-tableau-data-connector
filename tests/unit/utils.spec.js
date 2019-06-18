/* 
  This file contains tests for functions inside the util.js file.
*/

import { get } from '../../src/utils.js'

// a URL that returns nothing
let fake_url = 'https://fake.service.com/request';

describe('Test for get() in utils.js', () => {

  /*
    This test will check that the URL used by get() matches fake_url
  */
  it('The url passed to get() is the same url used to make the request', () => {
    get(fake_url);
    // global.recentRequest is in jestSetup.js.  It is set to the most recently requested URL.
    expect(global.recentRequest).toEqual(fake_url);
  });

  /*
    This test will confirm that get() is calling open() in order 
    to make an HTTPrequest
  */
  it('Get is calling open to make a request', () => {
      //xmlFunctionHolder is initialized globally in jestSetup.js
    const spy = jest.spyOn(xmlFunctionHolder, 'open');
    get(fake_url);
    expect(spy).toHaveBeenCalled();
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