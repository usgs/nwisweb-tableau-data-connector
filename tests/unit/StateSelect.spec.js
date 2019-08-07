import { shallowMount, createLocalVue } from "@vue/test-utils";
import StateSelect from "../../src/components/StateSelect.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock(
  "../../src/fetchedValues/states.json",
  () => {
    return { state1: "S1", state2: "S2" };
  },
  { virtual: true }
);

let store;
test("populateStateList behaves correctly", () => {
  store = new Vuex.Store({
    state: {},
    modules: {},
    getters: {},
    actions: {}
  });
  const wrapper = shallowMount(StateSelect, {
    store,
    localVue
  });

  let expectedResult = [
    { name: "state1", id: "state1" },
    { name: "state2", id: "state2" }
  ];

  wrapper.setData({ stateSearchList: [] });

  wrapper.vm.populateStateList();

  expect(wrapper.vm.stateSearchList).toEqual(expectedResult);
});

test("updateStateInput Behaves Correctly depending on input", () => {
  store = new Vuex.Store({
    state: {},
    modules: {},
    getters: {},
    actions: {}
  });
  const wrapper = shallowMount(StateSelect, {
    store,
    localVue
  });
  wrapper.vm.commitStateSelection = () => {};

  wrapper.setData({ state: "" });

  wrapper.vm.updateStateInput("Michigan");
  expect(wrapper.vm.state).toEqual("Michigan");
  wrapper.vm.updateStateInput(null);
  expect(wrapper.vm.state).toEqual("");
  wrapper.vm.updateStateInput(undefined);
  expect(wrapper.vm.state).toEqual("");
});
