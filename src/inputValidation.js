import { locationMode } from "./enums.js";
import agencyData from "./fetchedValues/agency.json";
import stateData from "./fetchedValues/states.json";
import siteTypeData from "./fetchedValues/siteTypes.json";
import { notify } from "./notifications.js";
import { generateDateTime } from "./WDCMethods.js";
const moment = require("moment");

/*
useful helper function to allow searching lists of dictionaries for a value at a specific key.
*/
const inObjList = (list, target, key) => {
  let returnVal = false;
  list.forEach(element => {
    if (target == element[key]) {
      returnVal = true;
    }
  });
  return returnVal;
};

/*
      Ensures the user has selected a valid state or territory in their query. Always
      returns true if the current vuex locationMode setting is not STATE.

    */
const validateStateInputs = (input, instance, stateData) => {
  if (instance.$store.getters.locationMode != locationMode.STATE) return true;
  if (input == "") {
    return "no state is selected";
  }
  if (!(input in stateData)) return "invalid state selected";
  return true;
};
/*
      ensures that the user has entered valid coordinates. Always returns true if the 
      current locationMode setting is not COORDS.
    */
const validateCoordinateInputs = (coordinates, instance) => {
  if (instance.$store.getters.locationMode != locationMode.COORDS) return true;
  if (!isNumeric(coordinates.north)) {
    return "non-numeric northern boundary coordinate";
  }
  if (!isNumeric(coordinates.south))
    return "non-numeric southern boundary coordinate";
  if (!isNumeric(coordinates.east))
    return "non-numeric eastern boundary coordinate";
  if (!isNumeric(coordinates.west))
    return "non-numeric western boundary coordinate";
  if (!isWithinLongitudeBounds(coordinates.north))
    return "out of bounds northern boundary coordinate(-90 - 90)";
  if (!isWithinLongitudeBounds(coordinates.south))
    return "out of bounds south boundary coordinate(-90 - 90)";
  if (!isWithinLatitudeBounds(coordinates.east))
    return "out of bounds eastern boundary coordinate(-180 - 180)";
  if (!isWithinLatitudeBounds(coordinates.west))
    return "out of bounds western boundary coordinate(-180 - 180)";
  if (parseFloat(coordinates.south) >= parseFloat(coordinates.north))
    return "southern boundary coordinate is north of northern boundary coordinate";
  if (parseFloat(coordinates.west) >= parseFloat(coordinates.east))
    return "western boundary coordinate is east of eastern boundary coordinate";

  return true;
};

const isNumeric = value => {
  let regex = /^(-)?((\d)+\.)?(\d)+$/;
  return value.match(regex);
};

const isWithinLatitudeBounds = latitude => {
  let numericLatitude = parseFloat(latitude);
  return numericLatitude > -180 && numericLatitude < 180;
};
const isWithinLongitudeBounds = longitude => {
  let numericLongitude = parseFloat(longitude);
  return numericLongitude > -90 && numericLongitude < 90;
};
/*
      rounds coordinate inputs to 6 decimal places. Called in validateFormInputs()
    */
const roundCoordinateInputs = coordinates => {
  coordinates.north = parseFloat(coordinates.north)
    .toFixed(6)
    .toString();
  coordinates.south = parseFloat(coordinates.south)
    .toFixed(6)
    .toString();
  coordinates.east = parseFloat(coordinates.east)
    .toFixed(6)
    .toString();
  coordinates.west = parseFloat(coordinates.west)
    .toFixed(6)
    .toString();
  return coordinates;
};
/*
  validates the input format of the list of site codes
  */
const validateSiteInputs = (sites, instance) => {
  if (instance.$store.getters.locationMode != locationMode.SITE) return true;

  let regex = /^(((\d){8}(\d?){4}),)*((\d){8}(\d?){4})$/;

  if (!sites.replace(/\s/g, "").match(regex)) {
    return "site list in invalid format"; // 1 or more 8-12 digit site codes
  }
  return true;
};
/*
    "You can specify one major Hydrologic Unit code and up to 10 minor Hydrologic Unit codes. 
    Separate HUCs with commas. For performance reasons, no more than one major HUC (a two digit code) is allowed. 
    A minor HUCs must be 8 digits long."
    Above excerpt taken from waterservices.usgs.com
  */
