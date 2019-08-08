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

  wrapper.setData({ display: false });
  wrapper.setData({ results: [] });
  wrapper.vm.arrayLikeSearch();
  expect(wrapper.vm.results).toEqual(wrapper.vm.source);
  wrapper.setData({ display: null });
  wrapper.setData({ results: [] });
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
  wrapper.setData({ display: "item" });
  wrapper.setData({ results: [] });
  wrapper.vm.arrayLikeSearch();
  expect(wrapper.vm.results).toEqual(expectedResults);
  expectedResults = [{ name: "item2", id: "002" }];
  wrapper.setData({ display: "em2" });
  wrapper.setData({ results: [] });
  wrapper.vm.arrayLikeSearch();
  expect(wrapper.vm.results).toEqual(expectedResults);
  expectedResults = [];
  wrapper.setData({ display: "adfsdfasdfasfdf" });
  wrapper.setData({ results: [] });
  wrapper.vm.arrayLikeSearch();
  expect(wrapper.vm.results).toEqual(expectedResults);
});
