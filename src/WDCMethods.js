import { get, multiGet, combineJSONList } from "./utils.js";
import { locationMode } from "./enums.js";
import { notify } from "./notifications.js";
import { parse, toSeconds } from "iso8601-duration";
const moment = require("moment");

/*global  tableau:true*/

/*
Returns an array of reference pairs. Valueseries is a reference to
a single set of time series values and timeseries is a reference to the parent timeseries
object. Both of these references are needed because there are instances where a timeseries
will contain multiple valueseries. 

*/
const getDataListByID = (timeSeries, tableName) => {
  let results = [];
  let found = false;
  timeSeries.forEach(series => {
    series.values.forEach(value => {
      if (
        tableName === sanitizeVariableName(series.variable.variableDescription)
      ) {
        results.push({ timeSeries: series, valueSeries: value });
        found = true;
      }
    });
  });
  if (found) {
    return results;
  } else {
    throw new Error("Schema Mismatch Error: Missing Table");
  }
};

/*
constructs a lookup table for qualifiers to their descriptions
*/

const constructQualTable = valueSeries => {
  let qualTable = {};
  valueSeries.qualifier.forEach(qualifier => {
    qualTable[qualifier.qualifierCode] = qualifier.qualifierDescription;
  });
  return qualTable;
};

/*
given a qualifier-description lookup table and a qualifier code, 
returns a formatted concatenation of the qualifier code and its description
*/
const generateQualDescription = (qualTable, qualCode) => {
  return `${qualCode}:${qualTable[qualCode]}`;
};

/*
  re-formats time string from site-provided date-time to tableau compliant format. Time zone is removed, as it can be calculated from the geo-coords if they are provided.
*/
const reformatTimeString = timeString => {
  return timeString.replace("T", " ").substring(0, 23);
};

/*
sanitizes a variable name to name it suitable for concatenation into a tableau column header
*/

