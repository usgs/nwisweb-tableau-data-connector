import { shallowMount, createLocalVue } from "@vue/test-utils";
import VueTags from "vue-tags";
import ParamSelect from "../../src/components/ParamSelect.vue";
import * as exports from "../../src/notifications.js";
import Vuex from "vuex";
import Notifications from "vue-notification";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Notifications);
localVue.component("input-tags", VueTags);

let resultVal = "";
exports.notify = input => {
  resultVal = input;
}; // checking to see what was notified

jest.mock(
  "../../src/fetchedValues/paramTypes.json",
  () => {
    return [{ name: "name", id: "id" }];
  },
  { virtual: true }
);

let store;

test("addParam fails to add a parameter when loadedParamData is false", () => {
  store = new Vuex.Store({
    state: {},
    modules: {},
    getters: {},
    actions: {}
  });
  const wrapper = shallowMount(ParamSelect, {
    store,
    localVue
  });
  wrapper.setData({ loadedParamData: false });

  const spy = jest.spyOn(exports, "notify");
  wrapper.vm.addParam("param1");
  wrapper.vm.commitParamList = () => {};
  wrapper.vm.fetchParams = () => {};

  expect(spy).toHaveBeenCalled();
  expect(resultVal).toEqual("Please wait for param data to load");
});

test("addParam fails to add a parameter correctly when loadedparamData is true but the parameter is already present", () => {
  store = new Vuex.Store({
    state: {},
    modules: {},
    getters: {},
    actions: {}
  });
  const wrapper = shallowMount(ParamSelect, {
    store,
    localVue
  });
  wrapper.vm.commitParamList = () => {};
  wrapper.vm.fetchParams = () => {};
  wrapper.setData({ loadedParamData: true });
  wrapper.setData({ paramList: ["00065", "00060"] });
  wrapper.setData({ selectedParams: { "00060": "00060" } });

  let input = "00032";

  const spy = jest.spyOn(exports, "notify");
  wrapper.vm.addParam(input);
  expect(spy).toHaveBeenCalled();
  expect(resultVal).toEqual("00032: invalid param code entered");
});

test("addParam fails to add a parameter correctly when loadedparamData is true but the parameter is already present", () => {
  store = new Vuex.Store({
    state: {},
    modules: {},
    getters: {},
    actions: {}
  });
  const wrapper = shallowMount(ParamSelect, {
    store,
    localVue
  });
  wrapper.vm.commitParamList = () => {};
  wrapper.vm.fetchParams = () => {};

  wrapper.setData({ loadedParamData: true });
  wrapper.setData({ paramList: ["00065", "00060"] });
  wrapper.setData({ selectedParams: ["00060"] });

  let input = "00060";

  const spy = jest.spyOn(exports, "notify");
  wrapper.vm.addParam(input);
  expect(spy).toHaveBeenCalled();
  expect(resultVal).toEqual("00060: parameter selected already in selection.");
});
