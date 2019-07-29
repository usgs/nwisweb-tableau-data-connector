import { shallowMount, createLocalVue } from "@vue/test-utils";
import CountySelect from "../../src/components/CountySelect.vue";
import Vuex from "vuex";
import Notifications from "vue-notification";
import VueTags from "vue-tags";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Notifications);

localVue.component("input-tags", VueTags);

describe("CountySelect", () => {
  let store;
  test("test getCounties with valid state name", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {},
      actions: {}
    });
    const wrapper = shallowMount(CountySelect, {
      store,
      localVue,
      propsData: {},
      stubs: ["input-tags"]
    });
    let counties = [
      {"country_cd": "US", "county_cd": "001", "county_nm": "Bristol County", "state_cd": "44"}, 
      {"country_cd": "US", "county_cd": "003", "county_nm": "Kent County", "state_cd": "44"}, 
      {"country_cd": "US", "county_cd": "005", "county_nm": "Newport County", "state_cd": "44"}, 
      {"country_cd": "US", "county_cd": "007", "county_nm": "Providence County", "state_cd": "44"}, 
      {"country_cd": "US", "county_cd": "009", "county_nm": "Washington County", "state_cd": "44"}
    ];
    expect(wrapper.vm.getCounties("Rhode Island")).toEqual(counties);
  });

  test("test getCounties with invalid state name", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {},
      actions: {}
    });
    const wrapper = shallowMount(CountySelect, {
      store,
      localVue,
      propsData: {},
      stubs: ["input-tags"]
    });
    expect(wrapper.vm.getCounties("Mayonnaise")).toEqual([]);
  });

  test("test getCountyNameFromCode with valid county code", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {},
      actions: {}
    });
    const wrapper = shallowMount(CountySelect, {
      store,
      localVue,
      propsData: {},
      stubs: ["input-tags"]
    });
    let countyCode = "12003";
    expect(wrapper.vm.getCountyNameFromCode(countyCode)).toEqual("Baker County");
  });

  test("test getCountyNameFromCode with invalid county code", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {},
      actions: {}
    });
    const wrapper = shallowMount(CountySelect, {
      store,
      localVue,
      propsData: {},
      stubs: ["input-tags"]
    });
    let countyCode = "!!!!!";
    expect(wrapper.vm.getCountyNameFromCode(countyCode)).toEqual("invalid");
  });
});
