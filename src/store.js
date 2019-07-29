import Vue from "vue";
import Vuex from "vuex";
import { locationMode } from "./enums.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    state: "",
    siteTypeListActive: false,
    agencyActive: false,
    sites: "",
    watershedUpperAreaBoundsActive: false,
    watershedLowerAreaBoundsActive: false,
    altitudeBounds: {},
    upperAltitudeBoundActive: false,
    lowerAltitudeBoundActive: false,
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
    natAquiferActive: false,
    natAquifer: "",
    locAquiferActive: false,
    locAquifer: [],
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
    changeSites: (state, newSites) => {
      state.sites = newSites;
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
    changeLocAquiferActive: (state, newLocAquiferActivation) => {
      state.locAquiferActive = newLocAquiferActivation;
    },
    changeLocAquifer: (state, newLocAquifer) => {
      state.locAquifer = newLocAquifer;
    },
    changeNatAquiferActive: (state, newNatAquiferActivation) => {
      state.natAquiferActive = newNatAquiferActivation;
    },
    changeNatAquifer: (state, newNatAquifer) => {
      state.natAquifer = newNatAquifer;
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
    changeAltitudeBounds: (state, newAltitudebounds) => {
      state.altitudeBounds = newAltitudebounds;
    },
    changeUpperAltitudeBoundActive: (state, newUpperAltitudeBoundActive) => {
      state.upperAltitudeBoundActive = newUpperAltitudeBoundActive;
    },
    changeLowerAltitudeBoundActive: (state, newLowerAltitudeBoundsActive) => {
      state.lowerAltitudeBoundActive = newLowerAltitudeBoundsActive;
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
    sites: state => {
      return state.sites;
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
    locAquiferActive: state => {
      return state.locAquiferActive;
    },
    locAquifer: state => {
      return state.locAquifer;
    },
    natAquiferActive: state => {
      return state.natAquiferActive;
    },
    natAquifer: state => {
      return state.natAquifer;
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
    altitudeBounds: state => {
      return state.altitudeBounds;
    },
    upperAltitudeBoundActive: state => {
      return state.upperAltitudeBoundActive;
    },
    lowerAltitudeBoundActive: state => {
      return state.lowerAltitudeBoundActive;
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
