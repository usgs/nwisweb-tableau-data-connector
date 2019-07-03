



const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const parse = require('csv-parse/lib/sync');
const fs = require('fs');



const tsvToJSON = (tsv) => {
  let lines = tsv.split('\n');
  lines.splice(0,7);
  lines.splice(1,1); // quick way to remove unnecesarry lines to make the rdb readable as tsv
  tsv =  lines.join('\n');
    let data =    parse(tsv, {
        columns: true,
        skip_empty_lines: true,
        delimiter: "\t"
      })
      return data;
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
let countyString = "";
let paramString = "";


Promise.all(
  [get("https://help.waterdata.usgs.gov/code/site_tp_query?fmt=rdb"),          
  get("https://help.waterdata.usgs.gov/code/county_query?fmt=rdb"),
  get("https://help.waterdata.usgs.gov/code/parameter_cd_query?fmt=rdb&group_cd=%")]
  ).then((value)=>{
siteString = value[0];
countyString = value[1];
paramString = value[2];
 
paramData = tsvToJSON(paramString)
abridgedParamData = []
paramData.forEach(value => {
abridgedParamData.push({id: value["parm_cd"] , name: value["parm_nm"]});
});



let abridgedParamJSONString = JSON.stringify(abridgedParamData);
let siteTypesJSONString = JSON.stringify(tsvToJSON(siteString));
let countyJSONString = JSON.stringify(tsvToJSON(countyString));



let statesTemplate = 
{
  "Alabama": "AL",
  "Alaska": "AK",
  "American Samoa": "AS",
  "Arizona": "AZ",
  "Arkansas": "AR",
  "California": "CA",
  "Colorado": "CO",
  "Connecticut": "CT",
  "Delaware": "DE",
  "District of Columbia": "DC",
  "Federated States Of Micronesia": "FM",
  "Florida": "FL",
  "Georgia": "GA",
  "Guam": "GU",
  "Hawaii": "HI",
  "Idaho": "ID",
  "Illinois": "IL",
  "Indiana": "IN",
  "Iowa": "IA",
  "Kansas": "KS",
  "Kentucky": "KY",
  "Louisiana": "LA",
  "Maine": "ME",
  "Marshall Islands": "MH",
  "Maryland": "MD",
  "Massachusetts": "MA",
  "Michigan": "MI",
  "Minnesota": "MN",
  "Mississippi": "MS",
  "Missouri": "MO",
  "Montana": "MT",
  "Nebraska": "NE",
  "Nevada": "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  "Northern Mariana Islands": "MP",
  "Ohio": "OH",
  "Oklahoma": "OK",
  "Oregon": "OR",
  "Palau": "PW",
  "Pennsylvania": "PA",
  "Puerto Rico": "PR",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  "Tennessee": "TN",
  "Texas": "TX",
  "Utah": "UT",
  "Vermont": "VT",
  "Virgin Islands": "VI",
  "Virginia": "VA",
  "Washington": "WA",
  "West Virginia": "WV",
  "Wisconsin": "WI",
  "Wyoming": "WY"
}

fs.writeFile("./src/fetchedValues/states.json", JSON.stringify(statesTemplate), function(err) {
  if(err) {
      return console.log(err);
  }

  console.log("./src/fetchedValues/states.json was saved!");
}); 


fs.writeFile("./src/fetchedValues/paramTypes.json", abridgedParamJSONString, function(err) {
  if(err) {
      return console.log(err);
  }

  console.log("./src/fetchedValues/paramTypes.json was saved!");
}); 

fs.writeFile("./src/fetchedValues/siteTypes.json", siteTypesJSONString, function(err) {
  if(err) {
      return console.log(err);
  }

  console.log("./src/fetchedValues/siteTypes.json was saved!");
}); 
fs.writeFile("./src/fetchedValues/counties.json", countyJSONString, function(err) {
  if(err) {
      return console.log(err);
  }

  console.log("./src/fetchedValues/counties.json was saved!");
}); 




}).catch(err => {console.log(err)});


