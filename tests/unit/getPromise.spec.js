//jest.mock('../../src/utils.js');

import {get} from '../../src/utils.js'

let fake_url = 'https://fake.service.com/request';

describe('getData of WDCMethods', () => {

it('The response of the promise is defined', () => {
  //expect.assertions(1);
  return get(fake_url).then(data => expect(data.params).toBeDefined());
});

it('The response of the promise is correct', () => {
  //expect.assertions(1);
  return get(fake_url).then(data => expect(data.params).toEqual("00060"));
});

});