const validateHydroCodeInputs = (hydroCode, instance) => {
  if (instance.$store.getters.locationMode != locationMode.HYDRO) return true;
  let regex = /^(((\d{2})(((,(\d{8}))|){10}))|(\d{2})|(\d{8})|((\d{8})(((,(\d{8}))|){9})))$/;
  if (!hydroCode.replace(/\s/g, "").match(regex)) {
    return "hydrologic unit code format is invalid. You may specify up to 1 major hydrologic unit code followed by up to 10 minor hydrologic unit codes, separated by commas.";
  }
  return true;
};

/*
 warns the user if they have specified a duration in a format non-compliant with the ISO 8601 duration specification. Takes message
 as an argument because this is used for more than one form and different messages are needed 
*/

const validateISO_8601Duration = (duration, message, active) => {
  if (!active) {
    return true;
  }
  let regex = /^P((\d)+W)?((\d)+D)?((T(\d)+H((\d)+M)?((\d)+S)?|T(\d)+M((\d)+S)?|T(\d)+S))?$/;
  let antiregex = /^P$/;
  if (
    !duration.replace(/\s/g, "").match(regex) ||
    duration.replace(/\s/g, "").match(antiregex)
  ) {
    return message;
  }

  return true;
};

/*
warns the user if they have entered incorrectly formatted time codes
*/
const validateTimeCodes = (temporalRangeData, active) => {
  if (!active) {
    return true;
  }

  let regex = /^(\d){4}-(\d){2}-(\d){2}T(\d){2}:(\d){2}$/;

  if (!temporalRangeData.startDateTime.substring(0, 16).match(regex)) {
    return "start date time in invalid format";
  }
  if (!temporalRangeData.endDateTime.substring(0, 16).match(regex)) {
    return "end date time in invalid format";
  }

  return true;
};

/*
warns the user if they entered an invalid site-type code

*/
const validateSiteTypeInputs = (input, instance, siteTypeData) => {
  if (!instance.$store.getters.siteTypeListActive) {
    return true;
  }
  let found = inObjList(siteTypeData, input, "site_tp_cd");
  return found ? found : "invalid site type selected";
};

/*
warns the user if they have no query parameters selected. This is the only pathological state not protected
 against from within the  ParamSelect component, because it is a valid interactive session state.
*/
const validateParamInputs = paramList => {
  if (paramList.length <= 100) {
    return true;
  } else {
    return "parameter query cannot exceed 100 parameters";
  }
};

/*
in the event that the temporal range query functionality is active, warns the user if the temporal boundaries or incomplete
or inconsistent. 
*/

const validateTemporalRange = (temporalRangeData, instance) => {
  if (!instance.$store.getters.temporalRangeActive) {
    return true;
  }
  if (
    instance.$store.getters.temporalRangeActive &&
    instance.$store.getters.durationCodeActive
  ) {
    return "Explicit temporal range parameters are mutually exclusive with duration code specified timeperiod parameters.";
  }
  if (
    temporalRangeData.startDateTime == "" ||
    temporalRangeData.endDateTime == "" ||
    temporalRangeData.timeZone == ""
  ) {
    return "One or more required fields for temporal range has not been specified. Please specify all fields or remove the temporal range from your query by clicking the checkbox again.";
  }

  let startDate = moment(
    generateDateTime(
      temporalRangeData.timeZone,
      temporalRangeData.startDateTime,
      false
    )
  );
  let endDate = moment(
    generateDateTime(
      temporalRangeData.timeZone,
      temporalRangeData.endDateTime,
      false
    )
  );
  let offset = endDate.diff(startDate);
  if (offset < 0) {
    return "end date before start date.";
  } else if (offset == 0) {
    return "end date equal to start date; temporal range has zero length";
  }

  return true;
};

/*
warns the user if they have no counties selected. This is the only pathological state not protected
 against from within the CountySelect  component, because it is a valid interactive session state.
*/
const validateCountyInputs = (countyList, instance) => {
  if (instance.$store.getters.locationMode != locationMode.COUNTY) return true;
  if (countyList.length != 0) {
    return true;
  } else {
    return "county query requires between 1 and 10 counties";
  }
};

/*
Warns the user if they have input invalid watershed area boundaries
*/

