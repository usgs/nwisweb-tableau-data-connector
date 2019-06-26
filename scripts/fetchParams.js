



XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
parse = require('csv-parse/lib/sync');



const tsvToJSON = (tsv) => {
   let data =    parse(tsv, {
        columns: true,
        skip_empty_lines: true,
        delimiter: "\t"
      })
      console.log(/*JSON.stringify(data)*/"test");
};

  const get = (url) => {
    // Return a new promise.
    return new Promise(function(resolve, reject) {
      // Do the usual XHR stuff

      let req = new XMLHttpRequest();
      req.responseType = "";// responseType;
  
      req.open("GET", url);
  
      req.onload = function() {
        // This is called even on 404 etc
        // so check the status
        if (req.status == 200) {
          // Resolve the promise with the response text
          resolve(req.responseText);
        } else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          if (window.ga) {
            window.ga("send", "event", "serviceFailure", req.status, url);
          }
          alert(`Failed with status ${req.status}: ${req.statusText}`);
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


let siteString = "";
let counterString = "";
let paramString = "";


Promise.all([get("https://help.waterdata.usgs.gov/code/site_tp_query?fmt=rdb")/*,
            get("https://help.waterdata.usgs.gov/code/county_query?fmt=rdb"),
get("https://help.waterdata.usgs.gov/code/parameter_cd_query?fmt=rdb&group_cd=%")*/]).then((value)=>{
siteString = value[0];
//counterString = value[1];
//paramString = value[2];
console.log(tsvToJSON(siteString));
}).catch(err => {console.log(err)});


