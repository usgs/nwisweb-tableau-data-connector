jest.mock("../../src/fetchedValues/agency.json", () => ({}), { virtual: true });
jest.mock("../../src/fetchedValues/states.json", () => ({}), { virtual: true });
jest.mock("../../src/fetchedValues/siteTypes.json", () => ({}), {
  virtual: true
});
jest.mock("../../src/fetchedValues/counties.json", () => ({}), {
  virtual: true
});

jest.mock(
  "../../src/fetchedValues/locAquifer.json",
  () => {
    return [];
  },
  { virtual: true }
);

jest.mock("../../src/fetchedValues/fips.json", () => ({}), { virtual: true });

jest.mock("../../src/fetchedValues/aquiferAreas.json", () => ({}), {
  virtual: true
});

jest.mock(
  "../../src/fetchedValues/timezones.json",
  () => {
    return [];
  },
  { virtual: true }
);

jest.mock(
  "../../src/fetchedValues/paramTypes.json",
  () => {
    return [];
  },
  { virtual: true }
);

import { shallowMount, createLocalVue } from "@vue/test-utils";
import Main from "../../src/components/Main.vue";
import Vuex from "vuex";
import * as exports from "../../src/notifications.js";

const localVue = createLocalVue();
let store;

localVue.use(Vuex);

test("Browser warning is succesfully issued when system is accessed outside of Tableau", () => {
  store = new Vuex.Store({
    state: {},
    modules: {},
    getters: {},
    actions: {}
  });
  const wrapper = shallowMount(Main, {
    store,
    localVue
  });

  let resultVal = "";
  exports.notify = input => {
    resultVal = input;
  }; // checking to see what was notified
  const spy = jest.spyOn(exports, "notify");
  wrapper.vm.browserWarning();

  expect(spy).toHaveBeenCalled();
  expect(resultVal).toEqual(
    "The NWIS Tableau Web Data Connector must be accessed from Tableau desktop or Tableau server!"
  );
});