const validateWatershedAreaBoundaries = (boundaries, instance) => {
  let upperActive = instance.$store.getters.watershedUpperAreaBoundsActive;
  let lowerActive = instance.$store.getters.watershedLowerAreaBoundsActive;

  if (!upperActive && !lowerActive) {
    return true;
  }
  let regex = /^\d(\d)*$/;

  if (upperActive) {
    if (!boundaries.upperAreaBound.replace(/\s/g, "").match(regex)) {
      return "upper area bound is not a positive integer";
    }
  }
  if (lowerActive) {
    if (!boundaries.lowerAreaBound.replace(/\s/g, "").match(regex)) {
      return "lower area bound is not a positive integer";
    }
  }

  if (
    parseInt(boundaries.upperAreaBound) < parseInt(boundaries.lowerAreaBound) &&
    lowerActive &&
    upperActive
  ) {
    return "invalid boundaries: lower watershed area bound exceeds upper watershed area bound.";
  }

  return true;
};

/*
Warns the user if they have input invalid altitude area boundaries
*/

const validateAltitudeBoundaries = (boundaries, instance) => {
  let upperActive = instance.$store.getters.upperAltitudeBoundActive;
  let lowerActive = instance.$store.getters.lowerAltitudeBoundActive;

  if (!upperActive && !lowerActive) {
    return true;
  }
  let regex = /^(-)?(\d)+(\.\d)?(\d)*$/;

  if (upperActive) {
    if (!boundaries.upperAltitudeBound.replace(/\s/g, "").match(regex)) {
      return "upper altitude bound is not a valid float. format: #.# ";
    }
  }
  if (lowerActive) {
    if (!boundaries.lowerAltitudeBound.replace(/\s/g, "").match(regex)) {
      return "lower altitude bound is not a valid float. format: #.# ";
    }
  }

  if (
    parseFloat(boundaries.upperAltitudeBound) <
      parseFloat(boundaries.lowerAltitudeBound) &&
    lowerActive &&
    upperActive
  ) {
    return "invalid boundaries: lower altitude bound exceeds upper altitude bound.";
  }

  return true;
};

/*
  Warns the user if they have selected an invalid agency code.
*/
const validateAgencyInputs = (agency, instance, agencyData) => {
  if (!instance.$store.getters.agencyActive) {
    return true;
  }
  let found = inObjList(agencyData, agency, "agency_cd");
  return found ? found : "invalid agency code";
};

/*
      Ensures that if both min and max values are present, the min value is less than the max value.
      Checks both hole and well depths.
    */
const validateGroundWaterSiteInputs = (GWSiteAttrDepths, instance) => {
  let wellMinActive = instance.$store.getters.wellMinActive;
  let wellMaxActive = instance.$store.getters.wellMaxActive;
  let holeMinActive = instance.$store.getters.holeMinActive;
  let holeMaxActive = instance.$store.getters.holeMaxActive;

  if (!wellMinActive && !wellMaxActive && !holeMinActive && !holeMaxActive) {
    return true;
  }

  let regex = /^(-)?(\d)+(\.\d)?(\d)*$/;

  if (wellMinActive) {
    if (!GWSiteAttrDepths.wellMin.replace(/\s/g, "").match(regex)) {
      return "non-numeric well minimum depth";
    }
  }

  if (wellMaxActive) {
    if (!GWSiteAttrDepths.wellMax.replace(/\s/g, "").match(regex)) {
      return "non-numeric well maximum depth";
    }
  }

  if (holeMinActive) {
    if (!GWSiteAttrDepths.holeMin.replace(/\s/g, "").match(regex)) {
      return "non-numeric hole minimum depth";
    }
  }

  if (holeMaxActive) {
    if (!GWSiteAttrDepths.holeMax.replace(/\s/g, "").match(regex)) {
      return "non-numeric hole maximum depth";
    }
  }

  if (
    wellMinActive &&
    wellMaxActive &&
    parseFloat(GWSiteAttrDepths.wellMin) > parseFloat(GWSiteAttrDepths.wellMax)
  ) {
    return "well minimum depth is greater than well maximum depth";
  }

  if (
    holeMinActive &&
    holeMaxActive &&
    parseFloat(GWSiteAttrDepths.holeMin) > parseFloat(GWSiteAttrDepths.holeMax)
  ) {
    return "hole minimum depth is greater than hole maximum depth";
  }
  return true;
};

/*
      function which validates user form inputs and updates vuex values to a query ready format. 
      This function should be run and observed to return true before anything in the body of requestData 
      is run. 
    */
