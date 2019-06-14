import dummyHTTP from './dummyHTTP'

function get (url) {
    // Return a new promise.
    return new Promise(function (resolve, reject) {
        // Do the usual XHR stuff
        //let req = new XMLHttpRequest();
        let req = new dummyHTTP();
        
        //req.responseType = 'json';
  
        req.open('GET', url); //Where request is actually made
  
        //req.onload = function () {
            // This is called even on 404 etc
            // so check the status
            //if (req.status == 200) {
                // Resolve the promise with the response text
                resolve(req);
            //} else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                if (window.ga) {
                    window.ga('send', 'event', 'serviceFailure', req.status, url);
                }
                reject(Error(`Failed with status ${req.status}: ${req.statusText}`));
            //}
        //};
  
        // Handle network errors
        req.onerror = function () {
            reject('Network Error');
        };
  
        // Make the request
        //req.send();
    });
  }
  
  export{get};