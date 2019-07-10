import { locationMode } from "./enums.js";
import agencyData from "./fetchedValues/agency.json";

/*
      Ensures the user has selected a valid state or territory in their query. Always
      returns true if the current vuex locationMode setting is not STATE.

    */
const validateStateInputs = (input, instance) => {
  if (instance.$store.getters.locationMode != locationMode.STATE) return true;
  if (!(input in instance.stateData)) return "invalid state selected";
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
  return !isNaN(value) && value != "";
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
  coordinates.north = parseFloat(coordinates.north).toFixed(6);
  coordinates.south = parseFloat(coordinates.south).toFixed(6);
  coordinates.east = parseFloat(coordinates.east).toFixed(6);
  coordinates.west = parseFloat(coordinates.west).toFixed(6);
  return coordinates;
};
/*
  validates the input format of the list of site codes
  */
const validateSiteInputs = (sites, instance) => {
  if (instance.$store.getters.locationMode != locationMode.SITE) return true;
  let regex = /^((\d+),)*(\d+)$/; // 1 or more comma-separated 8 digit numbers
  if (!sites.replace(/\s/g, "").match(regex)) {
    return "site list in invalid format";
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

const validateSiteTypeInputs = (input, instance) => {
  if (!(input in instance.stateData)) {
    return "invalid site type selected";
  }
  return true;
};

/*
warns the user if they have no query parameters selected. This is the only pathological state not protected
 against from within the  ParamSelect component, because it is a valid interactive session state.
*/
const validateParamInputs = paramList => {
  if (paramList.length != 0) {
    return true;
  } else {
    return "parameter query requires between 1 and 100 parameters";
  }
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
  Warns the user if they have selected an invalid agency code.
*/
const validateAgencyInputs = (agency, instance) => {
  if (!instance.$store.getters.agencyActive) {
    return true;
  }
  let returnTrue = false;
  agencyData.forEach(element => {
    if (element["agency_cd"] == agency) {
      returnTrue = true;
    }
  });
  if (returnTrue) {
    return true;
  }

  return "invalid agency code";
};

/*
      function which validates user form inputs and updates vuex values to a query ready format. 
      This function should be run and observed to return true before anything in the body of requestData 
      is run. 
    */
const validateFormInputs = instance => {
  let stateStatus = validateStateInputs(
    instance.$store.getters.USStateName,
    instance
  );
  if (!(stateStatus === true)) {
    alert(stateStatus);
    return false;
  }
  let coordStatus = validateCoordinateInputs(
    instance.$store.getters.coordinates,
    instance
  );
  if (!(coordStatus === true)) {
    alert(coordStatus);
    return false;
  }

  let siteListStatus = validateSiteInputs(instance.sites, instance);
  if (!(siteListStatus === true)) {
    alert(siteListStatus);
    return false;
  }

  let HydroCodeStatus = validateHydroCodeInputs(
    instance.$store.getters.hydroCode,
    instance
  );
  if (!(HydroCodeStatus === true)) {
    alert(HydroCodeStatus);
    return false;
  }
  let paramStatus = validateParamInputs(instance.$store.getters.paramCodes);
  if (!(paramStatus === true)) {
    alert(paramStatus);
    return false;
  }

  let countyStatus = validateCountyInputs(
    instance.$store.getters.countyCode,
    instance
  );
  if (!(countyStatus === true)) {
    alert(countyStatus);
    return false;
  }

  let agencyStatus = validateAgencyInputs(
    instance.$store.getters.agencyCode,
    instance
  );
  if (!(agencyStatus === true)) {
    alert(agencyStatus); //todo update to notify when merging with dev-alert
    return false;
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
  validateSiteTypeInputs
};