const validateFormInputs = instance => {
  let stateStatus = validateStateInputs(
    instance.$store.getters.USStateName,
    instance,
    stateData
  );
  if (!(stateStatus === true)) {
    notify(stateStatus);
    return false;
  }
  let coordStatus = validateCoordinateInputs(
    instance.$store.getters.coordinates,
    instance
  );
  if (!(coordStatus === true)) {
    notify(coordStatus);
    return false;
  }

  let siteListStatus = validateSiteInputs(
    instance.$store.getters.sites,
    instance
  );
  if (!(siteListStatus === true)) {
    notify(siteListStatus);
    return false;
  }

  let HydroCodeStatus = validateHydroCodeInputs(
    instance.$store.getters.hydroCode,
    instance
  );
  if (!(HydroCodeStatus === true)) {
    notify(HydroCodeStatus);
    return false;
  }
  let paramStatus = validateParamInputs(instance.$store.getters.paramCodes);
  if (!(paramStatus === true)) {
    notify(paramStatus);
    return false;
  }

  let countyStatus = validateCountyInputs(
    instance.$store.getters.countyCode,
    instance
  );
  if (!(countyStatus === true)) {
    notify(countyStatus);
    return false;
  }

  let siteTypeListStatus = validateSiteTypeInputs(
    instance.$store.getters.siteType,
    instance,
    siteTypeData
  );
  if (!(siteTypeListStatus === true)) {
    notify(siteTypeListStatus);
    return false;
  }

  let agencyStatus = validateAgencyInputs(
    instance.$store.getters.agencyCode,
    instance,
    agencyData
  );
  if (!(agencyStatus === true)) {
    notify(agencyStatus);
    return false;
  }

  let groundWaterSiteStatus = validateGroundWaterSiteInputs(
    instance.$store.getters.GWSiteAttrDepths,
    instance
  );
  if (!(groundWaterSiteStatus === true)) {
    notify(groundWaterSiteStatus);
    return false;
  }

  let watershedStatus = validateWatershedAreaBoundaries(
    instance.$store.getters.watershedAreaBounds,
    instance
  );
  if (!(watershedStatus === true)) {
    notify(watershedStatus);
    return false;
  }

  let altitudeStatus = validateAltitudeBoundaries(
    instance.$store.getters.altitudeBounds,
    instance
  );
  if (!(altitudeStatus === true)) {
    notify(altitudeStatus);

    return false;
  }

  let durationCodeStatus = validateISO_8601Duration(
    instance.$store.getters.durationCode,
    "duration code formatting invalid; please refer to link provided in the tooltip",
    instance.$store.getters.durationCodeActive
  );

  if (!(durationCodeStatus === true)) {
    notify(durationCodeStatus);
    return false;
  }

  let modifiedSinceStatus = validateISO_8601Duration(
    instance.$store.getters.modifiedSinceCode,
    "modified since duration code formatting invalid; please refer to link provided in the tooltip",
    instance.$store.getters.modifiedSinceCodeActive
  );
  if (!(modifiedSinceStatus === true)) {
    notify(modifiedSinceStatus);
    return false;
  }

  let timeCodeStatus = validateTimeCodes(
    instance.$store.getters.temporalRangeData,
    instance.$store.getters.temporalRangeActive
  );
  if (!(timeCodeStatus === true)) {
    notify(timeCodeStatus);
    return false;
  }

  let temporalRangeStatus = validateTemporalRange(
    instance.$store.getters.temporalRangeData,
    instance
  );
  if (!(temporalRangeStatus === true)) {
    notify(temporalRangeStatus);
  }
  instance.$store.commit(
    "changeCoordinates",
    roundCoordinateInputs(instance.$store.getters.coordinates)
  );
  return true;
};

export {
  validateFormInputs,
  validateStateInputs,
  validateCoordinateInputs,
  roundCoordinateInputs,
  validateSiteInputs,
  validateHydroCodeInputs,
  validateCountyInputs,
  validateParamInputs,
  validateSiteTypeInputs,
  validateAgencyInputs,
  validateWatershedAreaBoundaries,
  validateAltitudeBoundaries,
  validateGroundWaterSiteInputs,
  validateISO_8601Duration,
  validateTemporalRange,
  validateTimeCodes
};
