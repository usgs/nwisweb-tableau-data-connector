import { shallowMount, createLocalVue } from "@vue/test-utils";
import AquiferInputs from "../../src/components/AquiferInputs.vue";
import Vuex from "vuex";
import Notifications from "vue-notification";
import VueTags from "vue-tags";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Notifications);
localVue.component("input-tags", VueTags);

describe("getLocAquifers", () => {
  let store;
  test("test getLocAquifers with valid state name", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {},
      actions: {}
    });
    const wrapper = shallowMount(AquiferInputs, {
      store,
      localVue,
      propsData: {},
      stubs: ["input-tags"]
    });
    let locAquifers = [
      {
        aqfr_cd: "112EVRS",
        aqfr_nm: "Everson Interstade of Fraser Glaciation",
        state_cd: "96"
      },
      { aqfr_cd: "112GLCV", aqfr_nm: "Glacio-Fluviatile", state_cd: "96" },
      {
        aqfr_cd: "112SUMS",
        aqfr_nm: "Sumas Drift of Fraser Glaciation",
        state_cd: "96"
      },
      { aqfr_cd: "BEDROCK", aqfr_nm: "Bedrock", state_cd: "96" }
    ];
    jest.mock(
      "../../fetchedValues/locAquifer.json",
      () => ({
        locAquiferJSON: [
          { state_cd: "01", aqfr_cd: "100CNZC", aqfr_nm: "Cenozoic Erathem" },
          { state_cd: "01", aqfr_cd: "110QRNR", aqfr_nm: "Quaternary System" },
          { state_cd: "01", aqfr_cd: "110QRRT", aqfr_nm: "Quaternary-Tertiary Systems" }
        ]
      }),
      { virtual: true }
    );
    expect(wrapper.vm.getLocAquifers("United States of America")).toEqual(locAquifers);
  });

  test("test getLocAquifers with invalid state name", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {},
      actions: {}
    });
    const wrapper = shallowMount(AquiferInputs, {
      store,
      localVue,
      propsData: {},
      stubs: ["input-tags"]
    });
    expect(wrapper.vm.getLocAquifers("Hamburger")).toEqual([]);
  });
});
describe("verifyLocAqName", () => {
  let store;
  test("test verifyLocAqName with valid local aquifer code", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {},
      actions: {}
    });
    const wrapper = shallowMount(AquiferInputs, {
      store,
      localVue,
      propsData: {},
      stubs: ["input-tags"]
    });
    let locAqCode = "05:112TRRC";
    expect(wrapper.vm.verifyLocAqName(locAqCode)).toEqual("05:112TRRC");
  });

  test("test verifyLocAqName with invalid local aquifer code", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {},
      actions: {}
    });
    const wrapper = shallowMount(AquiferInputs, {
      store,
      localVue,
      propsData: {},
      stubs: ["input-tags"]
    });
    expect(wrapper.vm.verifyLocAqName("99:BADCODE")).toEqual("Invalid.");
    expect(wrapper.vm.verifyLocAqName("05:ABCDEFGH")).toEqual("Invalid.");
  });
});
