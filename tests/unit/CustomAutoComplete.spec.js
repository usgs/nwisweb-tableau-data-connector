import { shallowMount, createLocalVue } from "@vue/test-utils";
import CustomAutoComplete from "../../src/components/CustomAutoComplete.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

let sourceData = [{ name: "item1", id: "001" }, { name: "item2", id: "002" }];

let store;
test("getID correctly gets the id for a given name", () => {
  store = new Vuex.Store({
    state: {},
    modules: {},
    getters: {},
    actions: {}
  });
  const wrapper = shallowMount(CustomAutoComplete, {
    store,
    localVue,
    propsData: {
      source: sourceData
    }
  });
  expect(wrapper.vm.getID("item2")).toEqual("002");
  expect(wrapper.vm.getID("asdfasdfsd")).toEqual(false);
});

test("Arraylike Search correctly responds to empty user input", () => {
  store = new Vuex.Store({
    state: {},
    modules: {},
    getters: {},
    actions: {}
  });
  const wrapper = shallowMount(CustomAutoComplete, {
    store,
    localVue,
    propsData: {
      source: sourceData
    }
  });

  wrapper.setData({ display: false, results: [] });
  wrapper.vm.arrayLikeSearch();
  expect(wrapper.vm.results).toEqual(wrapper.vm.source);
  wrapper.setData({ display: null, results: [] });
  wrapper.vm.arrayLikeSearch();
  expect(wrapper.vm.results).toEqual(wrapper.vm.source);
});

test("Arraylike Search correctly responds to valid user input", () => {
  store = new Vuex.Store({
    state: {},
    modules: {},
    getters: {},
    actions: {}
  });
  const wrapper = shallowMount(CustomAutoComplete, {
    store,
    localVue,
    propsData: {
      source: sourceData
    }
  });

  let expectedResults = wrapper.vm.source;
  wrapper.setData({ display: "item", results: [] });
  wrapper.vm.arrayLikeSearch();
  expect(wrapper.vm.results).toEqual(expectedResults);
  expectedResults = [{ name: "item2", id: "002" }];
  wrapper.setData({ display: "em2", results: [] });
  wrapper.vm.arrayLikeSearch();
  expect(wrapper.vm.results).toEqual(expectedResults);
  expectedResults = [];
  wrapper.setData({ display: "adfsdfasdfasfdf", results: [] });
  wrapper.vm.arrayLikeSearch();
  expect(wrapper.vm.results).toEqual(expectedResults);
});

test("refresh toggle correctly clears display value", () => {
  store = new Vuex.Store({
    state: {},
    modules: {},
    getters: {},
    actions: {}
  });
  const wrapper = shallowMount(CustomAutoComplete, {
    store,
    localVue,
    propsData: {
      source: sourceData
    }
  });
  wrapper.setData({ display: "item" });
  wrapper.setProps({ refresh: !wrapper.vm.refresh });
  expect(wrapper.vm.display).toEqual("");
});

test("close behaves correctly when the autocomplete loses focus", () => {
  store = new Vuex.Store({
    state: {},
    modules: {},
    getters: {},
    actions: {}
  });
  const wrapper = shallowMount(CustomAutoComplete, {
    store,
    localVue,
    propsData: {
      source: sourceData
    }
  });

  let displayMock = "";

  wrapper.vm.updateToID = input => {
    displayMock = input;
  };
  wrapper.vm.getID = () => {
    return false;
  };
  wrapper.vm.emitValue = () => {};
  wrapper.vm.removeEventListener = () => {};

  const updateToIDSpy = jest.spyOn(wrapper.vm, "updateToID");
  const getIDSpy = jest.spyOn(wrapper.vm, "getID");
  const emitValueSpy = jest.spyOn(wrapper.vm, "emitValue");
  const removeEventListenerSpy = jest.spyOn(wrapper.vm, "removeEventListener");

  wrapper.setData({
    results: [{ name: "result", id: "number" }],
    error: "test"
  });

  wrapper.vm.close();

  expect(getIDSpy).toHaveBeenCalled();
  expect(emitValueSpy).toHaveBeenCalled();
  expect(removeEventListenerSpy).toHaveBeenCalled();
  expect(updateToIDSpy).not.toHaveBeenCalled();

  expect(wrapper.vm.results).toEqual(null);
  expect(wrapper.vm.error).toEqual(null);

  wrapper.vm.getID = () => {
    return "001";
  };
  wrapper.setData({
    results: [{ name: "result", id: "number" }],
    error: "test"
  });

  wrapper.vm.close();

  expect(getIDSpy).toHaveBeenCalled();
  expect(emitValueSpy).toHaveBeenCalled();
  expect(removeEventListenerSpy).toHaveBeenCalled();
  expect(updateToIDSpy).toHaveBeenCalled();

  expect(displayMock).toEqual("001");
  expect(wrapper.vm.results).toEqual(null);
  expect(wrapper.vm.error).toEqual(null);
});
