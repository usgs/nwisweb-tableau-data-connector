import Vue from "vue";
import Vuex from "vuex";
import { locationMode } from "./enums.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    state: "",
    siteTypeListActive: false,
    agencyActive: false,
    agencyCode: "",
    siteType: [],
    hydroCode: "",
    countyCode: [],
    paramCodes: [],
    locationMode: locationMode.SITE,
    coordinates: {},
    natAquiferActive: false,
    natAquifer: "",
    locAquiferActive: false,
    locAquifer: "",
    wellMinActive: false,
    wellMaxActive: false,
    holeMinActive: false,
    holeMaxActive: false,
    GWSiteAttrDepths: {}
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
    }
  }
});
