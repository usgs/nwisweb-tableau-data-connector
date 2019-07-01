import { shallowMount, createLocalVue } from "@vue/test-utils";
import Main from "@/components/Main";
import { locationMode } from "../../src/enums.js";
import Vuex from "vuex";
const localVue = createLocalVue();
localVue.use(Vuex);

describe("Main", () => {
  let store;

  test("validateStateInputs rejects an invalid state query", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.STATE;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let state = "not a state";
    expect(wrapper.vm.validateStateInputs(state)).not.toBe(true);
  });

  test("validateStateInputs accepts a valid state query", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.STATE;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let state = "Montana";
    wrapper.vm.stateData = { Montana: "MT" };
    expect(wrapper.vm.validateStateInputs(state)).toBe(true);
  });

  test("validateStateInputs ingores an invalid state query when locationmode is not STATE", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.COORDS;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let state = "not a state";
    expect(wrapper.vm.validateStateInputs(state,locationMode.STATE)).toBe(true);
  });

  test("validateCoordinateInputs successfully rejects non-numeric parameters", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.COORDS;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let coordinates = {
      north: "these",
      south: "1",
      west: "1",
      east: "2"
    };
    expect(wrapper.vm.validateCoordinateInputs(coordinates)).not.toBe(true);
    coordinates = {
      north: "1",
      south: "are",
      west: "1",
      east: "2"
    };
    expect(wrapper.vm.validateCoordinateInputs(coordinates)).not.toBe(true);
    coordinates = {
      north: "2",
      south: "1",
      west: "not",
      east: "1"
    };
    expect(wrapper.vm.validateCoordinateInputs(coordinates)).not.toBe(true);
    coordinates = {
      north: "2",
      south: "1",
      west: "1",
      east: "coordinates"
    };
    coordinates = {
      north: "",
      south: "1",
      west: "1",
      east: "2"
    };
    expect(wrapper.vm.validateCoordinateInputs(coordinates)).not.toBe(true);
    coordinates = {
      north: "1",
      south: "",
      west: "1",
      east: "2"
    };
    expect(wrapper.vm.validateCoordinateInputs(coordinates)).not.toBe(true);
    coordinates = {
      north: "2",
      south: "1",
      west: "",
      east: "1"
    };
    expect(wrapper.vm.validateCoordinateInputs(coordinates)).not.toBe(true);
    coordinates = {
      north: "2",
      south: "1",
      west: "1",
      east: ""
    };
    expect(wrapper.vm.validateCoordinateInputs(coordinates)).not.toBe(true);
  });
  test("validateCoorinateInputs successfully rejects out of bounds numbers", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.COORDS;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let coordinates = {
      north: "100",
      south: "1",
      west: "1",
      east: "2"
    };
    expect(wrapper.vm.validateCoordinateInputs(coordinates)).not.toBe(true);
    coordinates = {
      north: "1",
      south: "-100",
      west: "1",
      east: "2"
    };
    expect(wrapper.vm.validateCoordinateInputs(coordinates)).not.toBe(true);
    coordinates = {
      north: "1",
      south: "1",
      west: "-200",
      east: "1"
    };
    expect(wrapper.vm.validateCoordinateInputs(coordinates)).not.toBe(true);
    coordinates = {
      north: "1",
      south: "1",
      west: "1",
      east: "200"
    };
    expect(wrapper.vm.validateCoordinateInputs(coordinates)).not.toBe(true);
  });
  test("validateCoorinateInputs successfully rejects invalid boundaries", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.COORDS;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let coordinates = {
      north: "-1",
      south: "1",
      west: "1",
      east: "2"
    };
    expect(wrapper.vm.validateCoordinateInputs(coordinates)).not.toBe(true);
    coordinates = {
      north: "2",
      south: "1",
      west: "1",
      east: "-1"
    };
    expect(wrapper.vm.validateCoordinateInputs(coordinates)).not.toBe(true);
  });
  test("validateCoorinateInputs successfully accepts valid boundaries", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.COORDS;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let coordinates = {
      north: "1",
      south: "-1",
      west: "-1",
      east: "1"
    };
    expect(wrapper.vm.validateCoordinateInputs(coordinates)).toBe(true);
    coordinates = {
      north: "2.000000",
      south: "1.000000",
      west: "1.000000",
      east: "2.000000"
    };
    expect(wrapper.vm.validateCoordinateInputs(coordinates)).toBe(true);
  });
  test("validateSiteInputs successfully accepts valid params", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.SITE;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let siteList = "11111111, 11111111  , 11112222";
    expect(wrapper.vm.validateSiteInputs(siteList)).toBe(true);
    siteList = "11111111  , 11112222";
    expect(wrapper.vm.validateSiteInputs(siteList)).toBe(true);
    siteList = "11112222";
    expect(wrapper.vm.validateSiteInputs(siteList)).toBe(true);
  });
  test("validateSiteInputs successfully rejects invalid params", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.SITE;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });

    let siteList = "";
    expect(wrapper.vm.validateSiteInputs(siteList)).not.toBe(true);
    siteList = "11112,,,,,222";
    expect(wrapper.vm.validateSiteInputs(siteList)).not.toBe(true);
    siteList = ",11111111 , 11111111";
    expect(wrapper.vm.validateSiteInputs(siteList)).not.toBe(true);
    siteList = "11111111 ,11111111,1111111,";
    expect(wrapper.vm.validateSiteInputs(siteList)).not.toBe(true);
    siteList = "";
    expect(wrapper.vm.validateSiteInputs(siteList)).not.toBe(true);
  });

  test("validateHydroCodeInputs successfully accepts valid params", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.HYDRO;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let hydroCode = "11";
    expect(wrapper.vm.validateHydroCodeInputs(hydroCode)).toBe(true);
    hydroCode = "11,11111111,11111111";
    expect(wrapper.vm.validateHydroCodeInputs(hydroCode)).toBe(true);
    hydroCode = "11111111";
    expect(wrapper.vm.validateHydroCodeInputs(hydroCode)).toBe(true);
    hydroCode =
      "11,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111";
    expect(wrapper.vm.validateHydroCodeInputs(hydroCode)).toBe(true);
    hydroCode =
      "11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111";
    expect(wrapper.vm.validateHydroCodeInputs(hydroCode)).toBe(true);
  });

  test("validateHydroCodeInputs successfully rejects invalid params", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.HYDRO;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let hydroCode = "1";
    expect(wrapper.vm.validateHydroCodeInputs(hydroCode)).not.toBe(true);
    hydroCode = "11,1111111,11111111";
    expect(wrapper.vm.validateHydroCodeInputs(hydroCode)).not.toBe(true);
    hydroCode = "1111111111";
    expect(wrapper.vm.validateHydroCodeInputs(hydroCode)).not.toBe(true);
    hydroCode =
      "11,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111";
    expect(wrapper.vm.validateHydroCodeInputs(hydroCode)).not.toBe(true);
    hydroCode =
      "11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111";
    expect(wrapper.vm.validateHydroCodeInputs(hydroCode)).not.toBe(true);
    hydroCode =
      "11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,111111111";
    expect(wrapper.vm.validateHydroCodeInputs(hydroCode)).not.toBe(true);
    hydroCode = "11,1111111a,11111111";
    expect(wrapper.vm.validateHydroCodeInputs(hydroCode)).not.toBe(true);
    hydroCode = "1f";
    expect(wrapper.vm.validateHydroCodeInputs(hydroCode)).not.toBe(true);
    hydroCode = "1111111f";
    expect(wrapper.vm.validateHydroCodeInputs(hydroCode)).not.toBe(true);
    hydroCode = "1111111.";
    expect(wrapper.vm.validateHydroCodeInputs(hydroCode)).not.toBe(true);
  });
});
