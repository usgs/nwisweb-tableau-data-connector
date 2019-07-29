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
      {"country_cd": "US", "county_cd": "001", "county_nm": "Bristol County", "state_cd": "44"}, 
      {"country_cd": "US", "county_cd": "003", "county_nm": "Kent County", "state_cd": "44"}, 
      {"country_cd": "US", "county_cd": "005", "county_nm": "Newport County", "state_cd": "44"}, 
      {"country_cd": "US", "county_cd": "007", "county_nm": "Providence County", "state_cd": "44"}, 
      {"country_cd": "US", "county_cd": "009", "county_nm": "Washington County", "state_cd": "44"}
    ];
    expect(wrapper.vm.getLocAquifers("Rhode Island")).toEqual(locAquifers);
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
describe("getLocAqNameFromCode", () => {
  let store;
  test("test getLocAqNameFromCode with valid local aquifer code", () => {
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
    let countyCode = "12003";
    expect(wrapper.vm.getLocAqNameFromCode(countyCode)).toEqual("Baker County");
  });

  test("test getLocAqNameFromCode with invalid local aquifer code", () => {
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
    let countyCode = "!!!!!";
    expect(wrapper.vm.getLocAqNameFromCode(countyCode)).toEqual("invalid");
  });
});
