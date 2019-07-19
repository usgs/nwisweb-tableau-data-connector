import { get } from "./utils.js";
import { locationMode } from "./enums.js";
import { notify } from "./notifications.js";
import { parse, toSeconds } from "iso8601-duration";
var format = require("date-format");

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
constructs a lookup table for qualifiers to their descriptions
*/

const constructQualTable = tableSeries => {
  let qualTable = {};
  tableSeries.values[0].qualifier.forEach(qualifier => {
    qualTable[qualifier.qualifierCode] = qualifier.qualifierDescription;
  });
  return qualTable;
};

/*
given a qualifier-description lookup table and a qualifier code, 
returns a formatted concatednation of teh qualifier code and its description
*/
const generateQualDescription = (qualTable, qualCode) => {
  return `${qualCode}:${qualTable[qualCode]}`;
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
  let qualDescriptionLookup = constructQualTable(tableSeries);

  paramIndices.forEach(i => {
    let qualList = [];
    tableSeries.values[0].value[i].qualifiers.forEach(qualifier => {
      qualList.push(generateQualDescription(qualDescriptionLookup, qualifier));
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
generates a query-ready ISO 8601 with timezone date time from a datetime and timezone string.
*/
const generateDateTime = (timeZone, dateTime, queryMode) => {
  if (queryMode) {
    // whether or not we need to escape '+'
    return `${dateTime.substring(0, 16)}${timeZone.replace("+", "%2b")}`;
  } else {
    return `${dateTime.substring(0, 16)}:00.000${timeZone}`;
  }
};

/*
generates a URL for query parameters contained in the connectionData object accepted as an argument
*/
const generateURL = connectionData => {
  let paramQuery = "";
  if (connectionData.paramNums.length != 0) {
    paramQuery = `&parameterCd=${connectionData.paramNums.join()}`;
  }
  let locationQuery = "";
  let siteTypeQuery = "";
  let agencyCodeQuery = "";
  let GWSiteAttrQuery = "";
  let natAquiferCodeQuery = "";
  let locAquiferCodeQuery = "";
  let drainAreaUpperQuery = "";
  let drainAreaLowerQuery = "";
  let durationCodeQuery = "";
  let modifiedSinceCodeQuery = "";
  let temporalRangeQuery = "";
  let historical = "";
  let siteStatusQuery = `&siteStatus=${connectionData.siteStatus}`;

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

  if (connectionData.agencyCodeActive) {
    agencyCodeQuery = `&agencyCd=${connectionData.agencyCode}`;
  }

  if (connectionData.natAquiferActive) {
    let natAquiferList = connectionData.natAquifer
      .replace(/\s/g, "")
      .split(",");
    natAquiferCodeQuery = `&aquiferCd=${natAquiferList.join()}`;
  }

  if (connectionData.locAquiferActive) {
    let locAquifer = connectionData.locAquifer.join(",");
    locAquiferCodeQuery = `&localAquiferCd=${locAquifer.replace(/\s/g, "")}`;
  }

  let depths = connectionData.GWSiteAttrDepths;
  if (connectionData.wellMinActive) {
    GWSiteAttrQuery += `&wellDepthMin=${depths.wellMin}`;
  }
  if (connectionData.wellMaxActive) {
    GWSiteAttrQuery += `&wellDepthMax=${depths.wellMax}`;
  }
  if (connectionData.holeMinActive) {
    GWSiteAttrQuery += `&holeDepthMin=${depths.holeMin}`;
  }
  if (connectionData.holeMaxActive) {
    GWSiteAttrQuery += `&holeDepthMax=${depths.holeMax}`;
  }

  if (connectionData.watershedLowerAreaBoundsActive) {
    drainAreaLowerQuery = `&drainAreaMin=${connectionData.watershedAreaBounds.lowerAreaBound}`;
  }
  if (connectionData.watershedUpperAreaBoundsActive) {
    drainAreaUpperQuery = `&drainAreaMax=${connectionData.watershedAreaBounds.upperAreaBound}`;
  }
  let drainAreaQuery = `${drainAreaLowerQuery}${drainAreaUpperQuery}`;

  if (connectionData.durationCodeActive) {
    durationCodeQuery = `&period=${connectionData.durationCode}`;

    let periodHistorical =
      parseInt(toSeconds(parse(connectionData.durationCode))) >= 10368000; //approximate 120 days in seconds
    if (periodHistorical) {
      historical = "nwis.";
    }
  }

  if (connectionData.temporalRangeActive) {
    let startDateString = generateDateTime(
      connectionData.temporalRangeData.timeZone,
      connectionData.temporalRangeData.startDateTime,
      true
    );
    let endDateString = generateDateTime(
      connectionData.temporalRangeData.timeZone,
      connectionData.temporalRangeData.endDateTime,
      true
    );
    temporalRangeQuery = `&startDT=${startDateString}&endDT=${endDateString}`;

    if (typeof connectionData.currentDateTime === "string") {
      // this is necessary because JSON.stringify/JSON.parse are not symmetrical with respect to Date objects
      // JSON.stringify converts date objects to strings, so they must be manually reconstructed as Date objects
      // we do this with a formatting library, as behavior of Date() for parsing format strings is not standardized in older browsers.
      connectionData.currentDateTime = format.parse(
        format.ISO8601_WITH_TZ_OFFSET_FORMAT,
        connectionData.currentDateTime
      );
    }
    let startDate = format.parse(
      format.ISO8601_WITH_TZ_OFFSET_FORMAT,
      generateDateTime(
        connectionData.temporalRangeData.timeZone,
        connectionData.temporalRangeData.startDateTime,
        false
      )
    );
    if (
      connectionData.currentDateTime.getTime() - startDate.getTime() >=
      10368000000
    ) {
      //approximate 120 days in milliseconds
      historical = "nwis.";
    }
  }

  if (connectionData.modifiedSinceCodeActive) {
    modifiedSinceCodeQuery = `&modifiedSince=${connectionData.modifiedSinceCode}`;
  }

  return `https://${historical}waterservices.usgs.gov/nwis/iv/?format=json${locationQuery}${paramQuery}${siteTypeQuery}${agencyCodeQuery}${durationCodeQuery}${modifiedSinceCodeQuery}${temporalRangeQuery}${drainAreaQuery}${natAquiferCodeQuery}${locAquiferCodeQuery}${siteStatusQuery}${GWSiteAttrQuery}`;
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
    .catch(err => notify(err));
};

export {
  getData,
  getSchema,
  formatJSONAsTable,
  generateURL,
  generateSchemaTablesFromData,
  getTimeSeriesByID,
  reformatTimeString,
  sanitizeVariableName,
  generateDateTime
};
