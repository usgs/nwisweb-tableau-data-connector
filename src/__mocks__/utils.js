/*
    Add the folowing line to the top of a test file to use this mock.
    jest.mock('../../src/utils.js');
*/
import dummyHTTP from './dummyHTTP'

const get = (url) => {
    // Return a new promise.
    return new Promise(function (resolve, reject) {
        // Do the usual XHR stuff
        let req = new XMLHttpRequest();
        req.responseType = 'json';
        recentRequest = url;
  
        //req.open('GET', url);
        let testJSON = {"params":"00060"}
  
        req.response = testJSON;

        //req.onload = function () {
            // This is called even on 404 etc
            // so check the status
            if (req.status == 200) {
                // Resolve the promise with the response text
                resolve(req.response);
            } else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                if (window.ga) {
                    window.ga('send', 'event', 'serviceFailure', req.status, url);
                }
                reject(Error(`Failed with status ${req.status}: ${req.statusText}`));
            }
        //};
  
        // Handle network errors
        req.onerror = function () {
            reject('Network Error');
        };
  
        // Make the request
        req.send();
    });
  }
  
  export{get};