import Vue from "vue";
import Vuex from "vuex";
import { locationMode } from "./enums.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    state: "",
    siteTypeListActive: false,
    agencyActive: false,
    watershedUpperAreaBoundsActive: false,
    watershedLowerAreaBoundsActive: false,
    durationCodeActive: false,
    modifiedSinceCodeActive: false,
    temporalRangeActive: false,
    modifiedSinceCode: "",
    agencyCode: "",
    siteType: [],
    hydroCode: "",
    countyCode: [],
    paramCodes: [],
    temporalRangeData: {
      startDateTime: "",
      endDateTime: "",
      timeZone: ""
    },
    durationCode: "",
    locationMode: locationMode.SITE,
    coordinates: {},
    wellMinActive: false,
    wellMaxActive: false,
    holeMinActive: false,
    holeMaxActive: false,
    GWSiteAttrDepths: {},
    siteStatus: "all",
    watershedAreaBounds: {}
  },
  mutations: {
    changeUSStateName: (state, USStateName) => {
      state.state = USStateName;
    },
    changeLocationMode: (state, newLocationMode) => {
      state.locationMode = newLocationMode;
    },
    changeSiteTypeListActive: (state, siteTypeListActive) => {
      state.siteTypeListActive = siteTypeListActive;
    },
    changeSiteType: (state, siteType) => {
      state.siteType = siteType;
    },
    changeCoordinates: (state, newCoordinates) => {
      state.coordinates = newCoordinates;
    },
    changeHydroCode: (state, newHydroCode) => {
      state.hydroCode = newHydroCode;
    },
    changeCountyCode: (state, newCountyCode) => {
      state.countyCode = newCountyCode;
    },
    changeParamCodes: (state, newParamCodes) => {
      state.paramCodes = newParamCodes;
    },
    changeAgencyCode: (state, newAgencyCode) => {
      state.agencyCode = newAgencyCode;
    },
    changeAgencyActive: (state, newAgencyActivationState) => {
      state.agencyActive = newAgencyActivationState;
    },
    changeWellMinActive: (state, newWellMinActivation) => {
      state.wellMinActive = newWellMinActivation;
    },
    changeWellMaxActive: (state, newWellMaxActivation) => {
      state.wellMaxActive = newWellMaxActivation;
    },
    changeHoleMinActive: (state, newHoleMinActivation) => {
      state.holeMinActive = newHoleMinActivation;
    },
    changeHoleMaxActive: (state, newHoleMaxActivation) => {
      state.holeMaxActive = newHoleMaxActivation;
    },
    changeGWSiteAttrDepths: (state, newGWSiteAttrDepths) => {
      state.GWSiteAttrDepths = newGWSiteAttrDepths;
    },
    changeSiteStatus: (state, newSiteStatus) => {
      state.siteStatus = newSiteStatus;
    },
    changeWatershedAreaBounds: (state, newAreaBounds) => {
      state.watershedAreaBounds = newAreaBounds;
    },
    changeUpperWatershedAreaBoundsActive: (state, newActivityState) => {
      state.watershedUpperAreaBoundsActive = newActivityState;
    },
    changeLowerWatershedAreaBoundsActive: (state, newActivityState) => {
      state.watershedLowerAreaBoundsActive = newActivityState;
    },
    changeDurationCodeActive: (state, newDurationCodeActivationState) => {
      state.durationCodeActive = newDurationCodeActivationState;
    },
    changeDurationCode: (state, newDurationCode) => {
      state.durationCode = newDurationCode;
    },
    changeModifiedSinceCode: (state, newModifiedSinceCode) => {
      state.modifiedSinceCode = newModifiedSinceCode;
    },
    changeModifiedSinceCodeActive: (
      state,
      newModifiedSinceCodeActivationState
    ) => {
      state.modifiedSinceCodeActive = newModifiedSinceCodeActivationState;
    },
    changeTemporalRangeActive: (state, newTemporalRangeActivationStatus) => {
      state.temporalRangeActive = newTemporalRangeActivationStatus;
    },
    changeStartDateTime: (state, newStartDateTime) => {
      state.temporalRangeData.startDateTime = newStartDateTime;
    },
    changeEndDateTime: (state, newEndDateTime) => {
      state.temporalRangeData.endDateTime = newEndDateTime;
    },
    changeTimeZone: (state, newTimeZone) => {
      state.temporalRangeData.timeZone = newTimeZone;
    }
  },
  actions: {},
  getters: {
    USStateName: state => {
      return state.state;
    },
    locationMode: state => {
      return state.locationMode;
    },
    siteType: state => {
      return state.siteType;
    },
    siteTypeListActive: state => {
      return state.siteTypeListActive;
    },
    coordinates: state => {
      return state.coordinates;
    },
    hydroCode: state => {
      return state.hydroCode;
    },
    countyCode: state => {
      return state.countyCode;
    },
    paramCodes: state => {
      return state.paramCodes;
    },
    agencyCode: state => {
      return state.agencyCode;
    },
    agencyActive: state => {
      return state.agencyActive;
    },
    wellMinActive: state => {
      return state.wellMinActive;
    },
    wellMaxActive: state => {
      return state.wellMaxActive;
    },
    holeMinActive: state => {
      return state.holeMinActive;
    },
    holeMaxActive: state => {
      return state.holeMaxActive;
    },
    GWSiteAttrDepths: state => {
      return state.GWSiteAttrDepths;
    },
    siteStatus: state => {
      return state.siteStatus;
    },
    watershedAreaBounds: state => {
      return state.watershedAreaBounds;
    },
    watershedUpperAreaBoundsActive: state => {
      return state.watershedUpperAreaBoundsActive;
    },
    watershedLowerAreaBoundsActive: state => {
      return state.watershedLowerAreaBoundsActive;
    },
    durationCodeActive: state => {
      return state.durationCodeActive;
    },
    durationCode: state => {
      return state.durationCode;
    },
    modifiedSinceCode: state => {
      return state.modifiedSinceCode;
    },
    modifiedSinceCodeActive: state => {
      return state.modifiedSinceCodeActive;
    },
    temporalRangeActive: state => {
      return state.temporalRangeActive;
    },
    temporalRangeData: state => {
      return state.temporalRangeData;
    }
  }
});
