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
  validateGroundWaterSiteInputs,
  validateWatershedAreaBoundaries,
  validateISO_8601Duration,
  validateTemporalRange,
  validateTimeCodes
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
    let siteList = "1111441111, 44444444,11111134511  , 111123454222";
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
    let paramCode = new Array(150);
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

  test("validateISO_8601Duration accepts compliant codes and non-compliant codes when field is inactive", () => {
    expect(validateISO_8601Duration("P1D", "", true)).toBe(true);
    expect(validateISO_8601Duration("PT1M4534534534S", "", true)).toBe(true);
    expect(
      validateISO_8601Duration("P1W34324234234234234324DT435457384H", "", true)
    ).toBe(true);
    expect(validateISO_8601Duration("P44440000D", "", true)).toBe(true);
    expect(
      validateISO_8601Duration(
        "P358973459874887539875374WT3453454345435M587934598S",
        "",
        true
      )
    ).toBe(true);
    expect(
      validateISO_8601Duration(
        "P345734753475375347574777774753849348239482309483248320948329DT349850934850934S",
        "",
        true
      )
    ).toBe(true);
    expect(
      validateISO_8601Duration(
        "THIS IS CERTAINLY NOT COMPLIANT WITH ISO-8601",
        "",
        false
      )
    ).toBe(true);
  });
  test("validateISO_8601Duration rejects non-compliant codes", () => {
    expect(validateISO_8601Duration("P", "", true)).not.toBe(true);
    expect(validateISO_8601Duration("T", "", true)).not.toBe(true);
    expect(validateISO_8601Duration("T1S", "", true)).not.toBe(true);
    expect(validateISO_8601Duration("P32432S", "", true)).not.toBe(true);
    expect(validateISO_8601Duration("P1Y", "", true)).not.toBe(true);
    expect(validateISO_8601Duration("P1M", "", true)).not.toBe(true);
    expect(validateISO_8601Duration("T32432SP45345M", "", true)).not.toBe(true);
    expect(validateISO_8601Duration("P234234D43534W", "", true)).not.toBe(true);
    expect(validateISO_8601Duration("PT345345S435345M", "", true)).not.toBe(
      true
    );
  });

  test("validateTemporalRange accepts valid temporal query configurations", () => {
    let store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        temporalRangeData: () => {
          return {
            startDateTime: "2019-07-09T14:59:00.000Z",
            endDateTime: "2019-07-10T15:04:00.000Z",
            timeZone: "-0430"
          };
        },
        temporalRangeActive: () => {
          return true;
        },
        modifiedSinceCodeActive: () => {
          return false;
        },
        durationCodeActive: () => {
          return false;
        }
      },
      actions: {}
    });
    let wrapper = shallowMount(Main, { store, localVue });
    expect(
      validateTemporalRange(
        wrapper.vm.$store.getters.temporalRangeData,
        wrapper.vm
      )
    ).toBe(true);
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        temporalRangeData: () => {
          return {
            startDateTime: "",
            endDateTime: "",
            timeZone: ""
          };
        },
        temporalRangeActive: () => {
          return false;
        },
        modifiedSinceCodeActive: () => {
          return false;
        },
        durationCodeActive: () => {
          return false;
        }
      },
      actions: {}
    });
    wrapper = shallowMount(Main, { store, localVue });
    expect(
      validateTemporalRange(
        wrapper.vm.$store.getters.temporalRangeData,
        wrapper.vm
      )
    ).toBe(true);
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        temporalRangeData: () => {
          return {
            startDateTime: "2019-07-09T15:00:00.000Z",
            endDateTime: "2019-07-09T15:01:00.000Z",
            timeZone: "-0400"
          };
        },
        temporalRangeActive: () => {
          return true;
        },
        modifiedSinceCodeActive: () => {
          return false;
        },
        durationCodeActive: () => {
          return false;
        }
      },
      actions: {}
    });
    wrapper = shallowMount(Main, { store, localVue });
    expect(
      validateTemporalRange(
        wrapper.vm.$store.getters.temporalRangeData,
        wrapper.vm
      )
    ).toBe(true);
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        temporalRangeData: () => {
          return {
            startDateTime: "2019-07-09T15:00:00.000Z",
            endDateTime: "2019-07-10T15:00:00.000Z",
            timeZone: "+1000"
          };
        },
        temporalRangeActive: () => {
          return true;
        },
        modifiedSinceCodeActive: () => {
          return true;
        },
        durationCodeActive: () => {
          return false;
        }
      },
      actions: {}
    });
    wrapper = shallowMount(Main, { store, localVue });
    expect(
      validateTemporalRange(
        wrapper.vm.$store.getters.temporalRangeData,
        wrapper.vm
      )
    ).toBe(true);

    wrapper = shallowMount(Main, { store, localVue });
    expect(
      validateTemporalRange(
        wrapper.vm.$store.getters.temporalRangeData,
        wrapper.vm
      )
    ).toBe(true);
  });

  test("validateTemporalRange rejects invalid temporal query configurations", () => {
    let store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        temporalRangeData: () => {
          return {
            startDateTime: "2019-07-09T15:01:00.000Z",
            endDateTime: "2019-07-09T15:00:00.000Z",
            timeZone: "-0500"
          };
        },
        temporalRangeActive: () => {
          return true;
        },
        modifiedSinceCodeActive: () => {
          return false;
        },
        durationCodeActive: () => {
          return true;
        }
      },
      actions: {}
    });
    let wrapper = shallowMount(Main, { store, localVue });
    expect(
      validateTemporalRange(
        wrapper.vm.$store.getters.temporalRangeData,
        wrapper.vm
      )
    ).not.toBe(true);

    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        temporalRangeData: () => {
          return {
            startDateTime: "2019-07-09T15:01:00.000Z",
            endDateTime: "2019-07-09T15:00:00.000Z",
            timeZone: "-0530"
          };
        },
        temporalRangeActive: () => {
          return true;
        },
        modifiedSinceCodeActive: () => {
          return false;
        },
        durationCodeActive: () => {
          return false;
        }
      },
      actions: {}
    });
    wrapper = shallowMount(Main, { store, localVue });
    expect(
      validateTemporalRange(
        wrapper.vm.$store.getters.temporalRangeData,
        wrapper.vm
      )
    ).not.toBe(true);

    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        temporalRangeData: () => {
          return {
            startDateTime: "",
            endDateTime: "2019-07-09T15:00:00.000Z",
            timeZone: "-0400"
          };
        },
        temporalRangeActive: () => {
          return true;
        },
        modifiedSinceCodeActive: () => {
          return false;
        },
        durationCodeActive: () => {
          return false;
        }
      },
      actions: {}
    });
    wrapper = shallowMount(Main, { store, localVue });
    expect(
      validateTemporalRange(
        wrapper.vm.$store.getters.temporalRangeData,
        wrapper.vm
      )
    ).not.toBe(true);

    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        temporalRangeData: () => {
          return {
            startDateTime: "2019-07-09T15:01:00.000Z",
            endDateTime: "2019-07-09T15:00:00.000Z",
            timeZone: "-0500"
          };
        },
        temporalRangeActive: () => {
          return true;
        },
        modifiedSinceCodeActive: () => {
          return false;
        },
        durationCodeActive: () => {
          return false;
        }
      },
      actions: {}
    });
    wrapper = shallowMount(Main, { store, localVue });
    expect(
      validateTemporalRange(
        wrapper.vm.$store.getters.temporalRangeData,
        wrapper.vm
      )
    ).not.toBe(true);

    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        temporalRangeData: () => {
          return {
            startDateTime: "2019-07-09T15:01:00.000Z",
            endDateTime: "",
            timeZone: "-0500"
          };
        },
        temporalRangeActive: () => {
          return true;
        },
        modifiedSinceCodeActive: () => {
          return false;
        },
        durationCodeActive: () => {
          return false;
        }
      },
      actions: {}
    });
    wrapper = shallowMount(Main, { store, localVue });
    expect(
      validateTemporalRange(
        wrapper.vm.$store.getters.temporalRangeData,
        wrapper.vm
      )
    ).not.toBe(true);

    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        temporalRangeData: () => {
          return {
            startDateTime: "2019-07-09T15:01:00.000Z",
            endDateTime: "2019-07-09T15:00:00.000Z",
            timeZone: ""
          };
        },
        temporalRangeActive: () => {
          return true;
        },
        modifiedSinceCodeActive: () => {
          return false;
        },
        durationCodeActive: () => {
          return false;
        }
      },
      actions: {}
    });
    wrapper = shallowMount(Main, { store, localVue });
    expect(
      validateTemporalRange(
        wrapper.vm.$store.getters.temporalRangeData,
        wrapper.vm
      )
    ).not.toBe(true);
  });

  test("validateTimeCodes accepts compliant codes and non-compliant codes when field is inactive", () => {
    expect(
      validateTimeCodes(
        {
          startDateTime: "1111-34-45T45:45Z",
          endDateTime: "3213-34-45T45:45Z"
        },
        true
      )
    ).toBe(true);
    expect(
      validateTimeCodes(
        {
          startDateTime: "5555-44-33T22:11Z",
          endDateTime: "5443-34-45T65:45Z"
        },
        true
      )
    ).toBe(true);
    expect(
      validateTimeCodes(
        { startDateTime: "not valid", endDateTime: "not valid" },
        false
      )
    ).toBe(true);
  });
  test("validateISO_8601Duration rejects non-compliant codes", () => {
    expect(
      validateTimeCodes(
        {
          startDateTime: "111d1-34-45T45:45Z",
          endDateTime: "3213-34-45T45:45Z"
        },
        true
      )
    ).not.toBe(true);
    expect(
      validateTimeCodes(
        {
          startDateTime: "11141-34-45T45:45Z",
          endDateTime: "3213-34-45G45:45Z"
        },
        true
      )
    ).not.toBe(true);
    expect(
      validateTimeCodes(
        {
          startDateTime: "1111-34-45T45:45Z",
          endDateTime: "32143-34-45T45:45Z"
        },
        true
      )
    ).not.toBe(true);
    expect(
      validateTimeCodes({ startDateTime: "", endDateTime: "" }, true)
    ).not.toBe(true);
  });

  test("validateGroundWaterSiteInputs successfully rejects non-numeric parameters", () => {
    let store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        wellMinActive: () => {
          return true;
        },
        wellMaxActive: () => {
          return true;
        },
        holeMinActive: () => {
          return true;
        },
        holeMaxActive: () => {
          return true;
        }
      },
      actions: {}
    });
    let wrapper = shallowMount(Main, { store, localVue });
    let GWSiteAttrDepths = {
      wellMin: "these",
      wellMax: "100",
      holeMin: "10",
      holeMax: "100"
    };
    expect(
      validateGroundWaterSiteInputs(GWSiteAttrDepths, wrapper.vm)
    ).not.toBe(true);
    GWSiteAttrDepths = {
      wellMin: "10",
      wellMax: "are",
      holeMin: "10",
      holeMax: "100"
    };
    expect(
      validateGroundWaterSiteInputs(GWSiteAttrDepths, wrapper.vm)
    ).not.toBe(true);
    GWSiteAttrDepths = {
      wellMin: "10",
      wellMax: "100",
      holeMin: "not",
      holeMax: "100"
    };
    expect(
      validateGroundWaterSiteInputs(GWSiteAttrDepths, wrapper.vm)
    ).not.toBe(true);
    GWSiteAttrDepths = {
      wellMin: "10",
      wellMax: "100",
      holeMin: "10",
      holeMax: "numbers"
    };
    expect(
      validateGroundWaterSiteInputs(GWSiteAttrDepths, wrapper.vm)
    ).not.toBe(true);
  });

  test("validateGroundWaterSiteInputs rejects blank parameters", () => {
    let store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        wellMinActive: () => {
          return true;
        },
        wellMaxActive: () => {
          return true;
        },
        holeMinActive: () => {
          return true;
        },
        holeMaxActive: () => {
          return true;
        }
      },
      actions: {}
    });
    let wrapper = shallowMount(Main, { store, localVue });
    let GWSiteAttrDepths = {
      wellMin: "",
      wellMax: "100",
      holeMin: "10",
      holeMax: "100"
    };
    expect(
      validateGroundWaterSiteInputs(GWSiteAttrDepths, wrapper.vm)
    ).not.toBe(true);
    GWSiteAttrDepths = {
      wellMin: "10",
      wellMax: "",
      holeMin: "10",
      holeMax: "100"
    };
    expect(
      validateGroundWaterSiteInputs(GWSiteAttrDepths, wrapper.vm)
    ).not.toBe(true);
    GWSiteAttrDepths = {
      wellMin: "10",
      wellMax: "100",
      holeMin: "",
      holeMax: "100"
    };
    expect(
      validateGroundWaterSiteInputs(GWSiteAttrDepths, wrapper.vm)
    ).not.toBe(true);
    GWSiteAttrDepths = {
      wellMin: "10",
      wellMax: "100",
      holeMin: "10",
      holeMax: ""
    };
    expect(
      validateGroundWaterSiteInputs(GWSiteAttrDepths, wrapper.vm)
    ).not.toBe(true);
  });

  test("validateGroundWaterSiteInputs rejects minimum depth that is larger than a maximum depth", () => {
    let store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        wellMinActive: () => {
          return true;
        },
        wellMaxActive: () => {
          return true;
        },
        holeMinActive: () => {
          return true;
        },
        holeMaxActive: () => {
          return true;
        }
      },
      actions: {}
    });
    let wrapper = shallowMount(Main, { store, localVue });
    let GWSiteAttrDepths = {
      wellMin: "100",
      wellMax: "10",
      holeMin: "10",
      holeMax: "100"
    };
    expect(
      validateGroundWaterSiteInputs(GWSiteAttrDepths, wrapper.vm)
    ).not.toBe(true);
    GWSiteAttrDepths = {
      wellMin: "10",
      wellMax: "100",
      holeMin: "100",
      holeMax: "10"
    };
    expect(
      validateGroundWaterSiteInputs(GWSiteAttrDepths, wrapper.vm)
    ).not.toBe(true);
  });

  test("validateWatershedAreaBoundaries rejects invalid inputs", () => {
    const store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        watershedUpperAreaBoundsActive: () => {
          return true;
        },
        watershedLowerAreaBoundsActive: () => {
          return true;
        }
      },
      actions: {}
    });
    const wrapper = shallowMount(Main, { store, localVue });
    let bounds = {
      upperAreaBound: "22",
      lowerAreaBound: "29"
    };
    expect(validateWatershedAreaBoundaries(bounds, wrapper.vm)).not.toBe(true);
    bounds = {
      upperAreaBound: "",
      lowerAreaBound: "29"
    };
    expect(validateWatershedAreaBoundaries(bounds, wrapper.vm)).not.toBe(true);
    bounds = {
      upperAreaBound: "432432",
      lowerAreaBound: "-3453434"
    };
    expect(validateWatershedAreaBoundaries(bounds, wrapper.vm)).not.toBe(true);
    bounds = {
      upperAreaBound: "432432",
      lowerAreaBound: "-3453434"
    };
    expect(validateWatershedAreaBoundaries(bounds, wrapper.vm)).not.toBe(true);
    bounds = {
      upperAreaBound: "撿ꪐ릸蹐幱쮼�鵣⚫쑚䣘",
      lowerAreaBound: "豼繖䝶ꕄ捂᪛�ᙋ筪�ᨆ绽寜닅ᘴ侧턃Ｉ鱐뺸�ꗯ齧夼궾꧛କ"
    };
    expect(validateWatershedAreaBoundaries(bounds, wrapper.vm)).not.toBe(true);
  });

  test("validateWatershedAreaBoundaries accepts valid inputs", () => {
    let store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        watershedUpperAreaBoundsActive: () => {
          return false;
        },
        watershedLowerAreaBoundsActive: () => {
          return false;
        }
      },
      actions: {}
    });
    let wrapper = shallowMount(Main, { store, localVue });
    let bounds = {
      upperAreaBound: "asdfdsfa",
      lowerAreaBound: "asdfsdf"
    };
    expect(validateWatershedAreaBoundaries(bounds, wrapper.vm)).toBe(true);
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {
        watershedUpperAreaBoundsActive: () => {
          return true;
        },
        watershedLowerAreaBoundsActive: () => {
          return false;
        }
      },
      actions: {}
    });
    wrapper = shallowMount(Main, { store, localVue });
    bounds = {
      upperAreaBound: "23",
      lowerAreaBound: "gsdfgsdfg"
    };
    expect(validateWatershedAreaBoundaries(bounds, wrapper.vm)).toBe(true);
    bounds = {
      upperAreaBound: "1",
      lowerAreaBound: "2"
    };
    expect(validateWatershedAreaBoundaries(bounds, wrapper.vm)).toBe(true);
  });
});
