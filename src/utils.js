import { notify } from "./notifications.js";

/*
gets a JSON from specified URL via HTTP request

*/

const get = (url, responseType) => {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    let req = new XMLHttpRequest();
    req.responseType = responseType;

    req.open("GET", url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      } else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        if (window.ga) {
          window.ga("send", "event", "serviceFailure", req.status, url);
        }
        notify(`Failed with status ${req.status}: ${req.statusText}`);
        reject(Error(`Failed with status ${req.status}: ${req.statusText}`));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject("Network Error");
    };

    // Make the request
    req.send();
  });
};

/*
  returns multiple json in the event that we are dealing with a multi-url query
*/
const multiGet = (urlList, responseType) => {
  let promises = [];
  urlList.forEach(url => {
    promises.push(get(url, responseType));
  });
  return Promise.all(promises);
};

/*
This function amalgmates any number of input data JSON into single JSON, Modifies the first JSON in the list to become the result, and returns a reference to this JSON. Global
metadata on all JSON except for the first JSON (with the exception of query URL) is assumed to be the same as the first and is not preserved, as this function is only intended to be used with batch queries specifically for the 
purpose of bypassing the limit of 100 parameters on the instantaneous values services. This function must be called with a list of data JSON of length 2 or greater. 
*/
const combineJSONList = JSONList => {
  let result = JSONList[0];
  result.value.queryInfo.multi = true;
  result.value.queryInfo.queryURL = [result.value.queryInfo.queryURL];
  JSONList.slice(1).forEach(element => {
    element.value.timeSeries.forEach(series => {
      JSONList[0].value.timeSeries.push(series);
      result.value.queryInfo.queryURL.push(element.value.queryInfo.queryURL);
    });
  });
  return result;
};

export { get, multiGet, combineJSONList };
