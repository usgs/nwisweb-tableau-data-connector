const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const parse = require('csv-parse/lib/sync');
const fs = require('fs');

const rdbToJSON = (rdb) => {
  let lines = rdb.split("\n");
  lines.splice(0,7);
  lines.splice(1,1); // quick way to remove unnecesarry lines to make the rdb readable as rdb
  rdb =  lines.join("\n");
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
  get("https://help.waterdata.usgs.gov/code/site_tp_query?fmt=rdb"),
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
let IVParams = [
  {
    "Group": "Water Level/Flow",
    "id": "72019",
    "name": "Depth to water level, ft below land surface"
  },
  {
    "Group": "Water Level/Flow",
    "id": "70227",
    "name": "Direction of stream flow, magnetic azimuth, degrees"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72243",
    "name": "Discharge, ft³/day"
  },
  {
    "Group": "Water Level/Flow",
    "id": "30208",
    "name": "Discharge, m³/s"
  },
  {
    "Group": "Water Level/Flow",
    "id": "00061",
    "name": "Discharge, instantaneous, ft³/s"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72272",
    "name": "Discharge, cumulative, acre-feet"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72020",
    "name": "Elevation above NGVD 1929, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "99020",
    "name": "Elevation above NGVD 1929, m"
  },
  {
    "Group": "Water Level/Flow",
    "id": "30211",
    "name": "Elevation above NGVD 1929, m"
  },
  {
    "Group": "Water Level/Flow",
    "id": "00062",
    "name": "Elevation of reservoir water surface above datum, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72277",
    "name": "Datum offset, elevation of water leveling point in reference to established datum, feet"
  },
  {
    "Group": "Water Level/Flow",
    "id": "99064",
    "name": "Water surface elevation difference between two locations,ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "99067",
    "name": "Difference between observed and predicted water surface elevation, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "50051",
    "name": "Flow rate, instantaneous, Mgal/d"
  },
  {
    "Group": "Water Level/Flow",
    "id": "00059",
    "name": "Flow rate, instantaneous, gal/min"
  },
  {
    "Group": "Water Level/Flow",
    "id": "00058",
    "name": "Flow rate of well, gal/min"
  },
  {
    "Group": "Water Level/Flow",
    "id": "50052",
    "name": "Flow total during composite period, thousands of gallons"
  },
  {
    "Group": "Water Level/Flow",
    "id": "99065",
    "name": "Gage height, above datum, m"
  },
  {
    "Group": "Water Level/Flow",
    "id": "30207",
    "name": "Gage height, above datum, meters"
  },
  {
    "Group": "Water Level/Flow",
    "id": "00065",
    "name": "Gage height, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "62610",
    "name": "Groundwater level above NGVD 1929, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "62611",
    "name": "Groundwater level above NAVD 1988, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72150",
    "name": "Groundwater level relative to Mean Sea Level (MSL), ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72228",
    "name": "Groundwater level above Guam Vertical Datum of 1963 (retired in 2003), ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72229",
    "name": "Groundwater level above Guam Vertical Datum of 2004, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72230",
    "name": "Groundwater level above Local Hawaiian Datum, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72231",
    "name": "Groundwater level above Northern Marianas Vertical Datum of 2003, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72226",
    "name": "Groundwater level above American Samoa Datum of 1962 (retired in 2001), ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72227",
    "name": "Groundwater level above American Samoa Vertical Datum of 2002, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "62600",
    "name": "Water level elevation above NGVD 1929, corrected for barometric pressure, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72292",
    "name": "Water level elevation above NAVD 1988, corrected for barometric pressure, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72293",
    "name": "Water level elevation above gage datum, corrected for barometric pressure, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "62615",
    "name": "Lake or reservoir water surface elevation above NAVD 1988, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "62614",
    "name": "Lake or reservoir water surface elevation above NGVD 1929, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "62616",
    "name": "Lake or reservoir water surface elevation above NGVD 1929, m"
  },
  {
    "Group": "Water Level/Flow",
    "id": "62617",
    "name": "Lake or reservoir water surface elevation above NAVD 1988, m"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72214",
    "name": "Lake or reservoir elevation above International Great Lakes Datum (IGLD), ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72264",
    "name": "Lake or reservoir elevation above New York State Barge Canal Datum (NYBCD), ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72275",
    "name": "Lake or reservoir elevation above United States Bureau of Reclamation Klamath Basin (USBRKB) Datum, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72250",
    "name": "Physical Marsh mat (floating vegetation) elevation above NAVD 1988, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72251",
    "name": "Physical Water level above marsh, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "00064",
    "name": "Mean depth of stream, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72024",
    "name": "Pond storage, gal"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72120",
    "name": "Reservoir storage, total pool, percent of capacity"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72121",
    "name": "Reservoir storage, live pool, percent of capacity"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72022",
    "name": "Reservoir storage, Mgal"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72023",
    "name": "Reservoir storage, million cubic feet"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72036",
    "name": "Reservoir storage, thousand acre feet"
  },
  {
    "Group": "Water Level/Flow",
    "id": "00054",
    "name": "Reservoir storage, acre-ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "00072",
    "name": "Stream stage, m"
  },
  {
    "Group": "Water Level/Flow",
    "id": "00055",
    "name": "Stream velocity, ft/s"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72321",
    "name": "Stream velocity, mph"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72322",
    "name": "Surface velocity at point in stream, ft/s"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72254",
    "name": "Mean Stream velocity from field sensor, ft/s"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72255",
    "name": "Mean Stream velocity, ft/s"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72149",
    "name": "Stream velocity, m/s"
  },
  {
    "Group": "Water Level/Flow",
    "id": "63160",
    "name": "Stream water level elevation above NAVD 1988, in ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "63158",
    "name": "Stream water level elevation above NGVD 1929, in ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "00060",
    "name": "Streamflow, ft³/s"
  },
  {
    "Group": "Water Level/Flow",
    "id": "71270",
    "name": "Stage, tidally filtered, above datum, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72137",
    "name": "Streamflow, tidally filtered, ft³/s"
  },
  {
    "Group": "Water Level/Flow",
    "id": "50042",
    "name": "Streamflow, gal/min"
  },
  {
    "Group": "Water Level/Flow",
    "id": "99060",
    "name": "Streamflow, m³/s"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72274",
    "name": "Scour hole bottom elevation above NGVD 1929, feet"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72279",
    "name": "Tidal elevation, NOS-averaged, NAVD88, feet"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72276",
    "name": "Tidal water level, NOS-averaged, distance from measuring point to water surface, feet"
  },
  {
    "Group": "Water Level/Flow",
    "id": "00067",
    "name": "Tide Stage, code"
  },
  {
    "Group": "Water Level/Flow",
    "id": "62623",
    "name": "Tide stage, above datum, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "62620",
    "name": "Estuary or ocean water surface elevation above NAVD 1988, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "62619",
    "name": "Estuary or ocean water surface elevation above NGVD 1929, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "81904",
    "name": "Velocity at point in stream, ft/s"
  },
  {
    "Group": "Water Level/Flow",
    "id": "61055",
    "name": "Water level, depth below measuring point, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72294",
    "name": "Mean water velocity for discharge computation, mph"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72327",
    "name": "Flow total during composite period, ft³"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72328",
    "name": "Runoff total during flow event, ft³"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72329",
    "name": "Pavement surface temperature, °C"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72330",
    "name": "Streambed elevation at measurement point, NAVD88, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72331",
    "name": "Reach-averaged stream width derived from satellite imagery, m"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72332",
    "name": "Reach water-surface slope derived from satellite altimetry data"
  },
  {
    "Group": "Water Level/Flow",
    "id": "72333",
    "name": "Reach averaged water-surface elevation derived from satellite altimetry data, m"
  },
  {
    "Group": "Water Level/Flow",
    "id": "99268",
    "name": "Depth of sensor below water surface, not corrected for barometric pressure variations, ft"
  },
  {
    "Group": "Water Level/Flow",
    "id": "99269",
    "name": "Depth of sensor below water surface, not corrected for barometric pressure variations, m"
  },
  {
    "Group": "Water Quality",
    "id": "63518",
    "name": "Acifluorfen, water, filtered, recoverable, µg/L"
  },
  {
    "Group": "Water Quality",
    "id": "00625",
    "name": "Ammonia plus organic nitrogen, water, unfiltered, mg/L as N"
  },
  {
    "Group": "Water Quality",
    "id": "91057",
    "name": "Ammonia plus organic nitrogen, water, unfiltered, pounds of nitrogen per day"
  },
  {
    "Group": "Water Quality",
    "id": "62961",
    "name": "Ammonia, water, dissolved, pounds per day as nitrogen"
  },
  {
    "Group": "Water Quality",
    "id": "00608",
    "name": "Ammonia, water, filtered, mg/L as N"
  },
  {
    "Group": "Water Quality",
    "id": "91048",
    "name": "Ammonia, water, unfiltered, pounds of nitrogen per day"
  },
  {
    "Group": "Water Quality",
    "id": "99123",
    "name": "Ammonia, water, unfiltered, field, mg/L as nitrogen"
  },
  {
    "Group": "Water Quality",
    "id": "71845",
    "name": "Ammonia, water, unfiltered, mg/L as NH4"
  },
  {
    "Group": "Water Quality",
    "id": "00915",
    "name": "Calcium, water, filtered, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "99399",
    "name": "Calcium, water, filtered, estimated by regression equation, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "72240",
    "name": "Carbon dioxide, water, dissolved, at the water surface, ppm by volume of dissolved gases"
  },
  {
    "Group": "Water Quality",
    "id": "70290",
    "name": "Chloride, water, dissolved, tons per day"
  },
  {
    "Group": "Water Quality",
    "id": "99404",
    "name": "Chloride, water, filtered, estimated by regression equation, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "00940",
    "name": "Chloride, water, filtered, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "99220",
    "name": "Chloride, water, unfiltered, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "50060",
    "name": "Chlorine (total residual), water, unfiltered, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "32314",
    "name": "Colored dissolved organic matter, water, filtered, field, single band excitation, fluorescence emission, ppb QSE"
  },
  {
    "Group": "Water Quality",
    "id": "32322",
    "name": "Colored dissolved organic matter (CDOM), water, in situ, fluorometric method, relative fluorescence units (RFU)"
  },
  {
    "Group": "Water Quality",
    "id": "32330",
    "name": "Colored dissolved organic matter fluorescence (fDOM), water, in situ, mg/l of carbon"
  },
  {
    "Group": "Water Quality",
    "id": "32315",
    "name": "Chlorophyll a, estimated, water, in-situ, in-vivo fluorescence, RFU"
  },
  {
    "Group": "Water Quality",
    "id": "32316",
    "name": "Chlorophyll a, estimated, water, in-situ, in-vivo fluorescence, concentration estimated from reference material, µg/L"
  },
  {
    "Group": "Water Quality",
    "id": "32317",
    "name": "Chlorophyll a, modeled, water, in-situ, in-vivo fluorescence, concentration modeled from field samples analyzed by extraction, µg/L"
  },
  {
    "Group": "Water Quality",
    "id": "32209",
    "name": "Chlorophyll a, fluorometric method, corrected, water, µg/L"
  },
  {
    "Group": "Water Quality",
    "id": "70953",
    "name": "Chlorophyll a, phytoplankton, chromatographic-fluorometric method, µg/L"
  },
  {
    "Group": "Water Quality",
    "id": "32210",
    "name": "Chlorophyll a, water, unfiltered, trichromatic method, uncorrected, µg/L"
  },
  {
    "Group": "Water Quality",
    "id": "65231",
    "name": "Chlorophyll a, water, in situ, in vivo fluorescence,µg/L"
  },
  {
    "Group": "Water Quality",
    "id": "32234",
    "name": "Chlorophyll, total, phytoplankton, spectrophotometric method, uncorrected, µg/L"
  },
  {
    "Group": "Water Quality",
    "id": "62361",
    "name": "Chlorophyll, total, water, fluorometric, 650-700 nanometers, in-situ sensor, µg/L"
  },
  {
    "Group": "Water Quality",
    "id": "32283",
    "name": "Chlorophyll, total, water, in situ, fluorometric, 650-700 nanometers, relative fluorescence units (RFU)"
  },
  {
    "Group": "Water Quality",
    "id": "32284",
    "name": "Chlorophyll a, total, in situ, fluorescence excitation at 370, 470, 525, 570, 590, 610 nm, fluorescence emission at 700 nm with correction for CDOM, ug/L"
  },
  {
    "Group": "Water Quality",
    "id": "32285",
    "name": "Chlorophyll a, green algae, in situ, fluorescence excitation at 370, 470, 525, 570, 590, 610 nm, fluorescence emission at 700 nm with correction for CDOM, ug/L"
  },
  {
    "Group": "Water Quality",
    "id": "32286",
    "name": "Chlorophyll a, cyanobacteria, in situ, fluorescence excitation at 370, 470, 525, 570, 590, 610 nm, fluorescence emission at 700 nm with correction for CDOM, ug/L"
  },
  {
    "Group": "Water Quality",
    "id": "32287",
    "name": "Chlorophyll a, cryptophytes, in situ, fluorescence excitation at 370, 470, 525, 570, 590, 610 nm, fluorescence emission at 700 nm with correction for CDOM, ug/L"
  },
  {
    "Group": "Water Quality",
    "id": "32288",
    "name": "Chlorophyll a, diatoms and dinoflagellates, in situ, excitation at 370, 470, 525, 570, 590, 610 nm, fluorescence emission at 700 nm with correction for CDOM, ug/L"
  },
  {
    "Group": "Water Quality",
    "id": "32318",
    "name": "Chlorophylls, water, in situ, fluorometric method, excitation at 470 +-15 nm, emission at 685 +-20 nm, ug/L"
  },
  {
    "Group": "Water Quality",
    "id": "32320",
    "name": "Chlorophylls, water, in situ, fluorometric method, excitation at 470 +-15 nm, emission at 685 +-20 nm, relative fluorescence units, RFU"
  },
  {
    "Group": "Water Quality",
    "id": "32289",
    "name": "Colored dissolved organic matter (CDOM), in situ, fluorescence excitation at 370, 470, 525, 570, 590, 610 nm, fluorescence emission at 700 nm, mg/liter"
  },
  {
    "Group": "Water Quality",
    "id": "32295",
    "name": "Colored dissolved organic matter (CDOM), water, in situ, single band excitation, fluorescence emission, ppb QSE"
  },
  {
    "Group": "Water Quality",
    "id": "95204",
    "name": "Cyanobacteria (blue-green algae), water, in situ, phycocyanin, IVF (IVFU)"
  },
  {
    "Group": "Water Quality",
    "id": "99134",
    "name": "Dissolved organic carbon, water, in situ, estimated, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "99135",
    "name": "Total organic carbon, water, in situ, estimated, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "00301",
    "name": "Dissolved oxygen, water, unfiltered, %saturation"
  },
  {
    "Group": "Water Quality",
    "id": "00300",
    "name": "Dissolved oxygen, water, unfiltered, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "72106",
    "name": "Elevation of sample, ft"
  },
  {
    "Group": "Water Quality",
    "id": "00950",
    "name": "Fluoride, water, filtered, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "32290",
    "name": "Fluorescence transmission (transparency to fluorescence) at 700 nm, percent"
  },
  {
    "Group": "Water Quality",
    "id": "01046",
    "name": "Iron, water, filtered, µg/L"
  },
  {
    "Group": "Water Quality",
    "id": "99099",
    "name": "Manganese, water, unfiltered, computed by regression of sensor data with field sample lab results, µg/L"
  },
  {
    "Group": "Water Quality",
    "id": "00925",
    "name": "Magnesium, water, filtered, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "71900",
    "name": "Mercury, water, unfiltered, recoverable, µg/L"
  },
  {
    "Group": "Water Quality",
    "id": "99139",
    "name": "Molar ratio of nitrate (plus nitrite) and orthophosphate"
  },
  {
    "Group": "Water Quality",
    "id": "83554",
    "name": "Nitrate plus nitrite, water, total, tons per day as nitrogen"
  },
  {
    "Group": "Water Quality",
    "id": "91049",
    "name": "Nitrate plus nitrite, water, unfiltered, pounds of nitrogen per day"
  },
  {
    "Group": "Water Quality",
    "id": "00618",
    "name": "Nitrate, water, filtered, mg/L as N"
  },
  {
    "Group": "Water Quality",
    "id": "51185",
    "name": "Nitrate, water, unfiltered, field, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "99124",
    "name": "Nitrate, water, unfiltered, field, mg/L as N"
  },
  {
    "Group": "Water Quality",
    "id": "71850",
    "name": "Nitrate, water, unfiltered, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "00620",
    "name": "Nitrate, water, unfiltered, mg/L as N"
  },
  {
    "Group": "Water Quality",
    "id": "91061",
    "name": "Nitrite plus nitrate, water, dissolved, lb/d as N"
  },
  {
    "Group": "Water Quality",
    "id": "00631",
    "name": "Nitrite plus nitrate, water, filtered, mg/L as N"
  },
  {
    "Group": "Water Quality",
    "id": "99133",
    "name": "Nitrate plus nitrite, water, in situ, mg/L as N"
  },
  {
    "Group": "Water Quality",
    "id": "00630",
    "name": "Nitrite plus nitrate, water, unfiltered, mg/L as N"
  },
  {
    "Group": "Water Quality",
    "id": "99136",
    "name": "Nitrite, water, in situ, µmol/L"
  },
  {
    "Group": "Water Quality",
    "id": "99137",
    "name": "Nitrite, water, in situ, mg/L as N"
  },
  {
    "Group": "Water Quality",
    "id": "51186",
    "name": "Inorganic nitrogen, water, dissolved, calculated as NH3+NO2+NO3, mg/L as N"
  },
  {
    "Group": "Water Quality",
    "id": "51187",
    "name": "Inorganic nitrogen, water, dissolved, calculated as NH3+NO2+NO3, tons/day as N"
  },
  {
    "Group": "Water Quality",
    "id": "00680",
    "name": "Organic carbon, water, unfiltered, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "91047",
    "name": "Organic nitrogen, water, unfiltered, pounds of nitrogen per day"
  },
  {
    "Group": "Water Quality",
    "id": "70507",
    "name": "Orthophosphate, water, unfiltered, mg/L as phosphorus"
  },
  {
    "Group": "Water Quality",
    "id": "83555",
    "name": "Orthophosphate, water, dissolved, pounds of phosphorus per day"
  },
  {
    "Group": "Water Quality",
    "id": "91060",
    "name": "Orthophosphate, water, dissolved, pounds per day"
  },
  {
    "Group": "Water Quality",
    "id": "91059",
    "name": "Orthophosphate, water, unfiltered, pounds per day"
  },
  {
    "Group": "Water Quality",
    "id": "99122",
    "name": "Orthophosphate, water, filtered, field, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "00671",
    "name": "Orthophosphate, water, filtered, mg/L as phosphorus"
  },
  {
    "Group": "Water Quality",
    "id": "51289",
    "name": "Orthophosphate, water, in situ, mg/L as phosphorus"
  },
  {
    "Group": "Water Quality",
    "id": "00090",
    "name": "Oxidation reduction potential, mV"
  },
  {
    "Group": "Water Quality",
    "id": "04116",
    "name": "PCBs, water, unfiltered, recoverable, grams per day"
  },
  {
    "Group": "Water Quality",
    "id": "00400",
    "name": "pH, water, unfiltered, field, standard units"
  },
  {
    "Group": "Water Quality",
    "id": "00403",
    "name": "pH, water, unfiltered, laboratory, standard units"
  },
  {
    "Group": "Water Quality",
    "id": "00650",
    "name": "Phosphate, water, unfiltered, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "81206",
    "name": "Phosphorus, water, dissolved, pounds per day"
  },
  {
    "Group": "Water Quality",
    "id": "00665",
    "name": "Phosphorus, water, unfiltered, mg/L as phosphorus"
  },
  {
    "Group": "Water Quality",
    "id": "91007",
    "name": "Phosphorus, water, unfiltered, short tons of phosphorus per day"
  },
  {
    "Group": "Water Quality",
    "id": "91050",
    "name": "Phosphorus, water, unfiltered, pounds per day"
  },
  {
    "Group": "Water Quality",
    "id": "32319",
    "name": "Phycocyanins (cyanobacteria), water, in situ, fluorometric method, excitation at 590 +-15 nm, emission at 685 +-20 nm, micrograms per liter,ug/l"
  },
  {
    "Group": "Water Quality",
    "id": "32321",
    "name": "Phycocyanins (cyanobacteria), water, in situ, fluorometric method, excitation at 590 +-15 nm, emission at 685 +-20 nm, relative fluorescence units, RFU"
  },
  {
    "Group": "Water Quality",
    "id": "32323",
    "name": "Phycoerythrin fluorescence (fPE), water, in situ, relative fluorescence units (RFU), RFU"
  },
  {
    "Group": "Water Quality",
    "id": "99401",
    "name": "Residue, dissolved, water, filtered, estimated by regression equation, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "00530",
    "name": "Residue, total nonfilterable, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "70302",
    "name": "Residue, water, dissolved, tons per day"
  },
  {
    "Group": "Water Quality",
    "id": "70301",
    "name": "Residue, water, filtered, sum of constituents, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "07084",
    "name": "Rhodamine WT, water, unfiltered, recoverable, µg/L"
  },
  {
    "Group": "Water Quality",
    "id": "00096",
    "name": "Salinity, water, unfiltered, mg/mL at 25 °C"
  },
  {
    "Group": "Water Quality",
    "id": "00480",
    "name": "Salinity, water, unfiltered, parts per thousand"
  },
  {
    "Group": "Water Quality",
    "id": "90860",
    "name": "Salinity, water, unfiltered, practical salinity units at 25 °C"
  },
  {
    "Group": "Water Quality",
    "id": "00931",
    "name": "Sodium adsorption ratio, water, number"
  },
  {
    "Group": "Water Quality",
    "id": "90856",
    "name": "Sodium adsorption ratio, water, unfiltered, estimated by regression equation, number"
  },
  {
    "Group": "Water Quality",
    "id": "00930",
    "name": "Sodium, water, filtered, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "99398",
    "name": "Sodium, water, filtered, estimated by regression equation, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "81203",
    "name": "Sodium, water, filtered, tons/d"
  },
  {
    "Group": "Water Quality",
    "id": "00095",
    "name": "Specific conductance, water, unfiltered, µS/cm at 25 °C"
  },
  {
    "Group": "Water Quality",
    "id": "90095",
    "name": "Specific conductance, water, unfiltered, laboratory, µS/cm at 25 °C"
  },
  {
    "Group": "Water Quality",
    "id": "00402",
    "name": "Specific conductance, non-temperature corrected, water, unfiltered, µS/cm"
  },
  {
    "Group": "Water Quality",
    "id": "80154",
    "name": "Suspended sediment concentration, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "80180",
    "name": "Total sediment concentration, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "99409",
    "name": "Suspended sediment concentration, water, unfiltered, estimated by regression equation, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "80225",
    "name": "Bedload sediment discharge, tons/d"
  },
  {
    "Group": "Water Quality",
    "id": "80155",
    "name": "Suspended sediment discharge, tons/d"
  },
  {
    "Group": "Water Quality",
    "id": "80295",
    "name": "Suspended sediment load, water, unfiltered, estimated by regression equation, lbs/sec"
  },
  {
    "Group": "Water Quality",
    "id": "80297",
    "name": "Suspended sediment load, water, unfiltered, computed, the product of regression-computed suspended sediment concentration and streamflow, tons/d"
  },
  {
    "Group": "Water Quality",
    "id": "91055",
    "name": "Suspended solids, dried at 105 degrees Celsius, water, unfiltered, tons/d"
  },
  {
    "Group": "Water Quality",
    "id": "91058",
    "name": "Total nitrogen, water, unfiltered, pounds per day"
  },
  {
    "Group": "Water Quality",
    "id": "80156",
    "name": "Total sediment discharge, tons/d"
  },
  {
    "Group": "Water Quality",
    "id": "00010",
    "name": "Temperature, water, °C"
  },
  {
    "Group": "Water Quality",
    "id": "00011",
    "name": "Temperature, water, °F"
  },
  {
    "Group": "Water Quality",
    "id": "00600",
    "name": "Total nitrogen, water, unfiltered, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "99410",
    "name": "Total nitrogen [nitrate + nitrite + ammonia + organic-N], water, filtered, estimated by regression equation, mg/L"
  },
  {
    "Group": "Water Quality",
    "id": "00047",
    "name": "Total partial pressure of dissolved gases, water, unfiltered, mmHg"
  },
  {
    "Group": "Water Quality",
    "id": "00048",
    "name": "Total partial pressure of dissolved gases, water, unfiltered, percent of saturation"
  },
  {
    "Group": "Water Quality",
    "id": "63675",
    "name": "Turbidity, water, unfiltered, broad band light source (400-680 nm), detection angle 90 +/- 30 degrees to incident light, nephelometric turbidity units (NTU)"
  },
  {
    "Group": "Water Quality",
    "id": "63680",
    "name": "Turbidity, water, unfiltered, monochrome near infra-red LED light, 780-900 nm, detection angle 90 +/-2.5 degrees, FNU"
  },
  {
    "Group": "Water Quality",
    "id": "72213",
    "name": "Turbidity, water, unfiltered, monochrome near infra-red LED light, 780-900 nm, detector angles at 90 +/- 2.5 degrees and 30 +/- 15 degrees, ratiometric, FBRU"
  },
  {
    "Group": "Water Quality",
    "id": "00070",
    "name": "Turbidity, water, unfiltered, Jackson Turbidity Units"
  },
  {
    "Group": "Water Quality",
    "id": "00076",
    "name": "Turbidity, water, unfiltered, NTU"
  },
  {
    "Group": "Water Quality",
    "id": "61028",
    "name": "Turbidity, water, unfiltered, field, NTU"
  },
  {
    "Group": "Water Quality",
    "id": "63681",
    "name": "Turbidity, water, unfiltered, monochrome near infra-red LED light source, 780-900 nm, detectors at multiple angles including 90 +-2.5 degrees, ratiometric correction, FNRU"
  },
  {
    "Group": "Water Quality",
    "id": "63682",
    "name": "Turbidity, water, unfiltered, monochrome near infra-red LED light source, 780-900 nm, detection angle 0 degrees to incident light (backscatter), FBU"
  },
  {
    "Group": "Water Quality",
    "id": "63684",
    "name": "Turbidity, water, unfiltered, monochrome near infra-red LED light source, 780-900 nm, multiple beam, detectors at multiple angles including 90 degrees, FNMU"
  },
  {
    "Group": "Water Quality",
    "id": "99111",
    "name": "Type of quality assurance data associated with sample, code"
  },
  {
    "Group": "Water Quality",
    "id": "71994",
    "name": "Volume of water filtered, L"
  },
  {
    "Group": "Meteorological",
    "id": "00025",
    "name": "Barometric pressure, mmHg"
  },
  {
    "Group": "Meteorological",
    "id": "75969",
    "name": "Barometric pressure, not corrected to sea level, mbar"
  },
  {
    "Group": "Meteorological",
    "id": "62607",
    "name": "Barometric pressure, uncorrected, kPa"
  },
  {
    "Group": "Meteorological",
    "id": "62603",
    "name": "Barometric pressure, uncorrected, inHg"
  },
  {
    "Group": "Meteorological",
    "id": "00030",
    "name": "Incident solar radiation intensity, (cal/cm²)/d"
  },
  {
    "Group": "Meteorological",
    "id": "72124",
    "name": "Net radiation (net solar + net long wave radiation), watts per square meter"
  },
  {
    "Group": "Meteorological",
    "id": "62609",
    "name": "Net solar radiation, W/m²"
  },
  {
    "Group": "Meteorological",
    "id": "99988",
    "name": "Photosynthetically active radiation (average flux density on a horizontal surface during measurement interval), µmol of photons/m²/s"
  },
  {
    "Group": "Meteorological",
    "id": "99989",
    "name": "Photosynthetically active radiation (total flux density on a horizontal surface during measurement interval), µmol of photons/m²/s"
  },
  {
    "Group": "Meteorological",
    "id": "00129",
    "name": "Precipitation, intensity at given time, location 1, inches per hour"
  },
  {
    "Group": "Meteorological",
    "id": "72291",
    "name": "Precipitation, intensity at given time, inches per minute"
  },
  {
    "Group": "Meteorological",
    "id": "72192",
    "name": "Precipitation, cumulative, inches"
  },
  {
    "Group": "Meteorological",
    "id": "00193",
    "name": "Precipitation total for defined period, in"
  },
  {
    "Group": "Meteorological",
    "id": "00117",
    "name": "Precipitation, duration of storm event, minutes"
  },
  {
    "Group": "Meteorological",
    "id": "46529",
    "name": "Precipitation, in"
  },
  {
    "Group": "Meteorological",
    "id": "99772",
    "name": "Precipitation, mm"
  },
  {
    "Group": "Meteorological",
    "id": "00045",
    "name": "Precipitation, total, in"
  },
  {
    "Group": "Meteorological",
    "id": "00052",
    "name": "Relative humidity, percent"
  },
  {
    "Group": "Meteorological",
    "id": "72252",
    "name": "Physical Solar radiation (average flux density on a horizontal surface during measurement interval), kilowatts/m²"
  },
  {
    "Group": "Meteorological",
    "id": "99986",
    "name": "Solar radiation, (average flux density on a horizontal surface during measurement interval), W/m²"
  },
  {
    "Group": "Meteorological",
    "id": "99987",
    "name": "Solar radiation, (total flux density on a horizontal surface during measurement interval), megajoules/m²"
  },
  {
    "Group": "Meteorological",
    "id": "46515",
    "name": "Solar radiation, downward intensity, (cal/cm²)/min"
  },
  {
    "Group": "Meteorological",
    "id": "46516",
    "name": "Solar radiation, net, (cal/cm²)/min"
  },
  {
    "Group": "Meteorological",
    "id": "72198",
    "name": "Snow depth, feet"
  },
  {
    "Group": "Meteorological",
    "id": "72189",
    "name": "Snow depth, meters"
  },
  {
    "Group": "Meteorological",
    "id": "00020",
    "name": "Temperature, air, °C"
  },
  {
    "Group": "Meteorological",
    "id": "00021",
    "name": "Temperature, air, °F"
  },
  {
    "Group": "Meteorological",
    "id": "81029",
    "name": "Temperature, snow, °C"
  },
  {
    "Group": "Meteorological",
    "id": "62608",
    "name": "Total solar radiation (direct + diffuse radiation on a horizontal surface), watts/m²"
  },
  {
    "Group": "Meteorological",
    "id": "00036",
    "name": "Wind direction, degrees clockwise from north"
  },
  {
    "Group": "Meteorological",
    "id": "61729",
    "name": "Wind gust direction, air, degrees clockwise from true north"
  },
  {
    "Group": "Meteorological",
    "id": "61727",
    "name": "Wind gust speed, air, kn"
  },
  {
    "Group": "Meteorological",
    "id": "61728",
    "name": "Wind gust speed, air, mph"
  },
  {
    "Group": "Meteorological",
    "id": "82127",
    "name": "Wind speed, kn"
  },
  {
    "Group": "Meteorological",
    "id": "62625",
    "name": "Wind speed, m/s"
  },
  {
    "Group": "Meteorological",
    "id": "00035",
    "name": "Wind speed, mph"
  },
  {
    "Group": "Physical Properties",
    "id": "50624",
    "name": "Absorbance, UV, 254 nm, 1 cm pathlength, water, filtered, units per centimeter"
  },
  {
    "Group": "Physical Properties",
    "id": "32327",
    "name": "Absorbance at 254 nm, water, in situ, absorbance units"
  },
  {
    "Group": "Physical Properties",
    "id": "32328",
    "name": "Absorbance at 350 nm, water, in situ, absorbance units"
  },
  {
    "Group": "Physical Properties",
    "id": "72207",
    "name": "Albedo (ratio of reflected to total incoming solar radiation), ratio"
  },
  {
    "Group": "Physical Properties",
    "id": "00042",
    "name": "Altitude feet above mean sea level"
  },
  {
    "Group": "Physical Properties",
    "id": "72000",
    "name": "Altitude of land surface, ft"
  },
  {
    "Group": "Physical Properties",
    "id": "82632",
    "name": "Area, cross section, square feet"
  },
  {
    "Group": "Physical Properties",
    "id": "72182",
    "name": "Atmospheric water vapor density, g/m³"
  },
  {
    "Group": "Physical Properties",
    "id": "72125",
    "name": "Atmospheric water vapor pressure, calculated, kilopascals"
  },
  {
    "Group": "Physical Properties",
    "id": "62602",
    "name": "Barometric pressure, corrected to sea level, inches of mercury"
  },
  {
    "Group": "Physical Properties",
    "id": "72204",
    "name": "Barometric pressure, uncorrected, pounds per square inch"
  },
  {
    "Group": "Physical Properties",
    "id": "00401",
    "name": "Cations minus anions, water, milliequivalents"
  },
  {
    "Group": "Physical Properties",
    "id": "50012",
    "name": "Compaction, aquifer system, feet"
  },
  {
    "Group": "Physical Properties",
    "id": "70309",
    "name": "Compaction, sediment, feet"
  },
  {
    "Group": "Physical Properties",
    "id": "72259",
    "name": "Dielectric permittivity, soil, in situ"
  },
  {
    "Group": "Physical Properties",
    "id": "50415",
    "name": "Distance, observation point to stream bottom, feet"
  },
  {
    "Group": "Physical Properties",
    "id": "99243",
    "name": "Distance to snow surface from sensor, centimeters"
  },
  {
    "Group": "Physical Properties",
    "id": "72001",
    "name": "Depth of hole, ft below land surface datum"
  },
  {
    "Group": "Physical Properties",
    "id": "81903",
    "name": "Depth to bottom at sample location, feet"
  },
  {
    "Group": "Physical Properties",
    "id": "72205",
    "name": "Bulk electrical conductance, soil, decisiemens per meter"
  },
  {
    "Group": "Physical Properties",
    "id": "32325",
    "name": "Dark measurement spectral average, water, in situ, ultraviolet nitrate analyzer, raw counts"
  },
  {
    "Group": "Physical Properties",
    "id": "70300",
    "name": "Dissolved solids dried at 180 degrees Celsius, water, filtered, mg/l"
  },
  {
    "Group": "Physical Properties",
    "id": "00197",
    "name": "Evaporation, accumulated, inches"
  },
  {
    "Group": "Physical Properties",
    "id": "72200",
    "name": "Evaporation per recording interval, millimeters"
  },
  {
    "Group": "Physical Properties",
    "id": "00050",
    "name": "Evaporation total, inches/day"
  },
  {
    "Group": "Physical Properties",
    "id": "72180",
    "name": "Evapotranspiration, inches"
  },
  {
    "Group": "Physical Properties",
    "id": "72135",
    "name": "Evapotranspiration total, inches/day"
  },
  {
    "Group": "Physical Properties",
    "id": "72159",
    "name": "Evapotranspiration, mm/day"
  },
  {
    "Group": "Physical Properties",
    "id": "72130",
    "name": "Potential evapotranspiration (PET), calculated by Penman method, mm/hr"
  },
  {
    "Group": "Physical Properties",
    "id": "50050",
    "name": "Flow, in conduit or through a treatment plant, Mgal/d"
  },
  {
    "Group": "Physical Properties",
    "id": "45585",
    "name": "Gate opening width, ft"
  },
  {
    "Group": "Physical Properties",
    "id": "45592",
    "name": "Gate opening, height, ft"
  },
  {
    "Group": "Physical Properties",
    "id": "45591",
    "name": "Gate opening, height, m"
  },
  {
    "Group": "Physical Properties",
    "id": "00200",
    "name": "Incident light intensity, 400-700 nanometers, microeinsteins per square meter per second"
  },
  {
    "Group": "Physical Properties",
    "id": "00201",
    "name": "Incident light, daily total, 400-700 nanometers, microeinsteins per square meter"
  },
  {
    "Group": "Physical Properties",
    "id": "32326",
    "name": "Light measurement spectral average, water, in situ, ultraviolet nitrate analyzer, raw counts"
  },
  {
    "Group": "Physical Properties",
    "id": "00009",
    "name": "Location in cross section, distance from left bank looking downstream, feet"
  },
  {
    "Group": "Physical Properties",
    "id": "72216",
    "name": "Location of salt front in river miles upstream from mouth, miles"
  },
  {
    "Group": "Physical Properties",
    "id": "72174",
    "name": "Longwave radiation, upwelling intensity, watts per square meter"
  },
  {
    "Group": "Physical Properties",
    "id": "72175",
    "name": "Longwave radiation, downwelling intensity, watts per square meter"
  },
  {
    "Group": "Physical Properties",
    "id": "00535",
    "name": "Loss on ignition, from nonfilterable residue, mg/L"
  },
  {
    "Group": "Physical Properties",
    "id": "91056",
    "name": "Loss on ignition, from suspended solids, water, unfiltered, tons per day"
  },
  {
    "Group": "Physical Properties",
    "id": "72181",
    "name": "Moisture content, soil, volumetric, fraction of total volume"
  },
  {
    "Group": "Physical Properties",
    "id": "72201",
    "name": "Net incident shortwave radiation, watts per square meter"
  },
  {
    "Group": "Physical Properties",
    "id": "72202",
    "name": "Net incident longwave radiation, watts per square meter"
  },
  {
    "Group": "Physical Properties",
    "id": "81912",
    "name": "Open pressure, pounds per square inch"
  },
  {
    "Group": "Physical Properties",
    "id": "72167",
    "name": "Matric potential or pressure head, cm"
  },
  {
    "Group": "Physical Properties",
    "id": "72004",
    "name": "Pump or flow period prior to sampling, minutes"
  },
  {
    "Group": "Physical Properties",
    "id": "72225",
    "name": "Extinction measurement absorbance, absorbance units per centimeter"
  },
  {
    "Group": "Physical Properties",
    "id": "72224",
    "name": "Extinction reference absorbance, absorbance units per centimeter"
  },
  {
    "Group": "Physical Properties",
    "id": "00540",
    "name": "Residue, fixed nonfilterable, mg/L"
  },
  {
    "Group": "Physical Properties",
    "id": "72185",
    "name": "Shortwave radiation, upward intensity, watts per square meter"
  },
  {
    "Group": "Physical Properties",
    "id": "72186",
    "name": "Shortwave radiation, downward intensity, watts per square meter"
  },
  {
    "Group": "Physical Properties",
    "id": "72223",
    "name": "Soil water matric potential, bars"
  },
  {
    "Group": "Physical Properties",
    "id": "72126",
    "name": "Standard deviation of wind direction, degrees"
  },
  {
    "Group": "Physical Properties",
    "id": "72281",
    "name": "Standard deviation, from NOS-averaged dataset, feet"
  },
  {
    "Group": "Physical Properties",
    "id": "72206",
    "name": "Sublimation from snowpack per recording interval, millimeters"
  },
  {
    "Group": "Physical Properties",
    "id": "00053",
    "name": "Surface area, acres"
  },
  {
    "Group": "Physical Properties",
    "id": "85583",
    "name": "Temperature, intragravel water, °C"
  },
  {
    "Group": "Physical Properties",
    "id": "99229",
    "name": "Temperature #1, Aquatrak, air temperature of the upper sounding well, °C"
  },
  {
    "Group": "Physical Properties",
    "id": "99230",
    "name": "Temperature #2, Aquatrak, air temperature of the bottom sounding well, °C"
  },
  {
    "Group": "Physical Properties",
    "id": "72282",
    "name": "Temperature #1, Aquatrak, air temperature of the upper sounding well, °F"
  },
  {
    "Group": "Physical Properties",
    "id": "72283",
    "name": "Temperature #2, Aquatrak, air temperature of the bottom sounding well, °F"
  },
  {
    "Group": "Physical Properties",
    "id": "32293",
    "name": "UV fluorescence, water, in situ, single band, 370 nm excitation, 470 nm emission, RFU"
  },
  {
    "Group": "Physical Properties",
    "id": "72270",
    "name": "Volume, total during measurement interval, liters"
  },
  {
    "Group": "Physical Properties",
    "id": "99232",
    "name": "Volumetric soil moisture content period, for internal control of sensor, milliseconds"
  },
  {
    "Group": "Physical Properties",
    "id": "72151",
    "name": "Water column pressure, pounds per square inch"
  },
  {
    "Group": "Physical Properties",
    "id": "72199",
    "name": "Water depth, water surface to bottom, feet"
  },
  {
    "Group": "Physical Properties",
    "id": "72178",
    "name": "Water depth, water surface to bottom, meters"
  },
  {
    "Group": "Physical Properties",
    "id": "72284",
    "name": "Mean wave height, meters"
  },
  {
    "Group": "Physical Properties",
    "id": "72285",
    "name": "Mean wave period, seconds"
  },
  {
    "Group": "Physical Properties",
    "id": "72286",
    "name": "Significant wave height, meters"
  },
  {
    "Group": "Physical Properties",
    "id": "72287",
    "name": "Significant wave period, seconds"
  },
  {
    "Group": "Physical Properties",
    "id": "72288",
    "name": "Maximum wave height, meters"
  },
  {
    "Group": "Physical Properties",
    "id": "72172",
    "name": "Wave height, Fourier transformation, feet"
  },
  {
    "Group": "Physical Properties",
    "id": "72173",
    "name": "Wave period, Fourier transformation, seconds"
  },
  {
    "Group": "Physical Properties",
    "id": "99265",
    "name": "Pavement surface condition, code"
  },
  {
    "Group": "Physical Properties",
    "id": "99266",
    "name": "Pavement friction, code"
  },
  {
    "Group": "Physical Properties",
    "id": "99267",
    "name": "Sensor lens condition, code"
  },
  {
    "Group": "Miscellaneous",
    "id": "72295",
    "name": "Acoustic backscatter, collected using an acoustic Doppler meter, corrected for beam spreading and absorption of the acoustic signal due to water properties, dB"
  },
  {
    "Group": "Miscellaneous",
    "id": "72296",
    "name": "Instrument noise level, measured by an acoustic Doppler meter, in counts"
  },
  {
    "Group": "Miscellaneous",
    "id": "72297",
    "name": "Attenuation corrected backscatter, uncalibrated from LISST-ABS instrument, in counts"
  },
  {
    "Group": "Miscellaneous",
    "id": "72298",
    "name": "Bedload transport rate, derived by regression equation, megagrams per day"
  },
  {
    "Group": "Miscellaneous",
    "id": "72299",
    "name": "Bedload transport rate, derived by regression equation, short tons per day"
  },
  {
    "Group": "Miscellaneous",
    "id": "72320",
    "name": "Air gap, feet"
  },
  {
    "Group": "Miscellaneous",
    "id": "31720",
    "name": "Bighead carp (Hypophthalmichthys nobilis), count of tagged fish per hour"
  },
  {
    "Group": "Miscellaneous",
    "id": "31725",
    "name": "Bighead carp (Hypophthalmichthys nobilis), count of unique tagged fish per hour"
  },
  {
    "Group": "Miscellaneous",
    "id": "98232",
    "name": "Blue green algae, YSI flourescence probe, cells/mL"
  },
  {
    "Group": "Miscellaneous",
    "id": "72155",
    "name": "Blocked optical sensor (time within recording interval that optical sensor is blocked), seconds"
  },
  {
    "Group": "Miscellaneous",
    "id": "72258",
    "name": "Coefficient used to adjust discharge, Slope-Q computation"
  },
  {
    "Group": "Miscellaneous",
    "id": "72153",
    "name": "Collector dry exposure (time within recording interval that collector is open but should be closed), seconds"
  },
  {
    "Group": "Miscellaneous",
    "id": "72152",
    "name": "Collector wet exposure (time within recording interval that collector is open when it should be open), seconds"
  },
  {
    "Group": "Miscellaneous",
    "id": "72154",
    "name": "Collector missed exposure (time within recording interval that collector is closed but should be open), seconds"
  },
  {
    "Group": "Miscellaneous",
    "id": "72158",
    "name": "Collector lid cycles in recording interval, number"
  },
  {
    "Group": "Miscellaneous",
    "id": "99234",
    "name": "Count of samples collected by autosampler, number"
  },
  {
    "Group": "Miscellaneous",
    "id": "99260",
    "name": "Sample event, sampler is actively collecting a sample (1), code"
  },
  {
    "Group": "Miscellaneous",
    "id": "95202",
    "name": "Cyanobacteria (blue-green algae), YSI in-vivo fluorescence of phycocyanin, excitation - 595, emission - 650 nm, cells/mL"
  },
  {
    "Group": "Miscellaneous",
    "id": "72156",
    "name": "Datalogger scan time per recording interval, seconds"
  },
  {
    "Group": "Miscellaneous",
    "id": "72147",
    "name": "Depth of sensor below water surface, feet"
  },
  {
    "Group": "Miscellaneous",
    "id": "72148",
    "name": "Depth of sensor below water surface, meters"
  },
  {
    "Group": "Miscellaneous",
    "id": "50294",
    "name": "Diagnostic code, tattler, acoustic velocity meter, number"
  },
  {
    "Group": "Miscellaneous",
    "id": "82072",
    "name": "Dial reading, number"
  },
  {
    "Group": "Miscellaneous",
    "id": "99233",
    "name": "Dissolved oxygen charge, membrane DO sensor performance, number"
  },
  {
    "Group": "Miscellaneous",
    "id": "49956",
    "name": "Distance, observation point to sample location, ft"
  },
  {
    "Group": "Miscellaneous",
    "id": "50292",
    "name": "Gain control, automatic receiver, acoustic velocity meter, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "45700",
    "name": "Gate openings, reservoir, all gates, ft"
  },
  {
    "Group": "Miscellaneous",
    "id": "31722",
    "name": "Hybrid asian carp (Hypophthalmichthys nobliis and Hypophthalmichthys molitrix hybrids), count of tagged fish per hour"
  },
  {
    "Group": "Miscellaneous",
    "id": "31727",
    "name": "Hybrid asian carp (Hypophthalmichthys nobliis and Hypophthalmichthys molitrix hybrids), count of unique tagged fish per hour"
  },
  {
    "Group": "Miscellaneous",
    "id": "99236",
    "name": "Index of water-quality deviation from established baseline, number"
  },
  {
    "Group": "Miscellaneous",
    "id": "62968",
    "name": "Latent heat flux, W/m²"
  },
  {
    "Group": "Miscellaneous",
    "id": "45586",
    "name": "Lockage, count of lock openings, units"
  },
  {
    "Group": "Miscellaneous",
    "id": "74207",
    "name": "Moisture content, soil, volumetric, percent of total volume"
  },
  {
    "Group": "Miscellaneous",
    "id": "46311",
    "name": "Moisture content, soil, dry weight, percent"
  },
  {
    "Group": "Miscellaneous",
    "id": "72280",
    "name": "Number of outliers, data points discarded from NOS-averaged dateset, count"
  },
  {
    "Group": "Miscellaneous",
    "id": "00063",
    "name": "Number of sampling points, count"
  },
  {
    "Group": "Miscellaneous",
    "id": "72157",
    "name": "Optical sensor particle counts within recording interval, number"
  },
  {
    "Group": "Miscellaneous",
    "id": "99264",
    "name": "Rate of change, feet per hour"
  },
  {
    "Group": "Miscellaneous",
    "id": "72166",
    "name": "Raw sensor value, millivolts"
  },
  {
    "Group": "Miscellaneous",
    "id": "70968",
    "name": "Respiration, mg 02/m²/d"
  },
  {
    "Group": "Miscellaneous",
    "id": "00008",
    "name": "Sampling accounting number"
  },
  {
    "Group": "Miscellaneous",
    "id": "72006",
    "name": "Sampling condition, code"
  },
  {
    "Group": "Miscellaneous",
    "id": "00003",
    "name": "Sampling depth, ft"
  },
  {
    "Group": "Miscellaneous",
    "id": "00098",
    "name": "Sampling depth, m"
  },
  {
    "Group": "Miscellaneous",
    "id": "72238",
    "name": "Sediment corrected acoustic backscatter (SCB), decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "62969",
    "name": "Sensible heat flux, W/m²"
  },
  {
    "Group": "Miscellaneous",
    "id": "72278",
    "name": "Sensor offset, water level sensor, feet;"
  },
  {
    "Group": "Miscellaneous",
    "id": "62967",
    "name": "Soil-heat flux, W/m²"
  },
  {
    "Group": "Miscellaneous",
    "id": "31724",
    "name": "Shovelnose sturgeon (Scaphirhynchus platorynchus), count of tagged fish per hour"
  },
  {
    "Group": "Miscellaneous",
    "id": "31729",
    "name": "Shovelnose sturgeon (Scaphirhynchus platorynchus), count of unique tagged fish per hour"
  },
  {
    "Group": "Miscellaneous",
    "id": "31721",
    "name": "Silver carp (Hypophthalmichthys molitrix), count of tagged fish per hour"
  },
  {
    "Group": "Miscellaneous",
    "id": "31726",
    "name": "Silver carp (Hypophthalmichthys molitrix), count of unique tagged fish per hour"
  },
  {
    "Group": "Miscellaneous",
    "id": "30215",
    "name": "Signal, sediment, Markland meter, count"
  },
  {
    "Group": "Miscellaneous",
    "id": "82300",
    "name": "Snow depth, in"
  },
  {
    "Group": "Miscellaneous",
    "id": "72253",
    "name": "Soil temperature, °C"
  },
  {
    "Group": "Miscellaneous",
    "id": "62846",
    "name": "Soil temperature, °F"
  },
  {
    "Group": "Miscellaneous",
    "id": "99235",
    "name": "Status of equipment alarm, units in data descriptor"
  },
  {
    "Group": "Miscellaneous",
    "id": "00134",
    "name": "Storm event serial number"
  },
  {
    "Group": "Miscellaneous",
    "id": "31723",
    "name": "Sum of bighead, silver and hybrid carp, count of tagged fish per hour"
  },
  {
    "Group": "Miscellaneous",
    "id": "31728",
    "name": "Sum of bighead, silver and hybrid carp, count of unique tagged fish per hour"
  },
  {
    "Group": "Miscellaneous",
    "id": "45589",
    "name": "Temperature, internal, within equipment shelter, °C"
  },
  {
    "Group": "Miscellaneous",
    "id": "45590",
    "name": "Temperature, internal, within equipment shelter, °F"
  },
  {
    "Group": "Miscellaneous",
    "id": "81027",
    "name": "Temperature, soil, °C"
  },
  {
    "Group": "Miscellaneous",
    "id": "72176",
    "name": "Temperature of sensor, °C"
  },
  {
    "Group": "Miscellaneous",
    "id": "50011",
    "name": "Temperature, vent gas, volcanic, °C"
  },
  {
    "Group": "Miscellaneous",
    "id": "75971",
    "name": "Transducer excitation, depth sensing, millivolts"
  },
  {
    "Group": "Miscellaneous",
    "id": "75972",
    "name": "Transducer signal, depth sensing, millivolts"
  },
  {
    "Group": "Miscellaneous",
    "id": "99247",
    "name": "Lower 90 percent prediction limit for SSC by regression (PCODE 99409), mg/l"
  },
  {
    "Group": "Miscellaneous",
    "id": "99246",
    "name": "Upper 90 percent prediction limit for SSC by regression (PCODE 99409), mg/l"
  },
  {
    "Group": "Miscellaneous",
    "id": "72300",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 0 to 0.5 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72301",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 0.5 to 1.0 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72302",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 1.0 to 1.5 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72303",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 1.5 to 2.0 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72304",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 2.0 to 2.5 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72305",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 2.5 to 3.0 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72306",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 3.0 to 3.5 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72307",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 3.5 to 4.0 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72308",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 4.0 to 4.5 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72309",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 4.5 to 5.0 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72310",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 5.0 to 5.5 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72311",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 5.5 to 6.0 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72312",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 6.0 to 6.5 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72313",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 6.5 to 7.0 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72314",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 7.0 to 7.5 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72315",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 7.5 to 8.0 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72316",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 8.0 to 8.5 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72317",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 8.5 to 9.0 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72318",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 9.0 to 9.5 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "72319",
    "name": "Underwater sound level related to sediment-generated noise, averaged from 9.5 to 10 kHz, decibels"
  },
  {
    "Group": "Miscellaneous",
    "id": "81026",
    "name": "Water content of snow, in"
  },
  {
    "Group": "Miscellaneous",
    "id": "99900",
    "name": "Water Science Center special 99900"
  },
  {
    "Group": "Miscellaneous",
    "id": "99901",
    "name": "Water Science Center special 99901"
  },
  {
    "Group": "Miscellaneous",
    "id": "99902",
    "name": "Water Science Center special 99902"
  },
  {
    "Group": "Miscellaneous",
    "id": "99903",
    "name": "Water Science Center special 99903"
  },
  {
    "Group": "Miscellaneous",
    "id": "99904",
    "name": "Water Science Center special 99904"
  },
  {
    "Group": "Miscellaneous",
    "id": "99905",
    "name": "Water Science Center special 99905"
  },
  {
    "Group": "Miscellaneous",
    "id": "99906",
    "name": "Water Science Center special 99906"
  },
  {
    "Group": "Miscellaneous",
    "id": "99907",
    "name": "Water Science Center special 99907"
  },
  {
    "Group": "Miscellaneous",
    "id": "99908",
    "name": "Water Science Center special 99908"
  },
  {
    "Group": "Miscellaneous",
    "id": "99909",
    "name": "Water Science Center special 99909"
  },
  {
    "Group": "Miscellaneous",
    "id": "99910",
    "name": "Water Science Center special 99910"
  },
  {
    "Group": "Miscellaneous",
    "id": "99911",
    "name": "Water Science Center special 99911"
  },
  {
    "Group": "Miscellaneous",
    "id": "99912",
    "name": "Water Science Center special 99912"
  },
  {
    "Group": "Miscellaneous",
    "id": "99913",
    "name": "Water Science Center special 99913"
  },
  {
    "Group": "Miscellaneous",
    "id": "99914",
    "name": "Water Science Center special 99914"
  },
  {
    "Group": "Miscellaneous",
    "id": "99915",
    "name": "Water Science Center special 99915"
  },
  {
    "Group": "Miscellaneous",
    "id": "99916",
    "name": "Water Science Center special 99916"
  },
  {
    "Group": "Miscellaneous",
    "id": "99917",
    "name": "Water Science Center special 99917"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "99237",
    "name": "Acoustic Doppler Velocity Meter signal to noise ratio"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "99239",
    "name": "Acoustic Doppler Velocity Meter standard deviation, data element specified in data descriptor"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "99240",
    "name": "Acoustic Doppler Velocity Meter standard error of velocity, feet per second"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "99242",
    "name": "Acoustic Doppler Velocity Meter standard error of velocity, centimeters per second"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "99968",
    "name": "Acoustic signal strength, units specified in data descriptor"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "70969",
    "name": "DCP battery voltage, V"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "72115",
    "name": "DCP frequency offset from channel center, Hz"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "72113",
    "name": "DCP signal modulation index, dB"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "72112",
    "name": "DCP signal to noise ratio"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "72111",
    "name": "DRGS transmission error codes"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "72117",
    "name": "Data collection platform transmission delivery delay, seconds"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "82292",
    "name": "Data relay ground station source node, code"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "72114",
    "name": "Estimate of DCP transmitted power, dB"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "99969",
    "name": "Instrument orientation, degrees clockwise from true north"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "99970",
    "name": "Instrument pitch (front to back movement), units specified in data descriptor"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "99971",
    "name": "Instrument roll (side to side movement), units specified in data descriptor"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "99238",
    "name": "Location of Acoustic Doppler Velocity Meter cell end, feet"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "99241",
    "name": "Location of Acoustic Doppler Velocity Meter cell end, meters"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "72116",
    "name": "Number of bad characters transmitted by DCP"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "72203",
    "name": "Pressure, absolute from unvented pressure transducer, pounds per square inch"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "30214",
    "name": "Pressure, relative, manometer tank, count"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "45587",
    "name": "Temperature, internal, data collection platform, °C"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "61035",
    "name": "Voltage, V"
  },
  {
    "Group": "DCP/Gage Performance",
    "id": "99263",
    "name": "Voltage ratio, voltage of transmitted electromagnetic pulse divided by the voltage of the returned pulse"
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


