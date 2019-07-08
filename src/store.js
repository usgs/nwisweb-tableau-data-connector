import Vue from "vue";
import Vuex from "vuex";
import { locationMode } from "./enums.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    state: "",
    siteType: "",
    hydroCode: "",
    countyCode: "",
    locationMode: locationMode.SITE,
    coordinates: {},
    validStateInput: false,
    validCoordsInput: false,
    formValidated: false
  },
  mutations: {
    changeUSStateName: (state, USStateName) => {
      state.state = USStateName;
    },
    changeLocationMode: (state, newLocationMode) => {
      state.locationMode = newLocationMode;
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
    coordinates: state => {
      return state.coordinates;
    },
    hydroCode: state => {
      return state.hydroCode;
    },
    countyCode: state => {
      return state.countyCode;
    }
  }
});
