



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
let agencyString = "";
let locAquiferString = "";


Promise.all(
  [get("https://help.waterdata.usgs.gov/code/site_tp_query?fmt=rdb"),          
  get("https://help.waterdata.usgs.gov/code/county_query?fmt=rdb"),
get("https://help.waterdata.usgs.gov/code/agency_cd_query?fmt=rdb"),
get("https://help.waterdata.usgs.gov/code/aqfr_cd_query?fmt=rdb")]
  ).then((value)=>{
siteString = value[0];
countyString = value[1];
agencyString = value[2];
locAquiferString = value[3];
 

let siteTypesJSONString = JSON.stringify(rdbToJSON(siteString));
let countyJSONString = JSON.stringify(rdbToJSON(countyString));
let agencyJSONString = JSON.stringify(rdbToJSON(agencyString));
let locAquiferJSONString = JSON.stringify(rdbToJSON(locAquiferString));


/* https://nwis.waterdata.usgs.gov/nwis/status/?form=realtime_pmcodes
    retrieved from the above url and converted to JSON. This may need to be updated at some point in the future.
    All 4 parameters with non-numeric ids were manually removed. 
*/
let IVParams =[
  {
      "id": "00003",
      "Group": "Information",
      "name": "Sampling depth, feet",
  },
  {
      "id": "00008",
      "Group": "Information",
      "name": "Sample accounting number",
  },
  {
      "id": "00009",
      "Group": "Information",
      "name": "Location in cross section, distance from left bank looking downstream, feet",
  },
  {
      "id": "00010",
      "Group": "Physical",
      "name": "Temperature, water, degrees Celsius",
  },
  {
      "id": "00011",
      "Group": "Physical",
      "name": "Temperature, water, degrees Fahrenheit",
  },
  {
      "id": "00020",
      "Group": "Physical",
      "name": "Temperature, air, degrees Celsius",
  },
  {
      "id": "00021",
      "Group": "Physical",
      "name": "Temperature, air, degrees Fahrenheit",
  },
  {
      "id": "00025",
      "Group": "Physical",
      "name": "Barometric pressure, millimeters of mercury",
  },
  {
      "id": "00030",
      "Group": "Physical",
      "name": "Incident solar radiation intensity, calories per square centimeter per day",
  },
  {
      "id": "00035",
      "Group": "Physical",
      "name": "Wind speed, miles per hour",
  },
  {
      "id": "00036",
      "Group": "Physical",
      "name": "Wind direction, degrees clockwise from true north",
  },
  {
      "id": "00042",
      "Group": "Information",
      "name": "Altitude, feet above mean sea level",
  },
  {
      "id": "00045",
      "Group": "Physical",
      "name": "Precipitation, total, inches",
  },
  {
      "id": "00047",
      "Group": "Physical",
      "name": "Total partial pressure of dissolved gases, water, unfiltered, millimeters of mercury",
  },
  {
      "id": "00048",
      "Group": "Physical",
      "name": "Total partial pressure of dissolved gases, water, unfiltered, percent of saturation",
  },
  {
      "id": "00050",
      "Group": "Physical",
      "name": "Evaporation total, inches per day",
  },
  {
      "id": "00052",
      "Group": "Physical",
      "name": "Relative humidity, percent",
  },
  {
      "id": "00053",
      "Group": "Physical",
      "name": "Surface area, acres",
  },
  {
      "id": "00054",
      "Group": "Information",
      "name": "Reservoir storage, acre feet",
  },
  {
      "id": "00055",
      "Group": "Physical",
      "name": "Stream velocity, feet per second",
  },
  {
      "id": "00058",
      "Group": "Physical",
      "name": "Flow rate of well, gallons per minute",
  },
  {
      "id": "00059",
      "Group": "Physical",
      "name": "Flow rate, instantaneous, gallons per minute",
  },
  {
      "id": "00060",
      "Group": "Physical",
      "name": "Discharge, cubic feet per second",
  },
  {
      "id": "00061",
      "Group": "Physical",
      "name": "Discharge, instantaneous, cubic feet per second",
  },
  {
      "id": "00062",
      "Group": "Physical",
      "name": "Elevation of reservoir water surface above datum, feet",
  },
  {
      "id": "00063",
      "Group": "Information",
      "name": "Number of sampling points, count",
  },
  {
      "id": "00064",
      "Group": "Physical",
      "name": "Mean depth of stream, feet",
  },
  {
      "id": "00065",
      "Group": "Physical",
      "name": "Gage height, feet",
  },
  {
      "id": "00067",
      "Group": "Physical",
      "name": "Tide stage, code",
  },
  {
      "id": "00070",
      "Group": "Physical",
      "name": "Turbidity, water, unfiltered, Jackson Turbidity Units",
  },
  {
      "id": "00072",
      "Group": "Physical",
      "name": "Stream stage, meters",
  },
  {
      "id": "00076",
      "Group": "Physical",
      "name": "Turbidity, water, unfiltered, nephelometric turbidity units",
  },
  {
      "id": "00090",
      "Group": "Physical",
      "name": "Oxidation reduction potential, reference electrode not specified, millivolts",
  },
  {
      "id": "00095",
      "Group": "Physical",
      "name": "Specific conductance, water, unfiltered, microsiemens per centimeter at 25 degrees Celsius",
  },
  {
      "id": "00096",
      "Group": "Physical",
      "name": "Salinity, water, unfiltered, milligrams per milliliter at 25 degrees Celsius",
  },
  {
      "id": "00098",
      "Group": "Information",
      "name": "Sampling depth, meters",
  },
  {
      "id": "00117",
      "Group": "Physical",
      "name": "Precipitation, duration of storm event, minutes",
  },
  {
      "id": "00129",
      "Group": "Physical",
      "name": "Precipitation, intensity at given time, location 1, inches per hour",
  },
  {
      "id": "00134",
      "Group": "Information",
      "name": "Storm event serial number",
  },
  {
      "id": "00193",
      "Group": "Physical",
      "name": "Precipitation total for defined period, inches",
  },
  {
      "id": "00197",
      "Group": "Physical",
      "name": "Evaporation, accumulated, inches",
  },
  {
      "id": "00200",
      "Group": "Physical",
      "name": "Incident light intensity, 400-700 nanometers, microeinsteins per square meter per second",
  },
  {
      "id": "00201",
      "Group": "Physical",
      "name": "Incident light, daily total, 400-700 nanometers, microeinsteins per square meter",
  },
  {
      "id": "00300",
      "Group": "Inorganics, Major, Non-metals",
      "name": "Dissolved oxygen, water, unfiltered, milligrams per liter",
  },
  {
      "id": "00301",
      "Group": "Inorganics, Major, Non-metals",
      "name": "Dissolved oxygen, water, unfiltered, percent of saturation",
  },
  {
      "id": "00400",
      "Group": "Physical",
      "name": "pH, water, unfiltered, field, standard units",
  },
  {
      "id": "00401",
      "Group": "Physical",
      "name": "Cations minus anions, water, milliequivalents",
  },
  {
      "id": "00402",
      "Group": "Physical",
      "name": "Specific conductance, non-temperature corrected, water, unfiltered, microsiemens per centimeter",
  },
  {
      "id": "00403",
      "Group": "Physical",
      "name": "pH, water, unfiltered, laboratory, standard units",
  },
  {
      "id": "00480",
      "Group": "Physical",
      "name": "Salinity, water, unfiltered, parts per thousand",
  },
  {
      "id": "00530",
      "Group": "Physical",
      "name": "Suspended solids, water, unfiltered, milligrams per liter",
  },
  {
      "id": "00535",
      "Group": "Physical",
      "name": "Loss on ignition of suspended solids, water, unfiltered, milligrams per liter",
  },
  {
      "id": "00540",
      "Group": "Physical",
      "name": "Suspended solids remaining after ignition, water, unfiltered, milligrams per liter",
  },
  {
      "id": "00600",
      "Group": "Nutrient",
      "name": "Total nitrogen [nitrate + nitrite + ammonia + organic-N], water, unfiltered, milligrams per liter",
  },
  {
      "id": "00608",
      "Group": "Nutrient",
      "name": "Ammonia (NH3 + NH4+), water, filtered, milligrams per liter as nitrogen",
  },
  {
      "id": "00618",
      "Group": "Nutrient",
      "name": "Nitrate, water, filtered, milligrams per liter as nitrogen",
  },
  {
      "id": "00620",
      "Group": "Nutrient",
      "name": "Nitrate, water, unfiltered, milligrams per liter as nitrogen",
  },
  {
      "id": "00625",
      "Group": "Nutrient",
      "name": "Ammonia plus organic nitrogen, water, unfiltered, milligrams per liter as nitrogen",
  },
  {
      "id": "00630",
      "Group": "Nutrient",
      "name": "Nitrate plus nitrite, water, unfiltered, milligrams per liter as nitrogen",
  },
  {
      "id": "00631",
      "Group": "Nutrient",
      "name": "Nitrate plus nitrite, water, filtered, milligrams per liter as nitrogen",
  },
  {
      "id": "00650",
      "Group": "Nutrient",
      "name": "Phosphate, water, unfiltered, milligrams per liter as PO4",
  },
  {
      "id": "00665",
      "Group": "Nutrient",
      "name": "Phosphorus, water, unfiltered, milligrams per liter as phosphorus",
  },
  {
      "id": "00671",
      "Group": "Nutrient",
      "name": "Orthophosphate, water, filtered, milligrams per liter as phosphorus",
  },
  {
      "id": "00680",
      "Group": "Organics, Other",
      "name": "Organic carbon, water, unfiltered, milligrams per liter",
  },
  {
      "id": "00915",
      "Group": "Inorganics, Major, Metals",
      "name": "Calcium, water, filtered, milligrams per liter",
  },
  {
      "id": "00925",
      "Group": "Inorganics, Major, Metals",
      "name": "Magnesium, water, filtered, milligrams per liter",
  },
  {
      "id": "00930",
      "Group": "Inorganics, Major, Metals",
      "name": "Sodium, water, filtered, milligrams per liter",
  },
  {
      "id": "00931",
      "Group": "Inorganics, Major, Metals",
      "name": "Sodium adsorption ratio (SAR), water, number",
  },
  {
      "id": "00940",
      "Group": "Inorganics, Major, Non-metals",
      "name": "Chloride, water, filtered, milligrams per liter",
  },
  {
      "id": "00950",
      "Group": "Inorganics, Major, Non-metals",
      "name": "Fluoride, water, filtered, milligrams per liter",
  },
  {
      "id": "01046",
      "Group": "Inorganics, Minor, Metals",
      "name": "Iron, water, filtered, micrograms per liter",
  },
  {
      "id": "04116",
      "Group": "Organics, PCBs",
      "name": "PCBs, water, unfiltered, recoverable, grams per day",
  },
  {
      "id": "07084",
      "Group": "Organics, Other",
      "name": "Rhodamine WT, water, unfiltered, recoverable, micrograms per liter",
  },
  {
      "id": "30207",
      "Group": "Physical",
      "name": "Gage height, above datum, meters",
  },
  {
      "id": "30208",
      "Group": "Physical",
      "name": "Discharge, cubic meters per second",
  },
  {
      "id": "30211",
      "Group": "Physical",
      "name": "Elevation above NGVD 1929, meters",
  },
  {
      "id": "30214",
      "Group": "Physical",
      "name": "Pressure, relative, manometer tank, count",
  },
  {
      "id": "30215",
      "Group": "Information",
      "name": "Signal, sediment, Markland meter, count",
  },
  {
      "id": "31720",
      "Group": "Biological",
      "name": "Bighead carp (Hypophthalmichthys nobilis), count of tagged fish per hour (count may include repeats of same fish)",
  },
  {
      "id": "31721",
      "Group": "Biological",
      "name": "Silver carp (Hypophthalmichthys molitrix), count of tagged fish per hour (count may include repeats of same fish)",
  },
  {
      "id": "31722",
      "Group": "Biological",
      "name": "Hybrid asian carp (Hypophthalmichthys nobliis and Hypophthalmichthys molitrix hybrids), count of tagged fish per hour (count may include repeats of same fish)",
  },
  {
      "id": "31723",
      "Group": "Biological",
      "name": "Sum of bighead, silver and hybrid carp, count of tagged fish per hour (count may include repeats of same fish)",
  },
  {
      "id": "31724",
      "Group": "Biological",
      "name": "Shovelnose sturgeon (Scaphirhynchus platorynchus), count of tagged fish per hour (count may include repeats of same fish)",
  },
  {
      "id": "31725",
      "Group": "Biological",
      "name": "Bighead carp (Hypophthalmichthys nobilis), count of unique tagged fish per hour (same fish are not counted more than once per hour)",
  },
  {
      "id": "31726",
      "Group": "Biological",
      "name": "Silver carp (Hypophthalmichthys molitrix), count of unique tagged fish per hour (same fish are not counted more than once per hour)",
  },
  {
      "id": "31727",
      "Group": "Biological",
      "name": "Hybrid asian carp (Hypophthalmichthys nobliis and Hypophthalmichthys molitrix hybrids), count of unique tagged fish per hour (same fish are not counted more than once per",
  },
  {
      "id": "31728",
      "Group": "Biological",
      "name": "Sum of bighead, silver and hybrid carp, count of unique tagged fish per hour (same fish are not counted more than once per hour)",
  },
  {
      "id": "31729",
      "Group": "Biological",
      "name": "Shovelnose sturgeon (Scaphirhynchus platorynchus), count of unique tagged fish per hour (same fish are not counted more than once per hour)",
  },
  {
      "id": "32209",
      "Group": "Biological",
      "name": "Chlorophyll a, water, fluorometric method, corrected, micrograms per liter",
  },
  {
      "id": "32210",
      "Group": "Biological",
      "name": "Chlorophyll a, water, trichromatic method, uncorrected, micrograms per liter",
  },
  {
      "id": "32234",
      "Group": "Biological",
      "name": "Chlorophylls, phytoplankton, spectrophotometric method, uncorrected, micrograms per liter",
  },
  {
      "id": "32283",
      "Group": "Biological",
      "name": "Chlorophyll fluorescence (fChl), total, water, in situ, fluorometric, 650-700 nm, relative fluorescence units (RFU)",
  },
  {
      "id": "32284",
      "Group": "Biological",
      "name": "Chlorophyll a, total, in situ, fluorescence excitation at 370, 470, 525, 570, 590, 610 nm, fluorescence emission at 700 nm with correction for CDOM, ug/L",
  },
  {
      "id": "32285",
      "Group": "Biological",
      "name": "Chlorophyll a, green algae, in situ, fluorescence excitation at 370, 470, 525, 570, 590, 610 nm, fluorescence emission at 700 nm with correction for CDOM, ug/L",
  },
  {
      "id": "32286",
      "Group": "Biological",
      "name": "Chlorophyll a, cyanobacteria, in situ, fluorescence excitation at 370, 470, 525, 570, 590, 610 nm, fluorescence emission at 700 nm with correction for CDOM, ug/L",
  },
  {
      "id": "32287",
      "Group": "Biological",
      "name": "Chlorophyll a, cryptophytes, in situ, fluorescence excitation at 370, 470, 525, 570, 590, 610 nm, fluorescence emission at 700 nm with correction for CDOM, ug/L",
  },
  {
      "id": "32288",
      "Group": "Biological",
      "name": "Chlorophyll a, diatoms and dinoflagellates, in situ, excitation at 370, 470, 525, 570, 590, 610 nm, fluorescence emission at 700 nm with correction for CDOM, ug/L",
  },
  {
      "id": "32289",
      "Group": "Organics, Other",
      "name": "Colored dissolved organic matter (CDOM), in situ, fluorescence excitation at 370, 470, 525, 570, 590, 610 nm, fluorescence emission at 700 nm, milligrams per liter",
  },
  {
      "id": "32290",
      "Group": "Physical",
      "name": "Fluorescence transmission (transparency to fluorescence) at 700 nm, percent",
  },
  {
      "id": "32293",
      "Group": "Physical",
      "name": "UV fluorescence, water, in situ, single band, 370 nm excitation, 470 nm emission, relative fluorescence units (RFU)",
  },
  {
      "id": "32295",
      "Group": "Physical",
      "name": "Dissolved organic matter fluorescence (fDOM), water, in situ, concentration estimated from reference material, micrograms per liter as quinine sulfate equivalents (QSE)",
  },
  {
      "id": "32314",
      "Group": "Organics, Other",
      "name": "Colored dissolved organic matter (CDOM), water, filtered, field, single band excitation, fluorescence emission, micrograms per liter of quinine sulfate equivalents (QSE)",
  },
  {
      "id": "32315",
      "Group": "Physical",
      "name": "Chlorophyll relative fluorescence (fChl), water, in situ, relative fluorescence units (RFU)",
  },
  {
      "id": "32316",
      "Group": "Physical",
      "name": "Chlorophyll fluorescence (fChl), water, in situ, concentration estimated from reference material, micrograms per liter as chlorophyll",
  },
  {
      "id": "32317",
      "Group": "Biological",
      "name": "Chlorophyll a, water, in situ, concentration computed by regression of sensor data with field sample lab results, micrograms per liter as chlorophyll a",
  },
  {
      "id": "32318",
      "Group": "Biological",
      "name": "Chlorophylls, water, in situ, fluorometric method, excitation at 470 +-15 nm, emission at 685 +-20 nm, micrograms per liter",
  },
  {
      "id": "32319",
      "Group": "Physical",
      "name": "Phycocyanin fluorescence (fPC), water, in situ, concentration estimated from reference material, micrograms per liter as phycocyanin",
  },
  {
      "id": "32320",
      "Group": "Biological",
      "name": "Chlorophyll fluorescence (fChl), water, in situ, fluorometric method, excitation at 470 +-15 nm, emission at 685 +-20 nm, relative fluorescence units (RFU)",
  },
  {
      "id": "32321",
      "Group": "Physical",
      "name": "Phycocyanin relative fluorescence (fPC), water, in situ, relative fluorescence units (RFU)",
  },
  {
      "id": "32322",
      "Group": "Physical",
      "name": "Dissolved organic matter relative fluorescence (fDOM), water, in situ, relative fluorescence units (RFU)",
  },
  {
      "id": "32323",
      "Group": "Physical",
      "name": "Phycoerythrin relative fluorescence (fPE), water, in situ, relative fluorescence units (RFU)",
  },
  {
      "id": "32325",
      "Group": "Information",
      "name": "Dark measurement spectral average, water, in situ, ultraviolet nitrate analyzer, raw counts",
  },
  {
      "id": "32326",
      "Group": "Information",
      "name": "Light measurement spectral average, water, in situ, ultraviolet nitrate analyzer, raw counts",
  },
  {
      "id": "32327",
      "Group": "Physical",
      "name": "Absorbance at 254 nm, water, in situ, absorbance units",
  },
  {
      "id": "32328",
      "Group": "Physical",
      "name": "Absorbance at 350 nm, water, in situ, absorbance units",
  },
  {
      "id": "32330",
      "Group": "Organics, Other",
      "name": "Colored dissolved organic matter fluorescence (fDOM), water, in situ, milligrams per liter of carbon",
  },
  {
      "id": "45585",
      "Group": "Information",
      "name": "Gate opening, width, feet",
  },
  {
      "id": "45586",
      "Group": "Information",
      "name": "Lockage, count of lock openings, units",
  },
  {
      "id": "45587",
      "Group": "Information",
      "name": "Temperature, internal, within data collection platform, degrees Celsius",
  },
  {
      "id": "45589",
      "Group": "Information",
      "name": "Temperature, internal, within equipment shelter, degrees Celsius",
  },
  {
      "id": "45590",
      "Group": "Information",
      "name": "Temperature, internal, within equipment shelter, degrees Fahrenheit",
  },
  {
      "id": "45591",
      "Group": "Information",
      "name": "Gate opening, height, meters",
  },
  {
      "id": "45592",
      "Group": "Information",
      "name": "Gate opening, height, feet",
  },
  {
      "id": "45700",
      "Group": "Information",
      "name": "Gate openings, reservoir, all gates, feet",
  },
  {
      "id": "46311",
      "Group": "Physical",
      "name": "Moisture content, soil, dry weight, percent",
  },
  {
      "id": "46515",
      "Group": "Physical",
      "name": "Solar radiation, downward intensity, calories per square centimeter per minute",
  },
  {
      "id": "46516",
      "Group": "Physical",
      "name": "Solar radiation, net, calories per square centimeter per minute",
  },
  {
      "id": "46529",
      "Group": "Physical",
      "name": "Precipitation, inches",
  },
  {
      "id": "49956",
      "Group": "Information",
      "name": "Distance, observation point to sample location, feet",
  },
  {
      "id": "50011",
      "Group": "Physical",
      "name": "Temperature, vent gas, volcanic, degrees Celsius",
  },
  {
      "id": "50012",
      "Group": "Physical",
      "name": "Compaction, aquifer system, feet",
  },
  {
      "id": "50042",
      "Group": "Physical",
      "name": "Discharge, gallons per minute",
  },
  {
      "id": "50050",
      "Group": "Physical",
      "name": "Flow, in conduit or through a treatment plant, million gallons per day",
  },
  {
      "id": "50051",
      "Group": "Physical",
      "name": "Flow rate, instantaneous, million gallons per day",
  },
  {
      "id": "50052",
      "Group": "Physical",
      "name": "Flow total during composite period, thousands of gallons",
  },
  {
      "id": "50060",
      "Group": "Inorganics, Major, Non-metals",
      "name": "Chlorine (total residual), water, unfiltered, milligrams per liter",
  },
  {
      "id": "50292",
      "Group": "Information",
      "name": "Gain control, automatic receiver, acoustic velocity meter, decibels",
  },
  {
      "id": "50294",
      "Group": "Information",
      "name": "Diagnostic code, tattler, acoustic velocity meter, number",
  },
  {
      "id": "50415",
      "Group": "Information",
      "name": "Distance, observation point to stream bottom, feet",
  },
  {
      "id": "50624",
      "Group": "Physical",
      "name": "Absorbance, 254 nm, water, filtered, absorbance units per centimeter",
  },
  {
      "id": "51185",
      "Group": "Nutrient",
      "name": "Nitrate, water, unfiltered, field, milligrams per liter",
  },
  {
      "id": "51186",
      "Group": "Nutrient",
      "name": "Inorganic nitrogen, water, dissolved, calculated as NH3+NO2+NO3, milligrams per liter as nitrogen",
  },
  {
      "id": "51187",
      "Group": "Nutrient",
      "name": "Inorganic nitrogen, water, dissolved, calculated as NH3+NO2+NO3, short tons per day as nitrogen",
  },
  {
      "id": "51289",
      "Group": "Nutrient",
      "name": "Orthophosphate, water, in situ, milligrams per liter as phosphorus",
  },
  {
      "id": "61028",
      "Group": "Physical",
      "name": "Turbidity, water, unfiltered, field, nephelometric turbidity units",
  },
  {
      "id": "61035",
      "Group": "Information",
      "name": "Voltage, volts",
  },
  {
      "id": "61727",
      "Group": "Physical",
      "name": "Wind gust speed, air, knots",
  },
  {
      "id": "61728",
      "Group": "Physical",
      "name": "Wind gust speed, air, miles per hour",
  },
  {
      "id": "61729",
      "Group": "Physical",
      "name": "Wind gust direction, air, degrees clockwise from true north",
  },
  {
      "id": "62361",
      "Group": "Biological",
      "name": "Chlorophyll, total, water, fluorometric, 650-700 nanometers, in situ sensor, micrograms per liter",
  },
  {
      "id": "62600",
      "Group": "Physical",
      "name": "Water level elevation above NGVD 1929, corrected for barometric pressure, feet",
  },
  {
      "id": "62602",
      "Group": "Physical",
      "name": "Barometric pressure, corrected to sea level, inches of mercury",
  },
  {
      "id": "62603",
      "Group": "Physical",
      "name": "Barometric pressure, uncorrected, inches of mercury",
  },
  {
      "id": "62607",
      "Group": "Physical",
      "name": "Barometric pressure, uncorrected, kilopascals",
  },
  {
      "id": "62608",
      "Group": "Physical",
      "name": "Total solar radiation (direct + diffuse radiation on a horizontal surface), watts per square meter",
  },
  {
      "id": "62609",
      "Group": "Physical",
      "name": "Net solar radiation, watts per square meter",
  },
  {
      "id": "62610",
      "Group": "Physical",
      "name": "Groundwater level above NGVD 1929, feet",
  },
  {
      "id": "62611",
      "Group": "Physical",
      "name": "Groundwater level above NAVD 1988, feet",
  },
  {
      "id": "62614",
      "Group": "Physical",
      "name": "Lake or reservoir water surface elevation above NGVD 1929, feet",
  },
  {
      "id": "62615",
      "Group": "Physical",
      "name": "Lake or reservoir water surface elevation above NAVD 1988, feet",
  },
  {
      "id": "62616",
      "Group": "Physical",
      "name": "Lake or reservoir water surface elevation above NGVD 1929, meters",
  },
  {
      "id": "62617",
      "Group": "Physical",
      "name": "Lake or reservoir water surface elevation above NAVD 1988, meters",
  },
  {
      "id": "62619",
      "Group": "Physical",
      "name": "Estuary or ocean water surface elevation above NGVD 1929, feet",
  },
  {
      "id": "62620",
      "Group": "Physical",
      "name": "Estuary or ocean water surface elevation above NAVD 1988, feet",
  },
  {
      "id": "62623",
      "Group": "Physical",
      "name": "Tide stage, above datum, feet",
  },
  {
      "id": "62625",
      "Group": "Physical",
      "name": "Wind speed, meters per second",
  },
  {
      "id": "62846",
      "Group": "Physical",
      "name": "Temperature, soil, degrees Fahrenheit",
  },
  {
      "id": "62961",
      "Group": "Nutrient",
      "name": "Ammonia (NH3 + NH4+), water, dissolved, pounds per day as nitrogen",
  },
  {
      "id": "62967",
      "Group": "Physical",
      "name": "Soil-heat flux, watts per square meter",
  },
  {
      "id": "62968",
      "Group": "Physical",
      "name": "Latent-heat flux, watts per square meter",
  },
  {
      "id": "62969",
      "Group": "Physical",
      "name": "Sensible-heat flux, watts per square meter",
  },
  {
      "id": "63158",
      "Group": "Physical",
      "name": "Stream water level elevation above NGVD 1929, in feet",
  },
  {
      "id": "63160",
      "Group": "Physical",
      "name": "Stream water level elevation above NAVD 1988, in feet",
  },
  {
      "id": "63518",
      "Group": "Organics, Pesticide",
      "name": "Acifluorfen, water, filtered, recoverable, micrograms per liter",
  },
  {
      "id": "63675",
      "Group": "Physical",
      "name": "Turbidity, water, unfiltered, broad band light source (400-680 nm), detection angle 90 +-30 degrees to incident light, nephelometric turbidity units (NTU)",
  },
  {
      "id": "63680",
      "Group": "Physical",
      "name": "Turbidity, water, unfiltered, monochrome near infra-red LED light, 780-900 nm, detection angle 90 +-2.5 degrees, formazin nephelometric units (FNU)",
  },
  {
      "id": "63681",
      "Group": "Physical",
      "name": "Turbidity, water, unfiltered, monochrome near infra-red LED light, 780-900 nm, detectors at multiple angles including 90 +-2.5 degrees, ratiometric correction, FNRU",
  },
  {
      "id": "63682",
      "Group": "Physical",
      "name": "Turbidity, water, unfiltered, monochrome near infra-red LED light source, 780-900 nm, detection angle 0-45 degrees to incident light (backscatter), FBU",
  },
  {
      "id": "63684",
      "Group": "Physical",
      "name": "Turbidity, water, unfiltered, monochrome near infra-red LED light source, 780-900 nm, multiple beam, detectors at multiple angles including 90 degrees, FNMU",
  },
  {
      "id": "65231",
      "Group": "Biological",
      "name": "Chlorophyll a, water, in situ, in vivo fluorescence, micrograms per liter",
  },
  {
      "id": "70227",
      "Group": "Physical",
      "name": "Direction of stream flow, magnetic azimuth, degrees",
  },
  {
      "id": "70290",
      "Group": "Inorganics, Major, Non-metals",
      "name": "Chloride, water, dissolved, short tons per day",
  },
  {
      "id": "70300",
      "Group": "Physical",
      "name": "Dissolved solids dried at 180 degrees Celsius, water, filtered, milligrams per liter",
  },
  {
      "id": "70301",
      "Group": "Physical",
      "name": "Dissolved solids, water, filtered, sum of constituents, milligrams per liter",
  },
  {
      "id": "70302",
      "Group": "Physical",
      "name": "Dissolved solids, water, short tons per day",
  },
  {
      "id": "70309",
      "Group": "Sediment",
      "name": "Compaction, sediment, feet",
  },
  {
      "id": "70507",
      "Group": "Nutrient",
      "name": "Orthophosphate, water, unfiltered, milligrams per liter as phosphorus",
  },
  {
      "id": "70953",
      "Group": "Biological",
      "name": "Chlorophyll a, phytoplankton, chromatographic-fluorometric method, micrograms per liter",
  },
  {
      "id": "70968",
      "Group": "Biological",
      "name": "Respiration, milligrams oxygen per square meter per day",
  },
  {
      "id": "70969",
      "Group": "Information",
      "name": "DCP battery voltage, volts",
  },
  {
      "id": "71845",
      "Group": "Nutrient",
      "name": "Ammonia (NH3 + NH4+), water, unfiltered, milligrams per liter as NH4",
  },
  {
      "id": "71850",
      "Group": "Nutrient",
      "name": "Nitrate, water, unfiltered, milligrams per liter as nitrate",
  },
  {
      "id": "71900",
      "Group": "Inorganics, Minor, Metals",
      "name": "Mercury, water, unfiltered, recoverable, micrograms per liter",
  },
  {
      "id": "71994",
      "Group": "Information",
      "name": "Volume of water filtered, liters",
  },
  {
      "id": "72000",
      "Group": "Information",
      "name": "Altitude of land surface, feet",
  },
  {
      "id": "72001",
      "Group": "Physical",
      "name": "Depth of hole, feet below land surface datum",
  },
  {
      "id": "72004",
      "Group": "Information",
      "name": "Pump or flow period prior to sampling, minutes",
  },
  {
      "id": "72006",
      "Group": "Information",
      "name": "Sampling condition, code",
  },
  {
      "id": "72019",
      "Group": "Physical",
      "name": "Depth to water level, feet below land surface",
  },
  {
      "id": "72020",
      "Group": "Physical",
      "name": "Elevation above NGVD 1929, feet",
  },
  {
      "id": "72022",
      "Group": "Physical",
      "name": "Reservoir storage, million gallons",
  },
  {
      "id": "72023",
      "Group": "Information",
      "name": "Reservoir storage, million cubic feet",
  },
  {
      "id": "72024",
      "Group": "Physical",
      "name": "Pond storage, gallons",
  },
  {
      "id": "72036",
      "Group": "Information",
      "name": "Reservoir storage, thousand acre feet",
  },
  {
      "id": "72106",
      "Group": "Physical",
      "name": "Elevation of sample, feet",
  },
  {
      "id": "72111",
      "Group": "Information",
      "name": "DRGS transmission error codes",
  },
  {
      "id": "72112",
      "Group": "Information",
      "name": "DCP signal to noise ratio",
  },
  {
      "id": "72113",
      "Group": "Information",
      "name": "DCP signal modulation index, decibels",
  },
  {
      "id": "72114",
      "Group": "Information",
      "name": "Estimate of DCP transmitted power, decibels",
  },
  {
      "id": "72115",
      "Group": "Information",
      "name": "DCP frequency offset from channel center, hertz",
  },
  {
      "id": "72116",
      "Group": "Information",
      "name": "Number of bad characters transmitted by DCP",
  },
  {
      "id": "72117",
      "Group": "Information",
      "name": "Data collection platform transmission delivery delay, seconds",
  },
  {
      "id": "72120",
      "Group": "Information",
      "name": "Reservoir storage, total pool, percent of capacity",
  },
  {
      "id": "72121",
      "Group": "Information",
      "name": "Reservoir storage, live pool, percent of capacity",
  },
  {
      "id": "72124",
      "Group": "Physical",
      "name": "Net radiation (net solar + net long wave radiation), watts per square meter",
  },
  {
      "id": "72125",
      "Group": "Physical",
      "name": "Atmospheric water vapor pressure, calculated, kilopascals",
  },
  {
      "id": "72126",
      "Group": "Information",
      "name": "Standard deviation of wind direction, degrees",
  },
  {
      "id": "72130",
      "Group": "Physical",
      "name": "Potential evapotranspiration (PET), calculated by Penman method, millimeters per hour",
  },
  {
      "id": "72135",
      "Group": "Physical",
      "name": "Evapotranspiration total, inches per day",
  },
  {
      "id": "72137",
      "Group": "Physical",
      "name": "Discharge, tidally filtered, cubic feet per second",
  },
  {
      "id": "72147",
      "Group": "Information",
      "name": "Depth of sensor below water surface, feet",
  },
  {
      "id": "72148",
      "Group": "Information",
      "name": "Depth of sensor below water surface, meters",
  },
  {
      "id": "72149",
      "Group": "Physical",
      "name": "Stream velocity, meters per second",
  },
  {
      "id": "72150",
      "Group": "Physical",
      "name": "Groundwater level relative to Mean Sea Level (MSL), feet",
  },
  {
      "id": "72151",
      "Group": "Physical",
      "name": "Water column pressure, pounds per square inch",
  },
  {
      "id": "72152",
      "Group": "Information",
      "name": "Collector wet exposure (time within recording interval that collector is open when it should be open), seconds",
  },
  {
      "id": "72153",
      "Group": "Information",
      "name": "Collector dry exposure (time within recording interval that collector is open but should be closed), seconds",
  },
  {
      "id": "72154",
      "Group": "Information",
      "name": "Collector missed exposure (time within recording interval that collector is closed but should be open), seconds",
  },
  {
      "id": "72155",
      "Group": "Information",
      "name": "Blocked optical sensor (time within recording interval that optical sensor is blocked), seconds",
  },
  {
      "id": "72156",
      "Group": "Information",
      "name": "Datalogger scan time per recording interval, seconds",
  },
  {
      "id": "72157",
      "Group": "Information",
      "name": "Optical sensor particle counts within recording interval, number",
  },
  {
      "id": "72158",
      "Group": "Information",
      "name": "Collector lid cycles in recording interval, number",
  },
  {
      "id": "72159",
      "Group": "Physical",
      "name": "Evapotranspiration, millimeters per day",
  },
  {
      "id": "72166",
      "Group": "Information",
      "name": "Raw sensor value, millivolts",
  },
  {
      "id": "72167",
      "Group": "Physical",
      "name": "Matric potential or pressure head, centimeters",
  },
  {
      "id": "72172",
      "Group": "Physical",
      "name": "Wave height, Fourier transformation, feet",
  },
  {
      "id": "72173",
      "Group": "Physical",
      "name": "Wave period, Fourier transformation, seconds",
  },
  {
      "id": "72174",
      "Group": "Physical",
      "name": "Longwave radiation, upward intensity, watts per square meter",
  },
  {
      "id": "72175",
      "Group": "Physical",
      "name": "Longwave radiation, downward intensity, watts per square meter",
  },
  {
      "id": "72176",
      "Group": "Information",
      "name": "Temperature of sensor, degrees Celsius",
  },
  {
      "id": "72178",
      "Group": "Physical",
      "name": "Water depth, water surface to bottom, meters",
  },
  {
      "id": "72180",
      "Group": "Physical",
      "name": "Evapotranspiration, inches",
  },
  {
      "id": "72181",
      "Group": "Physical",
      "name": "Moisture content, soil, volumetric, fraction of total volume",
  },
  {
      "id": "72182",
      "Group": "Physical",
      "name": "Atmospheric water vapor density, grams per cubic meter",
  },
  {
      "id": "72185",
      "Group": "Physical",
      "name": "Shortwave radiation, upward intensity, watts per square meter",
  },
  {
      "id": "72186",
      "Group": "Physical",
      "name": "Shortwave radiation, downward intensity, watts per square meter",
  },
  {
      "id": "72189",
      "Group": "Physical",
      "name": "Snow depth, meters",
  },
  {
      "id": "72192",
      "Group": "Physical",
      "name": "Precipitation, cumulative, inches",
  },
  {
      "id": "72198",
      "Group": "Physical",
      "name": "Snow depth, feet",
  },
  {
      "id": "72199",
      "Group": "Physical",
      "name": "Water depth, water surface to bottom, feet",
  },
  {
      "id": "72200",
      "Group": "Physical",
      "name": "Evaporation per recording interval, millimeters",
  },
  {
      "id": "72201",
      "Group": "Physical",
      "name": "Net incident shortwave radiation, watts per square meter",
  },
  {
      "id": "72202",
      "Group": "Physical",
      "name": "Net emitted longwave radiation, watts per square meter",
  },
  {
      "id": "72203",
      "Group": "Information",
      "name": "Absolute pressure from unvented pressure transducer, pounds per square inch",
  },
  {
      "id": "72204",
      "Group": "Physical",
      "name": "Barometric pressure (BP), uncorrected, pounds per square inch",
  },
  {
      "id": "72205",
      "Group": "Physical",
      "name": "Bulk electrical conductance, soil, decisiemens per meter",
  },
  {
      "id": "72206",
      "Group": "Physical",
      "name": "Sublimation from snowpack per recording interval, millimeters",
  },
  {
      "id": "72207",
      "Group": "Physical",
      "name": "Albedo (ratio of reflected to total incoming solar radiation), ratio",
  },
  {
      "id": "72213",
      "Group": "Physical",
      "name": "Turbidity, water, unfiltered, monochrome near infra-red LED light, 780-900 nm, detector angles at 90 +-2.5 degrees and 0-45 degrees, ratiometric, FBRU",
  },
  {
      "id": "72214",
      "Group": "Physical",
      "name": "Lake or reservoir elevation above International Great Lakes Datum (IGLD), feet",
  },
  {
      "id": "72216",
      "Group": "Physical",
      "name": "Location of salt front in river miles upstream from mouth, miles",
  },
  {
      "id": "72223",
      "Group": "Physical",
      "name": "Soil water matric potential, bars",
  },
  {
      "id": "72224",
      "Group": "Physical",
      "name": "Extinction reference absorbance, absorbance units per centimeter",
  },
  {
      "id": "72225",
      "Group": "Physical",
      "name": "Extinction measurement absorbance, absorbance units per centimeter",
  },
  {
      "id": "72226",
      "Group": "Physical",
      "name": "Groundwater level above American Samoa Datum of 1962 (retired in 2001), feet",
  },
  {
      "id": "72227",
      "Group": "Physical",
      "name": "Groundwater level above American Samoa Vertical Datum of 2002, feet",
  },
  {
      "id": "72228",
      "Group": "Physical",
      "name": "Groundwater level above Guam Vertical Datum of 1963 (retired in 2003), feet",
  },
  {
      "id": "72229",
      "Group": "Physical",
      "name": "Groundwater level above Guam Vertical Datum of 2004, feet",
  },
  {
      "id": "72230",
      "Group": "Physical",
      "name": "Groundwater level above Local Hawaiian Datum, feet",
  },
  {
      "id": "72231",
      "Group": "Physical",
      "name": "Groundwater level above Northern Marianas Vertical Datum of 2003, feet",
  },
  {
      "id": "72238",
      "Group": "Information",
      "name": "Sediment corrected acoustic backscatter (SCB), decibels",
  },
  {
      "id": "72240",
      "Group": "Inorganics, Major, Non-metals",
      "name": "Carbon dioxide, water, dissolved, at the water surface, parts per million by volume of dissolved gases",
  },
  {
      "id": "72243",
      "Group": "Physical",
      "name": "Discharge, cubic feet per day",
  },
  {
      "id": "72250",
      "Group": "Physical",
      "name": "Marsh mat (floating vegetation) elevation above NAVD 1988, feet",
  },
  {
      "id": "72251",
      "Group": "Physical",
      "name": "Water level above marsh, feet",
  },
  {
      "id": "72252",
      "Group": "Physical",
      "name": "Solar radiation (average flux density on a horizontal surface during measurement interval), kilowatts per square meter",
  },
  {
      "id": "72253",
      "Group": "Physical",
      "name": "Soil temperature, degrees Celsius",
  },
  {
      "id": "72254",
      "Group": "Information",
      "name": "Water velocity reading from field sensor, feet per second",
  },
  {
      "id": "72255",
      "Group": "Information",
      "name": "Mean water velocity for discharge computation, feet per second",
  },
  {
      "id": "72258",
      "Group": "Information",
      "name": "Coefficient used to adjust discharge, Slope-Q computation",
  },
  {
      "id": "72259",
      "Group": "Information",
      "name": "Dielectric permittivity, soil, in situ",
  },
  {
      "id": "72264",
      "Group": "Physical",
      "name": "Lake or reservoir elevation above New York State Barge Canal Datum (NYBCD), feet",
  },
  {
      "id": "72270",
      "Group": "Physical",
      "name": "Volume of water, total during measurement interval, liters",
  },
  {
      "id": "72272",
      "Group": "Physical",
      "name": "Discharge, cumulative, acre-feet",
  },
  {
      "id": "72274",
      "Group": "Physical",
      "name": "Scour hole bottom elevation above NGVD 1929, feet",
  },
  {
      "id": "72275",
      "Group": "Physical",
      "name": "Lake or reservoir elevation above United States Bureau of Reclamation Klamath Basin (USBRKB) Datum, feet",
  },
  {
      "id": "72276",
      "Group": "Physical",
      "name": "Tidal water level, NOS-averaged, distance from measuring point to water surface, feet",
  },
  {
      "id": "72277",
      "Group": "Information",
      "name": "Datum offset, elevation of water leveling point in reference to established datum, feet",
  },
  {
      "id": "72278",
      "Group": "Information",
      "name": "Sensor offset, water level sensor, feet",
  },
  {
      "id": "72279",
      "Group": "Physical",
      "name": "Tidal elevation, NOS-averaged, NAVD88, feet",
  },
  {
      "id": "72280",
      "Group": "Information",
      "name": "Number of outliers, data points discarded from NOS-averaged dateset, count",
  },
  {
      "id": "72281",
      "Group": "Information",
      "name": "Standard deviation, from NOS-averaged dataset, feet",
  },
  {
      "id": "72282",
      "Group": "Information",
      "name": "Temperature #1, Aquatrak, air temperature of the upper sounding well, degrees Fahrenheit",
  },
  {
      "id": "72283",
      "Group": "Information",
      "name": "Temperature #2, Aquatrak, air temperature of the bottom sounding well, degrees Fahrenheit",
  },
  {
      "id": "72284",
      "Group": "Physical",
      "name": "Mean wave height, meters",
  },
  {
      "id": "72285",
      "Group": "Physical",
      "name": "Mean wave period, seconds",
  },
  {
      "id": "72286",
      "Group": "Physical",
      "name": "Significant wave height, meters",
  },
  {
      "id": "72287",
      "Group": "Physical",
      "name": "Significant wave period, seconds",
  },
  {
      "id": "72288",
      "Group": "Physical",
      "name": "Maximum wave height, meters",
  },
  {
      "id": "72291",
      "Group": "Physical",
      "name": "Precipitation, intensity at given time, inches per minute",
  },
  {
      "id": "72292",
      "Group": "Physical",
      "name": "Water level elevation above NAVD 1988, corrected for barometric pressure, feet",
  },
  {
      "id": "72293",
      "Group": "Physical",
      "name": "Water level elevation above gage datum, corrected for barometric pressure, feet",
  },
  {
      "id": "72294",
      "Group": "Physical",
      "name": "Mean water velocity for discharge computation, miles per hour",
  },
  {
      "id": "72295",
      "Group": "Information",
      "name": "Acoustic backscatter, collected using an acoustic Doppler meter, corrected for beam spreading and absorption of the acoustic signal due to water properties, decibels",
  },
  {
      "id": "72296",
      "Group": "Information",
      "name": "Instrument noise level, measured by an acoustic Doppler meter, in counts",
  },
  {
      "id": "72297",
      "Group": "Information",
      "name": "Attenuation corrected backscatter, uncalibrated from LISST-ABS instrument, in counts",
  },
  {
      "id": "72298",
      "Group": "Sediment",
      "name": "Bedload transport rate, derived by regression equation, megagrams per day",
  },
  {
      "id": "72299",
      "Group": "Sediment",
      "name": "Bedload transport rate, derived by regression equation, short tons per day",
  },
  {
      "id": "72300",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 0 to 0.5 kHz, decibels",
  },
  {
      "id": "72301",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 0.5 to 1.0 kHz, decibels",
  },
  {
      "id": "72302",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 1.0 to 1.5 kHz, decibels",
  },
  {
      "id": "72303",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 1.5 to 2.0 kHz, decibels",
  },
  {
      "id": "72304",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 2.0 to 2.5 kHz, decibels",
  },
  {
      "id": "72305",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 2.5 to 3.0 kHz, decibels",
  },
  {
      "id": "72306",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 3.0 to 3.5 kHz, decibels",
  },
  {
      "id": "72307",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 3.5 to 4.0 kHz, decibels",
  },
  {
      "id": "72308",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 4.0 to 4.5 kHz, decibels",
  },
  {
      "id": "72309",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 4.5 to 5.0 kHz, decibels",
  },
  {
      "id": "72310",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 5.0 to 5.5 kHz, decibels",
  },
  {
      "id": "72311",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 5.5 to 6.0 kHz, decibels",
  },
  {
      "id": "72312",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 6.0 to 6.5 kHz, decibels",
  },
  {
      "id": "72313",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 6.5 to 7.0 kHz, decibels",
  },
  {
      "id": "72314",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 7.0 to 7.5 kHz, decibels",
  },
  {
      "id": "72315",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 7.5 to 8.0 kHz, decibels",
  },
  {
      "id": "72316",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 8.0 to 8.5 kHz, decibels",
  },
  {
      "id": "72317",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 8.5 to 9.0 kHz, decibels",
  },
  {
      "id": "72318",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 9.0 to 9.5 kHz, decibels",
  },
  {
      "id": "72319",
      "Group": "Information",
      "name": "Underwater sound level related to sediment-generated noise, averaged from 9.5 to 10.0 kHz, decibels",
  },
  {
      "id": "72320",
      "Group": "Information",
      "name": "Air gap, feet",
  },
  {
      "id": "72321",
      "Group": "Physical",
      "name": "Stream velocity, miles per hour",
  },
  {
      "id": "72322",
      "Group": "Physical",
      "name": "Surface velocity at point in stream, feet per second",
  },
  {
      "id": "72327",
      "Group": "Physical",
      "name": "Flow total during composite period, cubic feet",
  },
  {
      "id": "72328",
      "Group": "Physical",
      "name": "Runoff total during flow event, cubic feet",
  },
  {
      "id": "72329",
      "Group": "Physical",
      "name": "Pavement surface temperature, degrees Celcius",
  },
  {
      "id": "72330",
      "Group": "Physical",
      "name": "Streambed elevation at measurement point, NAVD88, feet",
  },
  {
      "id": "72331",
      "Group": "Physical",
      "name": "Reach-averaged stream width derived from satellite imagery, meters",
  },
  {
      "id": "72332",
      "Group": "Physical",
      "name": "Reach water-surface slope derived from satellite altimetry data",
  },
  {
      "id": "72333",
      "Group": "Physical",
      "name": "Reach averaged water-surface elevation derived from satellite altimetry data, meters",
  },
  {
      "id": "74207",
      "Group": "Physical",
      "name": "Moisture content, soil, volumetric, percent of total volume",
  },
  {
      "id": "75969",
      "Group": "Physical",
      "name": "Barometric pressure, not corrected to sea level, millibars",
  },
  {
      "id": "75971",
      "Group": "Information",
      "name": "Transducer excitation, depth sensing, millivolts",
  },
  {
      "id": "75972",
      "Group": "Information",
      "name": "Transducer signal, depth sensing, millivolts",
  },
  {
      "id": "80154",
      "Group": "Sediment",
      "name": "Suspended sediment concentration, milligrams per liter",
  },
  {
      "id": "80155",
      "Group": "Sediment",
      "name": "Suspended sediment discharge, short tons per day",
  },
  {
      "id": "80156",
      "Group": "Sediment",
      "name": "Total sediment discharge, short tons per day",
  },
  {
      "id": "80180",
      "Group": "Sediment",
      "name": "Total sediment concentration, milligrams per liter",
  },
  {
      "id": "80225",
      "Group": "Sediment",
      "name": "Bedload sediment discharge, short tons per day",
  },
  {
      "id": "80295",
      "Group": "Sediment",
      "name": "Suspended sediment load, water, unfiltered, estimated by regression equation, pounds per second",
  },
  {
      "id": "80297",
      "Group": "Sediment",
      "name": "Suspended sediment load, water, unfiltered, computed, the product of regression-computed suspended sediment concentration and streamflow, short tons per day",
  },
  {
      "id": "81026",
      "Group": "Physical",
      "name": "Water content of snow, inches",
  },
  {
      "id": "81027",
      "Group": "Physical",
      "name": "Temperature, soil, degrees Celsius",
  },
  {
      "id": "81029",
      "Group": "Physical",
      "name": "Temperature, snow, degrees Celsius",
  },
  {
      "id": "81203",
      "Group": "Inorganics, Major, Metals",
      "name": "Sodium, water, dissolved, short tons per day",
  },
  {
      "id": "81206",
      "Group": "Nutrient",
      "name": "Phosphorus, water, dissolved, pounds per day as phosphorus",
  },
  {
      "id": "81903",
      "Group": "Physical",
      "name": "Depth to bottom at sample location, feet",
  },
  {
      "id": "81904",
      "Group": "Physical",
      "name": "Velocity at point in stream, feet per second",
  },
  {
      "id": "81912",
      "Group": "Physical",
      "name": "Open pressure, pounds per square inch",
  },
  {
      "id": "82072",
      "Group": "Information",
      "name": "Dial reading, number",
  },
  {
      "id": "82127",
      "Group": "Physical",
      "name": "Wind speed, knots",
  },
  {
      "id": "82292",
      "Group": "Information",
      "name": "Data relay ground station source node, code",
  },
  {
      "id": "82300",
      "Group": "Physical",
      "name": "Snow depth, inches",
  },
  {
      "id": "82632",
      "Group": "Information",
      "name": "Area, cross section, square feet",
  },
  {
      "id": "83554",
      "Group": "Nutrient",
      "name": "Nitrate plus nitrite, water, total, short tons per day as nitrogen",
  },
  {
      "id": "83555",
      "Group": "Nutrient",
      "name": "Orthophosphate, water, dissolved, pounds of phosphorus per day",
  },
  {
      "id": "85583",
      "Group": "Physical",
      "name": "Temperature, intragravel water, degrees Celsius",
  },
  {
      "id": "90095",
      "Group": "Physical",
      "name": "Specific conductance, water, unfiltered, laboratory, microsiemens per centimeter at 25 degrees Celsius",
  },
  {
      "id": "90856",
      "Group": "Inorganics, Major, Metals",
      "name": "Sodium adsorption ratio (SAR), water, estimated by regression equation, number",
  },
  {
      "id": "90860",
      "Group": "Physical",
      "name": "Salinity, water, unfiltered, practical salinity units at 25 degrees Celsius",
  },
  {
      "id": "91007",
      "Group": "Nutrient",
      "name": "Phosphorus, water, unfiltered, short tons of phosphorus per day",
  },
  {
      "id": "91047",
      "Group": "Nutrient",
      "name": "Organic nitrogen, water, unfiltered, pounds of nitrogen per day",
  },
  {
      "id": "91048",
      "Group": "Nutrient",
      "name": "Ammonia (NH3 + NH4+), water, unfiltered, pounds of nitrogen per day",
  },
  {
      "id": "91049",
      "Group": "Nutrient",
      "name": "Nitrate plus nitrite, water, unfiltered, pounds of nitrogen per day",
  },
  {
      "id": "91050",
      "Group": "Nutrient",
      "name": "Phosphorus, water, unfiltered, pounds of phosphorus per day",
  },
  {
      "id": "91055",
      "Group": "Physical",
      "name": "Suspended solids dried at 105 degrees Celsius, water, unfiltered, short tons per day",
  },
  {
      "id": "91056",
      "Group": "Physical",
      "name": "Loss on ignition of suspended solids, water, unfiltered, short tons per day",
  },
  {
      "id": "91057",
      "Group": "Nutrient",
      "name": "Ammonia plus organic nitrogen, water, unfiltered, pounds of nitrogen per day",
  },
  {
      "id": "91058",
      "Group": "Nutrient",
      "name": "Total nitrogen [nitrate + nitrite + ammonia + organic-N], water, unfiltered, pounds of nitrogen per day",
  },
  {
      "id": "91059",
      "Group": "Nutrient",
      "name": "Orthophosphate, water, unfiltered, pounds of PO4 per day",
  },
  {
      "id": "91060",
      "Group": "Nutrient",
      "name": "Orthophosphate, water, dissolved, pounds per day",
  },
  {
      "id": "91061",
      "Group": "Nutrient",
      "name": "Nitrate plus nitrite, water, dissolved, pounds of nitrogen per day",
  },
  {
      "id": "95202",
      "Group": "Physical",
      "name": "Cyanobacteria fluorescence of phycocyanin (fPC), water, in situ, concentration estimated from reference material, cells per milliliter\"",
  },
  {
      "id": "95204",
      "Group": "Biological",
      "name": "Phycocyanins (cyanobacteria), water, in situ, in vivo fluorescence, in vivo fluorescence units",
  },
  {
      "id": "98232",
      "Group": "Population/Community",
      "name": "CHLOROBACTERIACEAE      (1) USGS,ACL-74",
  },
  {
      "id": "99020",
      "Group": "Physical",
      "name": "Elevation above NGVD 1929, meters",
  },
  {
      "id": "99060",
      "Group": "Physical",
      "name": "Discharge, cubic meters per second",
  },
  {
      "id": "99064",
      "Group": "Physical",
      "name": "Water surface elevation difference between two locations, feet",
  },
  {
      "id": "99065",
      "Group": "Physical",
      "name": "Gage height, above datum, meters",
  },
  {
      "id": "99067",
      "Group": "Physical",
      "name": "Difference between observed and predicted water surface elevation, feet",
  },
  {
      "id": "99099",
      "Group": "Inorganics, Minor, Metals",
      "name": "Manganese, water, unfiltered, computed by regression of sensor data with field sample lab results, micrograms per liter",
  },
  {
      "id": "99111",
      "Group": "Information",
      "name": "Type of quality assurance data associated with sample, code",
  },
  {
      "id": "99122",
      "Group": "Nutrient",
      "name": "Orthophosphate, water, filtered, field, milligrams per liter as PO4",
  },
  {
      "id": "99123",
      "Group": "Nutrient",
      "name": "Ammonia, water, unfiltered, field, milligrams per liter as nitrogen",
  },
  {
      "id": "99124",
      "Group": "Nutrient",
      "name": "Nitrate, water, unfiltered, field, milligrams per liter as nitrogen",
  },
  {
      "id": "99133",
      "Group": "Nutrient",
      "name": "Nitrate plus nitrite, water, in situ, milligrams per liter as nitrogen",
  },
  {
      "id": "99134",
      "Group": "Organics, Other",
      "name": "Dissolved organic carbon (DOC), water, in situ, concentration computed by regression of sensor data with field sample lab results, milligrams per liter as carbon",
  },
  {
      "id": "99135",
      "Group": "Organics, Other",
      "name": "Total organic carbon, water, in situ, estimated, milligrams per liter",
  },
  {
      "id": "99136",
      "Group": "Nutrient",
      "name": "Nitrate, water, in situ, micromoles per liter",
  },
  {
      "id": "99137",
      "Group": "Nutrient",
      "name": "Nitrate, water, in situ, milligrams per liter as nitrogen",
  },
  {
      "id": "99139",
      "Group": "Nutrient",
      "name": "Molar ratio of nitrate (plus nitrite) and orthophosphate",
  },
  {
      "id": "99220",
      "Group": "Inorganics, Major, Non-metals",
      "name": "Chloride, water, unfiltered, milligrams per liter",
  },
  {
      "id": "99229",
      "Group": "Information",
      "name": "Temperature #1, Aquatrak, air temperature of the upper sounding well, degrees Celsius",
  },
  {
      "id": "99230",
      "Group": "Information",
      "name": "Temperature #2, Aquatrak, air temperature of the bottom sounding well, degrees Celsius",
  },
  {
      "id": "99232",
      "Group": "Physical",
      "name": "Volumetric soil moisture content period, for internal control of sensor, milliseconds",
  },
  {
      "id": "99233",
      "Group": "Information",
      "name": "Dissolved oxygen charge, membrane DO sensor performance, number",
  },
  {
      "id": "99234",
      "Group": "Information",
      "name": "Count of samples collected by autosampler, number",
  },
  {
      "id": "99235",
      "Group": "Information",
      "name": "Status of equipment alarm, codes specified in data descriptor",
  },
  {
      "id": "99236",
      "Group": "Information",
      "name": "Index of water-quality deviation from established baseline, number",
  },
  {
      "id": "99237",
      "Group": "Information",
      "name": "Acoustic Doppler Velocity Meter signal to noise ratio",
  },
  {
      "id": "99238",
      "Group": "Information",
      "name": "Location of Acoustic Doppler Velocity Meter cell end, feet",
  },
  {
      "id": "99239",
      "Group": "Information",
      "name": "Acoustic Doppler Velocity Meter standard deviation, data element specified in data descriptor",
  },
  {
      "id": "99240",
      "Group": "Information",
      "name": "Acoustic Doppler Velocity Meter standard error of velocity, feet per second",
  },
  {
      "id": "99241",
      "Group": "Information",
      "name": "Location of Acoustic Doppler Velocity Meter cell end, meters",
  },
  {
      "id": "99242",
      "Group": "Information",
      "name": "Acoustic Doppler Velocity Meter standard error of velocity, centimeters per second",
  },
  {
      "id": "99243",
      "Group": "Physical",
      "name": "Distance to snow surface from sensor, centimeters",
  },
  {
      "id": "99246",
      "Group": "Information",
      "name": "Upper 90 percent prediction limit for SSC by regression (PCODE 99409), milligrams per liter",
  },
  {
      "id": "99247",
      "Group": "Information",
      "name": "Lower 90 percent prediction limit for SSC by regression (PCODE 99409), milligrams per liter",
  },
  {
      "id": "99260",
      "Group": "Information",
      "name": "Sample event, sampler is actively collecting a sample (1), code",
  },
  {
      "id": "99263",
      "Group": "Information",
      "name": "Voltage ratio, voltage of transmitted electromagnetic pulse divided by the voltage of the returned pulse",
  },
  {
      "id": "99264",
      "Group": "Information",
      "name": "Rate of change, feet per hour",
  },
  {
      "id": "99265",
      "Group": "Information",
      "name": "Pavement surface condition, code",
  },
  {
      "id": "99266",
      "Group": "Information",
      "name": "Pavement friction, code",
  },
  {
      "id": "99267",
      "Group": "Information",
      "name": "Sensor lens condition, code",
  },
  {
      "id": "99268",
      "Group": "Information",
      "name": "Depth of sensor below water surface, not corrected for barometric pressure variations, feet",
  },
  {
      "id": "99269",
      "Group": "Information",
      "name": "Depth of sensor below water surface, not corrected for barometric pressure variations, meters",
  },
  {
      "id": "99398",
      "Group": "Inorganics, Major, Metals",
      "name": "Sodium, water, filtered, estimated by regression equation, milligrams per liter",
  },
  {
      "id": "99399",
      "Group": "Inorganics, Major, Metals",
      "name": "Calcium, water, filtered, estimated by regression equation, milligrams per liter",
  },
  {
      "id": "99401",
      "Group": "Physical",
      "name": "Dissolved solids, water, filtered, estimated by regression equation, milligrams per liter",
  },
  {
      "id": "99404",
      "Group": "Inorganics, Major, Non-metals",
      "name": "Chloride, water, filtered, estimated by regression equation, milligrams per liter",
  },
  {
      "id": "99409",
      "Group": "Sediment",
      "name": "Suspended sediment concentration, water, unfiltered, estimated by regression equation, milligrams per liter",
  },
  {
      "id": "99410",
      "Group": "Nutrient",
      "name": "Total nitrogen [nitrate + nitrite + ammonia + organic-N], water, filtered, estimated by regression equation, milligrams per liter as nitrogen",
  },
  {
      "id": "99772",
      "Group": "Physical",
      "name": "Precipitation, millimeters",
  },
  {
      "id": "99968",
      "Group": "Information",
      "name": "Acoustic signal strength, units specified in data descriptor",
  },
  {
      "id": "99969",
      "Group": "Information",
      "name": "Instrument orientation, degrees clockwise from true north",
  },
  {
      "id": "99970",
      "Group": "Information",
      "name": "Instrument pitch (front to back movement), units specified in data descriptor",
  },
  {
      "id": "99971",
      "Group": "Information",
      "name": "Instrument roll (side to side movement), units specified in data descriptor",
  },
  {
      "id": "99986",
      "Group": "Physical",
      "name": "Solar radiation (average flux density on a horizontal surface during measurement interval), watts per square meter",
  },
  {
      "id": "99987",
      "Group": "Physical",
      "name": "Solar radiation (total flux density on a horizontal surface during measurement interval), megajoules per square meter",
  },
  {
      "id": "99988",
      "Group": "Physical",
      "name": "Photosynthetically active radiation (average flux density on a horizontal surface during measurement interval), micromoles of photons per square meter per second",
  },
  {
      "id": "99989",
      "Group": "Physical",
      "name": "Photosynthetically active radiation (total flux density on a horizontal surface during measurement interval), millimoles of photons per square meter",
  }
]

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


fs.writeFile("./src/fetchedValues/paramTypes.json", JSON.stringify(IVParams), function(err) {
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


