import { get } from "../utils.js";
/*global  tableau:true*/

/*
enum for location query mode (site id, state, coordinate box, watershed etc...).
Note that these location query modes are mutually exclusive.
*/
const locationMode = {
  SITE: "site",
  STATE: "state"
};

/*
Given an array of timeseries objects, this function returns an array containing 
the ordered indices of the longest timeseries object in the list. In the event 
that the list is empty, this function throws an error.
*/
const getLongestTimesSeriesindices = timeSeries => {
  if (timeSeries.length == 0) {
    throw new Error("no time series data");
  }
  let result = [];
  let length = -1;
  timeSeries.forEach(dataSeries => {
    if (dataSeries.values[0].value.length > length) {
      length = dataSeries.values[0].value.length;
      result = Array.from(dataSeries.values[0].value.keys());
    }
  });
  return result;
};

/*
Takes a JSON and returns a table formatted in accordance with the schema provided to tableau.
*/
const formatJSONAsTable = data => {
  let tableData = [];
  let timeSeries = data.value.timeSeries;
  let dataIndices = getLongestTimesSeriesindices(timeSeries);
  let paramIndices = Array.from(timeSeries.keys());

  dataIndices.forEach(i => {
    let newEntry = { dateTime: "unknown" };
    paramIndices.forEach(c => {
      try {
        let name = timeSeries[c].name;
        let nameTokens = name.split(":");
        let site = nameTokens[1];
        let paramType = nameTokens[2];
        newEntry[site + "_" + paramType] =
          timeSeries[c].values[0].value[i].value;
        if (newEntry["dateTime"] == "unknown") {
          // here we naively assume that all time series will start at the same time, and not have any gaps TODO deal with this in a sensible way
          newEntry["dateTime"] = timeSeries[c].values[0].value[i].dateTime;
        }
      } catch (err) {
        //ignore index(out of range for this parameter for this site)
      }
    });
    tableData.push(newEntry);
  });
  return tableData;
};

/*
generates a URL for query paramaters contained in the connectionData object accepted as an argument
*/
const generateURL = connectionData => {
  //todo standardize this template's format when we add more query info fields
  let paramList = connectionData.paramNums.replace(/\s/g, "").split(","); // split by comma, ignoring whitespace
  let paramQuery = `&parameterCd=${paramList.join()}`;

  let locationQuery = "";

  switch (connectionData.locationMode) {
    case locationMode.SITE: {
      let siteList = connectionData.siteNums.replace(/\s/g, "").split(",");
      locationQuery = `&sites=${siteList.join()}`;
      break;
    }
    case locationMode.STATE: {
      locationQuery = `&stateCd=${connectionData.state}`;
      break;
    }
  }

  return `https://waterservices.usgs.gov/nwis/iv/?format=json${locationQuery}&period=P1D${paramQuery}&siteStatus=all`;
};

/*
takes query url to be sent to the NWISweb instantaneous values service and 
generates an appropriate tableau schema.
*/
const generateSchemaColsFromData = data => {
  let cols = [];
  cols.push({
    id: "dateTime",
    alias: "dateTime",
    dataType: tableau.dataTypeEnum.string //placeholder until we develop connectiondata more
  });
  let timeSeries = data.value.timeSeries;
  timeSeries.forEach(series => {
    let name = series.name;
    let nameTokens = name.split(":");
    let site = nameTokens[1];
    let paramType = nameTokens[2];
    let column = site + "_" + paramType;
    cols.push({
      id: column,
      alias: column,
      dataType: tableau.dataTypeEnum.string //placeholder until we develop connectiondata more
    });
  });
  return cols;
};

/*
generates a URL, then fetches a json from that url and formats it in accordance with 
the schema we have given tableau. 
*/
const getData = (table, doneCallback) => {
  let url = generateURL(tableau.connectionData);

  get(url, "json").then(function(value) {
    table.appendRows(formatJSONAsTable(value));
    doneCallback();
  });
};
/*
generates a tableau schema based on the information in tableau.connectionData
*/
const getSchema = schemaCallback => {
  let url = generateURL(tableau.connectionData);
  get(url, "json").then(function(value) {
    let cols = generateSchemaColsFromData(value);
    let tableSchema = {
      id: "WaterData",
      alias: "useful information will be put here", //todo, add useful information
      columns: cols
    };
    schemaCallback([tableSchema]);
  });
};

/*
    Generates the list of possible columns (set product of all sites, and all parameters)
*/
const generateColList = (sites, params) => {
  let paramList = params.replace(/\s/g, "").split(",");
  let siteList = sites.replace(/\s/g, "").split(",");
  let columnList = [];
  siteList.forEach(function(site) {
    paramList.forEach(function(param) {
      // we are creating a column for each property of each site
      columnList.push(site + "_" + param);
    });
  });
  return columnList;
};

export {
  getData,
  getSchema,
  formatJSONAsTable,
  generateURL,
  generateColList,
  getLongestTimesSeriesindices,
  generateSchemaColsFromData,
  locationMode
};