const sanitizeVariableName = variableName => {
  return variableName.replace(/\s/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
};

/*
check if data matches -999999 and return null instead
*/
const checkForNull = data => {
  if (data == "-999999") {
    return null;
  }
  return data;
};

/*
Takes a JSON and returns a table formatted in accordance with the schema provided to Tableau.
*/
const formatJSONAsTable = (currentDateTime, data, tableName) => {
  if (tableName == "metadata") {
    let tableData = [];
    let queryURL = "";
    const DOI = "http://dx.doi.org/10.5066/F7P55KJN";

    if (!(data.value.queryInfo.multi === true)) {
      queryURL = data.value.queryInfo.queryURL;
    } else {
      queryURL = data.value.queryInfo.queryURL.join(";");
    }
    let queryTime = currentDateTime;
    data.value.queryInfo.note.forEach(element => {
      if (element["title"] === "requestDT") {
        queryTime = element["value"];
      }
    });
    tableData.push({
      DOINumber: DOI,
      queryURL: queryURL,
      queryTime: queryTime
    });
    return tableData;
  }

  let tableData = [];
  let timeSeries = data.value.timeSeries;

  let dataSeries = getDataListByID(timeSeries, tableName);
  let seriesIndices = Array.from(dataSeries.keys());

  seriesIndices.forEach(i => {
    let tableSeries = dataSeries[i]["timeSeries"];
    let valueSeries = dataSeries[i]["valueSeries"];

    let paramIndices = Array.from(valueSeries.value.keys());
    let qualDescriptionLookup = constructQualTable(valueSeries);
    paramIndices.forEach(k => {
      let qualList = [];
      valueSeries.value[k].qualifiers.forEach(qualifier => {
        qualList.push(
          generateQualDescription(qualDescriptionLookup, qualifier)
        );
      });
      let newEntry = {
        dateTime: reformatTimeString(valueSeries.value[k].dateTime),
        latitude: tableSeries.sourceInfo.geoLocation.geogLocation.latitude,
        longitude: tableSeries.sourceInfo.geoLocation.geogLocation.longitude,
        units: tableSeries.variable.unit.unitCode,
        qualifier: qualList.join(","),
        [tableName]: checkForNull(valueSeries.value[k].value),
        siteNum: tableSeries.sourceInfo.siteCode[0].value,
        paramCode: tableSeries.variable.variableCode[0].value,
        agencyCode: tableSeries.sourceInfo.siteCode[0].agencyCode,
        statCode: tableSeries.variable.options.option[0].optionCode,
        methodCode: valueSeries.method[0].methodID,
        methodDescription: valueSeries.method[0].methodDescription
      };
      tableData.push(newEntry);
    });
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
const generateURL = (connectionData, specifyParams, params) => {
  let paramQuery = "";

  if (!specifyParams) {
    if (connectionData.paramNums.length != 0) {
      paramQuery = `&parameterCd=${connectionData.paramNums.join(",")}`;
    }
  } else {
    paramQuery = `&parameterCd=${params.join(",")}`;
  }

  let locationQuery = "";
  let siteTypeQuery = "";
  let agencyCodeQuery = "";
  let GWSiteAttrQuery = "";
  let natAquiferCodeQuery = "";
  let locAquiferCodeQuery = "";
  let drainAreaUpperQuery = "";
  let drainAreaLowerQuery = "";
  let altitudeLowerQuery = "";
  let altitudeUpperQuery = "";
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
      locationQuery = `&bBox=${bounds.west.replace(
        /\s/g,
        ""
      )},${bounds.south.replace(/\s/g, "")},${bounds.east.replace(
        /\s/g,
        ""
      )},${bounds.north.replace(/\s/g, "")}`;
      break;
    }
    case locationMode.HYDRO: {
      let hydroCode = connectionData.hydroCode.replace(/\s/g, "");
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
    drainAreaLowerQuery = `&drainAreaMin=${connectionData.watershedAreaBounds.lowerAreaBound.replace(
      /\s/g,
      ""
    )}`;
  }
  if (connectionData.watershedUpperAreaBoundsActive) {
    drainAreaUpperQuery = `&drainAreaMax=${connectionData.watershedAreaBounds.upperAreaBound.replace(
      /\s/g,
      ""
    )}`;
  }
  let drainAreaQuery = `${drainAreaLowerQuery}${drainAreaUpperQuery}`;

  if (connectionData.lowerAltitudeBoundActive) {
    altitudeLowerQuery = `&altMin=${connectionData.altitudeBounds.lowerAltitudeBound.replace(
      /\s/g,
      ""
    )}`;
  }
  if (connectionData.upperAltitudeBoundActive) {
    altitudeUpperQuery = `&altMax=${connectionData.altitudeBounds.upperAltitudeBound.replace(
      /\s/g,
      ""
    )}`;
  }
  let altitudeQuery = `${altitudeLowerQuery}${altitudeUpperQuery}`;

  if (connectionData.durationCodeActive) {
    durationCodeQuery = `&period=${connectionData.durationCode}`;

    let periodHistorical =
      parseInt(toSeconds(parse(connectionData.durationCode))) >= 10195200; //approximate 118 days in seconds
    if (periodHistorical) {
      // this 2-day tolerance is provided to account for variations in temporal length of '120 day' period
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
      connectionData.currentDateTime = moment(connectionData.currentDateTime);
    }
    let startDate = moment(
      generateDateTime(
        connectionData.temporalRangeData.timeZone,
        connectionData.temporalRangeData.startDateTime,
        false
      )
    );
    if (connectionData.currentDateTime.diff(startDate) >= 10195200000) {
      //approximate 118 days in milliseconds
      // this 2-day tolerance is provided to account for variations in temporal length of '120 day' period
      historical = "nwis.";
    }
  }

  if (connectionData.modifiedSinceCodeActive) {
    modifiedSinceCodeQuery = `&modifiedSince=${connectionData.modifiedSinceCode}`;
  }

  return `https://${historical}waterservices.usgs.gov/nwis/iv/?format=json${locationQuery}${paramQuery}${siteTypeQuery}${agencyCodeQuery}${durationCodeQuery}${modifiedSinceCodeQuery}${temporalRangeQuery}${drainAreaQuery}${natAquiferCodeQuery}${locAquiferCodeQuery}${altitudeQuery}${siteStatusQuery}${GWSiteAttrQuery}`;
};

/*
given more than 100 parameters, generates as many urls as necessary to satisfy the constraint that queries each contain no more than 100 parameters 
*/
const generateMultiURL = connectionData => {
  if (connectionData.paramNums.length === 0) {
    return [generateURL(connectionData, false)];
  }
  let lowerBound = 0;
  let paramGroupList = [];
  let URLList = [];
  while (lowerBound + 100 <= connectionData.paramNums.length) {
    paramGroupList.push(
      connectionData.paramNums.slice(lowerBound, lowerBound + 100)
    );
    lowerBound += 100;
  }
  if (lowerBound < connectionData.paramNums.length) {
    paramGroupList.push(connectionData.paramNums.slice(lowerBound));
  }
  paramGroupList.forEach(paramGroup => {
    URLList.push(generateURL(connectionData, true, paramGroup));
  });
  return URLList;
};

/*
takes query URL to be sent to the NWISweb instantaneous values service and 
generates an appropriate tableau schema.
*/
const generateSchemaTablesFromData = data => {
  let tableList = [];

  //here the entry declaring the metadata table is added to the schema

  let metaTableCols = [];
  metaTableCols.push({
    id: "queryURL",
    alias: "queryURL",
    dataType: tableau.dataTypeEnum.string
  });
  metaTableCols.push({
    id: "DOINumber",
    alias: "DOINumber",
    dataType: tableau.dataTypeEnum.string
  });
  metaTableCols.push({
    id: "queryTime",
    alias: "queryTime",
    dataType: tableau.dataTypeEnum.string
  });

  let metaTableSchema = {
    id: "metadata",
    alias: "metadata",
    columns: metaTableCols
  };

  tableList.push(metaTableSchema);

  //here the various tables returned by the query are added to the schema

  let added = {};
  let timeSeries = data.value.timeSeries;
  timeSeries.forEach(series => {
    series.values.forEach(() => {
      let column = `${sanitizeVariableName(
        series.variable.variableDescription
      )}`;
      if (!(column in added)) {
        added[column] = true;
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
        cols.push({
          id: "siteNum",
          alias: "siteNum",
          dataType: tableau.dataTypeEnum.string
        });
        cols.push({
          id: "paramCode",
          alias: "paramCode",
          dataType: tableau.dataTypeEnum.string
        });
        cols.push({
          id: "agencyCode",
          alias: "agencyCode",
          dataType: tableau.dataTypeEnum.string
        });
        cols.push({
          id: "statCode",
          alias: "statCode",
          dataType: tableau.dataTypeEnum.string
        });
        cols.push({
          id: "methodCode",
          alias: "methodCode",
          dataType: tableau.dataTypeEnum.string
        });
        cols.push({
          id: "methodDescription",
          alias: "methodDescription",
          dataType: tableau.dataTypeEnum.string
        });

        cols.push({
          id: column,
          alias: column,
          dataType: tableau.dataTypeEnum.float
        });
        let newSchema = {
          id: column,
          alias: column,
          columns: cols
        };
        tableList.push(newSchema);
      }
    });
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
    // this check may be unnecessary
    connectionData = JSON.parse(tableau.connectionData);
  } else {
    connectionData = tableau.connectionData;
  }
  if (!connectionData.cached) {
    let urlList = generateMultiURL(connectionData);
    multiGet(urlList, "json", get)
      .then(value => {
        let JSONValue = value.map(element => {
          if (typeof element === "string") {
            return JSON.parse(element);
          } else {
            return element;
          }
        });
        connectionData.cachedData = combineJSONList(JSONValue);
        table.appendRows(
          formatJSONAsTable(
            connectionData.currentDateTime,
            connectionData.cachedData,
            table.tableInfo.id
          )
        );
        doneCallback();
      })
      .catch(err => notify(err));
  } else {
    table.appendRows(
      formatJSONAsTable(
        connectionData.currentDateTime,
        connectionData.cachedData,
        table.tableInfo.id
      )
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
    // this check may be unnecessary, and was added to provide compatibility with the tableau web data connector simulator which may or may not require it
    connectionData = tableau.connectionData;
  }

  let urlList = generateMultiURL(connectionData);
  multiGet(urlList, "json", get)
    .then(value => {
      let JSONValue = value.map(element => {
        if (typeof element === "string") {
          return JSON.parse(element);
        } else {
          return element;
        }
      });

      schemaCallback(generateSchemaTablesFromData(combineJSONList(JSONValue)));
    })
    .catch(err => notify(err));
};

export {
  getData,
  getSchema,
  formatJSONAsTable,
  generateURL,
  generateSchemaTablesFromData,
  reformatTimeString,
  sanitizeVariableName,
  checkForNull,
  generateDateTime,
  generateMultiURL,
  getDataListByID,
  constructQualTable,
  generateQualDescription
};
