import { get } from "../utils.js";
import { locationMode } from "../enums.js";
/*global  tableau:true*/

/*
given the table.tableInfo.id given as an argument to the getdata methods, this method
extracts the appropriate time series. 
*/
const getTimeSeriesByID = (timeSeries, tableName) => {
  let resultSeries = {};
  let found = false;
  timeSeries.forEach(series => {
    if (
      tableName == `${series.name.split(":")[1]}_${series.name.split(":")[2]}`
    ) {
      found = true;
      resultSeries = series;
    }
  });
  if (found) {
    return resultSeries;
  } else {
    throw new Error("Schema Mismatch Error: Missing Table");
  }
};

/*
Takes a JSON and returns a table formatted in accordance with the schema provided to tableau.
*/
const formatJSONAsTable = (data, tableName) => {
  let tableData = [];
  let timeSeries = data.value.timeSeries;
  let tableSeries = getTimeSeriesByID(timeSeries, tableName);
  let paramIndices = Array.from(tableSeries.values[0].value.keys());

  paramIndices.forEach(i => {
    let newEntry = {
      dateTime: tableSeries.values[0].value[i].dateTime,
      [tableName]: tableSeries.values[0].value[i].value
    };
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
    case locationMode.COORDS: {
      // west south east north
      let bounds = connectionData.boundaryCoords;
      locationQuery = `&bBox=${bounds.west},${bounds.south},${bounds.east},${bounds.north}`;
      break;
    }
  }

  return `https://waterservices.usgs.gov/nwis/iv/?format=json${locationQuery}&period=P1D${paramQuery}&siteStatus=all`;
};

/*
takes query url to be sent to the NWISweb instantaneous values service and 
generates an appropriate tableau schema.
*/
const generateSchemaTablesFromData = data => {
  let tableList = [];
  let timeSeries = data.value.timeSeries;
  timeSeries.forEach(series => {
    let cols = [];
    cols.push({
      id: "dateTime",
      alias: "dateTime",
      dataType: tableau.dataTypeEnum.string //placeholder until we develop connectiondata more
    });
    let name = series.name;
    let nameTokens = name.split(":");
    let site = nameTokens[1];
    let paramType = nameTokens[2];
    let column = `${site}_${paramType}`;
    cols.push({
      id: column,
      alias: column,
      dataType: tableau.dataTypeEnum.string //placeholder until we develop connectiondata more
    });
    let newSchema = {
      id: column,
      alias: "useful information will be put here", //todo, add useful information
      columns: cols
    };
    tableList.push(newSchema);
  });
  return tableList;
};

/*
retrieves and caches data if it has not already been cached, otherwise only
reads data from a cache and appropriately populates a table. 
*/
const getData = (table, doneCallback) => {
  if (!tableau.connectionData.cached) {
    let url = generateURL(tableau.connectionData);

    get(url, "json").then(function(value) {
      tableau.connectionData.cachedData = value;
      tableau.connectionData.cached = true;
      table.appendRows(formatJSONAsTable(value, table.tableInfo.id));
      doneCallback();
    });
  } else {
    table.appendRows(
      formatJSONAsTable(tableau.connectionData.cachedData, table.tableInfo.id)
    );
    doneCallback();
  }
};

/*
generates a tableau schema based on the information in tableau.connectionData
*/
const getSchema = schemaCallback => {
  let url = generateURL(tableau.connectionData);
  get(url, "json").then(function(value) {
    schemaCallback(generateSchemaTablesFromData(value));
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
      columnList.push(`${site}_${param}`);
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
  generateSchemaTablesFromData,
  getTimeSeriesByID
};
