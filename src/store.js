import Vue from "vue";
import Vuex from "vuex";
import { locationMode } from "./enums.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    state: "",
    siteTypeListActive: false,
    agencyActive: false,
    durationCodeActive: false,
    modifiedSinceCodeActive: false,
    modifiedSinceCode: "",
    agencyCode: "",
    siteType: [],
    hydroCode: "",
    countyCode: [],
    paramCodes: [],
    durationCode: "",
    locationMode: locationMode.SITE,
    coordinates: {}
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
    }
  }
});
