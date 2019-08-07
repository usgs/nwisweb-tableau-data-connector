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

let resultVal = "";
exports.notify = input => {
  resultVal = input;
}; // checking to see what was notified

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

  const spy = jest.spyOn(exports, "notify");
  wrapper.vm.browserWarning();

  expect(spy).toHaveBeenCalled();
  expect(resultVal).toEqual(
    "The NWIS Tableau Web Data Connector must be accessed from Tableau desktop or Tableau server!"
  );
});

test("loading warning is succesfully issued when user requests data prematurely", () => {
  resultVal = "";
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
  wrapper.setData({ loadedStateData: false });
  const spy = jest.spyOn(exports, "notify");
  wrapper.vm.requestData();
  expect(spy).toHaveBeenCalled();
  expect(resultVal).toEqual(
    "The page is still loading: please retry this action in a moment!"
  );
});
