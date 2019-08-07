import { shallowMount, createLocalVue } from "@vue/test-utils";
import AgencySelect from "../../src/components/AgencySelect.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock(
  "../../src/fetchedValues/agency.json",
  () => {
    return [
      { party_nm: "agency 1", agency_cd: "A1" },
      { party_nm: "agency 2", agency_cd: "A2" }
    ];
  },
  { virtual: true }
);

let store;
test("updateAgencyInput Behaves Correctly depending on input", () => {
  store = new Vuex.Store({
    state: {},
    modules: {},
    getters: {},
    actions: {}
  });
  const wrapper = shallowMount(AgencySelect, {
    store,
    localVue
  });

  wrapper.setData({ agency: "" });

  wrapper.vm.updateAgencyInput("USGS");

  expect(wrapper.vm.agency).toEqual("USGS");
  wrapper.vm.updateAgencyInput(null);
  expect(wrapper.vm.agency).toEqual("");
  wrapper.vm.updateAgencyInput(undefined);
  expect(wrapper.vm.agency).toEqual("");
});

test("populateAgencyList Correctly Populates an agency list", () => {
  store = new Vuex.Store({
    state: {},
    modules: {},
    getters: {},
    actions: {}
  });
  const wrapper = shallowMount(AgencySelect, {
    store,
    localVue
  });
  let expectedOutput = [
    { name: "agency 1", id: "A1" },
    { name: "agency 2", id: "A2" }
  ];
  expect(wrapper.vm.agencyList).toEqual(expectedOutput);
});
