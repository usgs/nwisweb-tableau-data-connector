



const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const parse = require('csv-parse/lib/sync');
const fs = require('fs');



const rdbToJSON = (rdb) => {
  let lines = rdb.split('\n');
  lines.splice(0,7);
  lines.splice(1,1); // quick way to remove unnecesarry lines to make the rdb readable as rdb
  rdb =  lines.join('\n');
    let data =    parse(rdb, {
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
let agencyString = "";
let locAquiferString = "";


Promise.all(
  [get("https://help.waterdata.usgs.gov/code/site_tp_query?fmt=rdb"),          
  get("https://help.waterdata.usgs.gov/code/county_query?fmt=rdb"),
  get("https://help.waterdata.usgs.gov/code/parameter_cd_query?fmt=rdb&group_cd=%"),
get("https://help.waterdata.usgs.gov/code/agency_cd_query?fmt=rdb"),
get("https://help.waterdata.usgs.gov/code/aqfr_cd_query?fmt=rdb")]
  ).then((value)=>{
siteString = value[0];
countyString = value[1];
paramString = value[2];
agencyString = value[3];
locAquiferString = value[4];
 
paramData = rdbToJSON(paramString)
abridgedParamData = []
paramData.forEach(value => {
abridgedParamData.push({id: value["parm_cd"] , name: value["parm_nm"]});
});



let abridgedParamJSONString = JSON.stringify(abridgedParamData);
let siteTypesJSONString = JSON.stringify(rdbToJSON(siteString));
let countyJSONString = JSON.stringify(rdbToJSON(countyString));
let agencyJSONString = JSON.stringify(rdbToJSON(agencyString));
let locAquiferJSONString = JSON.stringify(rdbToJSON(locAquiferString));

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


let fipsTemplate = {
  "Northern Mariana Islands": "69",
  "Delaware": "10",
  "District of Columbia": "11",
  "Florida": "12",
  "Georgia": "13",
  "Hawaii": "15",
  "Idaho": "16",
  "Illinois": "17",
  "Indiana": "18",
  "Iowa": "19",
  "Kansas": "20",
  "Kentucky": "21",
  "Louisiana": "22",
  "Maine": "23",
  "Maryland": "24",
  "Massachusetts": "25",
  "Michigan": "26",
  "Minnesota": "27",
  "Mississippi": "28",
  "Missouri": "29",
  "Montana": "30",
  "Nebraska": "31",
  "Nevada": "32",
  "New Hampshire": "33",
  "New Jersey": "34",
  "New Mexico": "35",
  "New York": "36",
  "North Carolina": "37",
  "North Dakota": "38",
  "Ohio": "39",
  "Oklahoma": "40",
  "Oregon": "41",
  "Pennsylvania": "42",
  "Rhode Island": "44",
  "South Carolina": "45",
  "South Dakota": "46",
  "Tennessee": "47",
  "Texas": "48",
  "Utah": "49",
  "Vermont": "50",
  "Virginia": "51",
  "Washington": "53",
  "West Virginia": "54",
  "Wisconsin": "55",
  "Wyoming": "56",
  "American Samoa": "60",
  "Guam": "66",
  "Puerto Rico": "72",
  "Virgin Islands": "78",
  "Alabama": "01",
  "Alaska": "02",
  "Arizona": "04",
  "Arkansas": "05",
  "California": "06",
  "Colorado": "08",
  "Connecticut": "09"
}

let aquiferAreasTemplate = {
  "Atlantic Coast": "75",
  "Gulf of Mexico": "77",
  "Lake Erie": "96",
  "Marshall Islands": "MH",
  "Midway Islands": "MQ",
  "United States of America": "00"
}

let timeZoneOffsets =[
  "-1200",
  "-1100",
  "-1000",
  "-0930",
  "-0900",
  "-0800",
  "-0700",
  "-0600",
  "-0500",
  "-0430",
  "-0400",
  "-0330",
  "-0300",
  "-0200",
  "-0100",
  "+0000",
  "+0100",
  "+0200",
  "+0300",
  "+0330",
  "+0400",
  "+0430",
  "+0500",
  "+0530",
  "+0545",
  "+0600",
  "+0630",
  "+0700",
  "+0800",
  "+0845",
  "+0900",
  "+0930",
  "+1000",
  "+1030",
  "+1100",
  "+1130",
  "+1200",
  "+1245",
  "+1300",
  "+1400",
];

fs.writeFile("./src/fetchedValues/states.json", JSON.stringify(statesTemplate), function(err) {
  if(err) {
      return console.log(err);
  }

  console.log("./src/fetchedValues/states.json was saved!");
}); 

fs.writeFile("./src/fetchedValues/aquiferAreas.json", JSON.stringify(aquiferAreasTemplate), function(err) {
  if(err) {
      return console.log(err);
  }

  console.log("./src/fetchedValues/aquiferAreas.json was saved!");
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

fs.writeFile("./src/fetchedValues/fips.json", JSON.stringify(fipsTemplate), function(err) {
  if(err) {
      return console.log(err);
  }

  console.log("./src/fetchedValues/fips.json was saved!");
}); 

fs.writeFile("./src/fetchedValues/agency.json", agencyJSONString, function(err) {
  if(err) {
      return console.log(err);
  }

  console.log("./src/fetchedValues/agency.json was saved!");
}); 

fs.writeFile("./src/fetchedValues/timezones.json", JSON.stringify(timeZoneOffsets), function(err) {
  if(err) {
      return console.log(err);
  }

  console.log("./src/fetchedValues/timezones.json was saved!");
}); 



fs.writeFile("./src/fetchedValues/locAquifer.json", locAquiferJSONString, function(err) {
  if(err) {
      return console.log(err);
  }

  console.log("./src/fetchedValues/locAquifer.json was saved!");
}); 


}).catch(err => {console.log(err)});


