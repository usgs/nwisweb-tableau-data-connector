import { get } from "./utils.js";
import { locationMode } from "./enums.js";
/*global  tableau:true*/

/*
given the table.variable.variableDescription given as an argument to the getdata methods, this method
extracts the appropriate time series. 
*/
const getTimeSeriesByID = (timeSeries, tableName) => {
  let resultSeries = {};
  let found = false;
  timeSeries.forEach(series => {
    if (
      tableName ==
      `${sanitizeVariableName(series.variable.variableDescription)}_${
        series.sourceInfo.siteCode[0].value
      }`
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
  reformats time string from site-provided datetime to tableau compliant format. Time zone is removed, as it can be calculated from the geo-coords if they are provided.
*/
const reformatTimeString = timeString => {
  return timeString.replace("T", " ").substring(0, 23);
};

/*
sanitizes a variable name to name it suitable for concatenation into a talbeau column header
*/

const sanitizeVariableName = variableName => {
  return variableName.replace(/\s/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
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
    let qualList = [];
    tableSeries.values[0].qualifier.forEach(qualifier => {
      qualList.push(
        `${qualifier.qualifierCode}:${qualifier.qualifierDescription}`
      );
    });
    let newEntry = {
      dateTime: reformatTimeString(tableSeries.values[0].value[i].dateTime),
      latitude: tableSeries.sourceInfo.geoLocation.geogLocation.latitude,
      longitude: tableSeries.sourceInfo.geoLocation.geogLocation.longitude,
      units: tableSeries.variable.unit.unitCode,
      qualifier: qualList.join(","),
      [tableName]: tableSeries.values[0].value[i].value
    };
    tableData.push(newEntry);
  });

  return tableData;
};

/*
generates a URL for query parameters contained in the connectionData object accepted as an argument
*/
const generateURL = connectionData => {
  let paramQuery = `&parameterCd=${connectionData.paramNums.join()}`;

  let locationQuery = "";
  let siteTypeQuery = "";

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
    case locationMode.HYDRO: {
      let hydroCode = connectionData.hydroCode;
      locationQuery = `&huc=${hydroCode}`;
      break;
    }
    case locationMode.COUNTY: {
      let countyCode = connectionData.countyCode.join(",");
      locationQuery = `&countyCd=${countyCode}`;
      break;
    }
  }

  if (connectionData.siteTypeListActive) {
    let siteType = connectionData.siteTypeList.join(",");
    siteTypeQuery = `&siteType=${siteType}`;
  }

  return `https://waterservices.usgs.gov/nwis/iv/?format=json${locationQuery}&period=P1D${paramQuery}${siteTypeQuery}&siteStatus=all`;
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
      dataType: tableau.dataTypeEnum.datetime
    });
    cols.push({
      id: "latitude",
      alias: "latitude",
      dataType: tableau.dataTypeEnum.float
    });
    cols.push({
      id: "longitude",
      alias: "longitude",
      dataType: tableau.dataTypeEnum.float
    });
    cols.push({
      id: "units",
      alias: "units",
      dataType: tableau.dataTypeEnum.string
    });
    cols.push({
      id: "qualifier",
      alias: "qualifier",
      dataType: tableau.dataTypeEnum.string
    });
    let column = `${sanitizeVariableName(
      series.variable.variableDescription
    )}_${series.sourceInfo.siteCode[0].value}`; // this assumes there is only 1 sitecode

    cols.push({
      id: column,
      alias: column,
      dataType: tableau.dataTypeEnum.string
    });
    let newSchema = {
      id: column,
      alias: column,
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
  let connectionData;
  if (typeof tableau.connectionData === "string") {
    connectionData = JSON.parse(tableau.connectionData);
  } else {
    connectionData = tableau.connectionData;
  }
  if (!connectionData.cached) {
    let url = generateURL(connectionData);

    get(url, "json").then(function(value) {
      if (typeof value === "string") {
        connectionData.cachedData = JSON.parse(value);
      } else {
        connectionData.cachedData = value;
      }
      connectionData.cached = true;
      if (typeof tableau.connectionData === "string") {
        // this update is only necesarry if we're dealing with connection data as a string
        tableau.connectionData = JSON.stringify(connectionData);
      }
      table.appendRows(
        formatJSONAsTable(connectionData.cachedData, table.tableInfo.id)
      );
      doneCallback();
    });
  } else {
    table.appendRows(
      formatJSONAsTable(connectionData.cachedData, table.tableInfo.id)
    );
    doneCallback();
  }
};

/*
generates a tableau schema based on the information in tableau.connectionData
*/
const getSchema = schemaCallback => {
  let connectionData;
  if (typeof tableau.connectionData === "string") {
    connectionData = JSON.parse(tableau.connectionData);
  } else {
    connectionData = tableau.connectionData;
  }
  let url = generateURL(connectionData);
  get(url, "json")
    .then(function(value) {
      if (typeof value === "string") {
        schemaCallback(generateSchemaTablesFromData(JSON.parse(value)));
      } else {
        schemaCallback(generateSchemaTablesFromData(value));
      }
    })
    .catch(err => alert(err));
};

/*
    Generates the list of possible columns (set product of all sites, and all parameters)
*/
const generateColList = (sites, paramList) => {
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
  getTimeSeriesByID,
  reformatTimeString,
  sanitizeVariableName
};
