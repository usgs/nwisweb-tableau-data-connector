import { shallowMount, createLocalVue } from "@vue/test-utils";
import AquiferInputs from "../../src/components/AquiferInputs.vue";
import Vuex from "vuex";
import Notifications from "vue-notification";
import VueTags from "vue-tags";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Notifications);
localVue.component("input-tags", VueTags);

jest.mock(
  "../../src/fetchedValues/locAquifer.json",
  () => {
    return [
      { state_cd: "01", aqfr_cd: "100CNZC", aqfr_nm: "Cenozoic Erathem" },
      {
        state_cd: "01",
        aqfr_cd: "110QRNR",
        aqfr_nm: "Quaternary System"
      },
      {
        state_cd: "01",
        aqfr_cd: "110QRRT",
        aqfr_nm: "Quaternary-Tertiary Systems"
      }
    ];
  },
  { virtual: true }
);

jest.mock("../../src/fetchedValues/states.json", () => ({ Alabama: "AL" }), {
  virtual: true
});

jest.mock("../../src/fetchedValues/fips.json", () => ({ Alabama: "01" }), {
  virtual: true
});

jest.mock("../../src/fetchedValues/aquiferAreas.json", () => ({}), {
  virtual: true
});

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
      { state_cd: "01", aqfr_cd: "100CNZC", aqfr_nm: "Cenozoic Erathem" },
      {
        state_cd: "01",
        aqfr_cd: "110QRNR",
        aqfr_nm: "Quaternary System"
      },
      {
        state_cd: "01",
        aqfr_cd: "110QRRT",
        aqfr_nm: "Quaternary-Tertiary Systems"
      }
    ];
    expect(wrapper.vm.getLocAquifers("Alabama")).toEqual(locAquifers);
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
    let locAqCode = "01:110QRRT";
    expect(wrapper.vm.verifyLocAqName(locAqCode)).toEqual(locAqCode);
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
    expect(wrapper.vm.verifyLocAqName("26:ABCDEFGH")).toEqual("Invalid.");
  });
});
