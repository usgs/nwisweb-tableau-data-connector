import { shallowMount, createLocalVue } from "@vue/test-utils";
import Main from "@/components/Main";
import { locationMode } from "../../src/enums.js";
import {
  validateStateInputs,
  validateCoordinateInputs,
  validateSiteInputs,
  validateHydroCodeInputs,
  validateCountyInputs,
  validateParamInputs,
  validateSiteTypeInputs,
  validateAgencyInputs,
  validateISO_8601Duration
} from "../../src/inputValidation.js";
import Vuex from "vuex";
import Notifications from "vue-notification";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Notifications);

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
    expect(validateStateInputs(state, wrapper.vm, { Montana: "MT" })).not.toBe(
      true
    );
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
    expect(validateStateInputs(state, wrapper.vm, { Montana: "MT" })).toBe(
      true
    );
  });

  test("validateStateInputs ignores an invalid state query when locationmode is not STATE", () => {
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
    expect(validateStateInputs(state, wrapper.vm)).toBe(true);
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
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "1",
      south: "are",
      west: "1",
      east: "2"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "2",
      south: "1",
      west: "not",
      east: "1"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
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
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "1",
      south: "",
      west: "1",
      east: "2"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "2",
      south: "1",
      west: "",
      east: "1"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "2",
      south: "1",
      west: "1",
      east: ""
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
  });
  test("validateCoordinateInputs successfully rejects out of bounds numbers", () => {
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
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "1",
      south: "-100",
      west: "1",
      east: "2"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "1",
      south: "1",
      west: "-200",
      east: "1"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "1",
      south: "1",
      west: "1",
      east: "200"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
  });
  test("validateCoordinateInputs successfully rejects invalid boundaries", () => {
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
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
    coordinates = {
      north: "2",
      south: "1",
      west: "1",
      east: "-1"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).not.toBe(true);
  });
  test("validateCoordinateInputs successfully accepts valid boundaries", () => {
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
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).toBe(true);
    coordinates = {
      north: "2.000000",
      south: "1.000000",
      west: "1.000000",
      east: "2.000000"
    };
    expect(validateCoordinateInputs(coordinates, wrapper.vm)).toBe(true);
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
    expect(validateSiteInputs(siteList, wrapper.vm)).toBe(true);
    siteList = "11111111  , 11112222";
    expect(validateSiteInputs(siteList, wrapper.vm)).toBe(true);
    siteList = "11112222";
    expect(validateSiteInputs(siteList, wrapper.vm)).toBe(true);
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
    expect(validateSiteInputs(siteList, wrapper.vm)).not.toBe(true);
    siteList = "11112,,,,,222";
    expect(validateSiteInputs(siteList, wrapper.vm)).not.toBe(true);
    siteList = ",11111111 , 11111111";
    expect(validateSiteInputs(siteList, wrapper.vm)).not.toBe(true);
    siteList = "11111111 ,11111111,1111111,";
    expect(validateSiteInputs(siteList, wrapper.vm)).not.toBe(true);
    siteList = "";
    expect(validateSiteInputs(siteList, wrapper.vm)).not.toBe(true);
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
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).toBe(true);
    hydroCode = "11,11111111,11111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).toBe(true);
    hydroCode = "11111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).toBe(true);
    hydroCode =
      "11,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).toBe(true);
    hydroCode =
      "11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).toBe(true);
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
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
    hydroCode = "11,1111111,11111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
    hydroCode = "1111111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
    hydroCode =
      "11,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
    hydroCode =
      "11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
    hydroCode =
      "11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,11111111,111111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
    hydroCode = "11,1111111a,11111111";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
    hydroCode = "1f";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
    hydroCode = "1111111f";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
    hydroCode = "1111111.";
    expect(validateHydroCodeInputs(hydroCode, wrapper.vm)).not.toBe(true);
  });

  /*
We're only testing the lower bound because other form validation is
done in CountySelect.vue
*/
  test("validateCountyInputs successfully rejects invalid params", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.COUNTY;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let countyCode = [];
    expect(validateCountyInputs(countyCode, wrapper.vm)).not.toBe(true);
  });
  test("validateCountyInputs successfully accepts valid params", () => {
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
    let wrapper = shallowMount(Main, { store, localVue });
    let countyCode = [];
    expect(validateCountyInputs(countyCode, wrapper.vm)).toBe(true);
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        locationMode: () => {
          return locationMode.COUNTY;
        }
      },
      actions: {}
    });
    wrapper = shallowMount(Main, { store, localVue });
    countyCode = ["test"];
    expect(validateCountyInputs(countyCode, wrapper.vm)).toBe(true);
  });

  /*
We're only testing the lower bound because other form validation is
done in ParamSelect.vue
*/
  test("validateParamInputs successfully rejects invalid params", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {},
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let paramCode = [];
    expect(validateParamInputs(paramCode, wrapper.vm)).not.toBe(true);
  });
  test("validateParamInputs successfully accepts valid params", () => {
    const store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {},
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let paramCode = ["test"];
    expect(validateParamInputs(paramCode, wrapper.vm)).toBe(true);
  });
  test("validateSiteTypeInputs rejects an invalid site type", () => {
    const store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        siteTypeListActive: () => {
          return true;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let siteType = "not a site type";
    expect(
      validateSiteTypeInputs(siteType, wrapper.vm, [
        { site_tp_cd: "validSiteType" }
      ])
    ).not.toBe(true);
  });

  test("validateSiteTypeInputs accepts a valid site type", () => {
    const store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        siteTypeListActive: () => {
          return true;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let siteType = "validSiteType";
    expect(
      validateSiteTypeInputs(siteType, wrapper.vm, [
        { site_tp_cd: "validSiteType" }
      ])
    ).toBe(true);
  });

  test("validateAgencyInputs rejects an invalid agency", () => {
    const store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        agencyActive: () => {
          return true;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let agency = "not an an agency";
    expect(
      validateAgencyInputs(agency, wrapper.vm, [{ agency_cd: "agencyA" }])
    ).not.toBe(true);
  });

  test("validateAgencyInputs accepts a valid agency", () => {
    const store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        agencyActive: () => {
          return true;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let agency = "agencyA";
    expect(
      validateAgencyInputs(agency, wrapper.vm, [{ agency_cd: "agencyA" }])
    ).toBe(true);
  });

  test("validateISO_8601Duration accepts compliant codes", () => {
    const store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        durationCodeActive: () => {
          return true;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    expect(validateISO_8601Duration("P1D", wrapper.vm)).toBe(true);
    expect(validateISO_8601Duration("P1M", wrapper.vm)).toBe(true);
    expect(validateISO_8601Duration("P1Y", wrapper.vm)).toBe(true);
    expect(validateISO_8601Duration("PT1M4534534534S", wrapper.vm)).toBe(true);
    expect(
      validateISO_8601Duration("P1W34324234234234234324DT435457384H", wrapper.vm)
    ).toBe(true);
    expect(validateISO_8601Duration("P4444M0000D", wrapper.vm)).toBe(true);
    expect(
      validateISO_8601Duration(
        "P35897345987Y48875M39875374WT3453454345435M587934598S",
        wrapper.vm
      )
    ).toBe(true);
    expect(
      validateISO_8601Duration(
        "P34573475347537534757477777475384Y9348239482309483248320948329DT349850934850934S",
        wrapper.vm
      )
    ).toBe(true);
  });
  test("validateISO_8601Duration rejects non-compliant codes", () => {
    const store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        durationCodeActive: () => {
          return true;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    expect(validateISO_8601Duration("P", wrapper.vm)).not.toBe(true);
    expect(validateISO_8601Duration("T", wrapper.vm)).not.toBe(true);
    expect(validateISO_8601Duration("T1S", wrapper.vm)).not.toBe(true);
    expect(validateISO_8601Duration("P32432S", wrapper.vm)).not.toBe(true);
    expect(validateISO_8601Duration("T32432SP45345M", wrapper.vm)).not.toBe(true);
    expect(validateISO_8601Duration("P234234D43534W", wrapper.vm)).not.toBe(true);
    expect(validateISO_8601Duration("PT345345S435345M", wrapper.vm)).not.toBe(true);
   

   
  });
});
