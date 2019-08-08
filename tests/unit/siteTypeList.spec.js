import { shallowMount, createLocalVue } from "@vue/test-utils";
import SiteTypeList from "../../src/components/SiteTypeList.vue";
import Vuex from "vuex";
import Notifications from "vue-notification";
import VueTags from "vue-tags";
import * as exports from "../../src/notifications.js";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Notifications);
localVue.component("input-tags", VueTags);

jest.mock(
  "../../src/fetchedValues/siteTypes.json",
  () => {
    return [{ site_tp_cd: "VALID", site_tp_ln: "This is a valid code" }];
  },
  { virtual: true }
);

describe("getSiteTypeNameFromCode", () => {
  let store;
  test("test getSiteTypeNameFromCode with valid site Type code", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {},
      actions: {}
    });
    const wrapper = shallowMount(SiteTypeList, {
      store,
      localVue,
      propsData: {},
      stubs: ["input-tags"]
    });
    let siteTypeCode = "VALID";
    expect(wrapper.vm.getSiteTypeNameFromCode(siteTypeCode)).toEqual(
      "This is a valid code"
    );
  });

  test("test getSiteTypeNameFromCode with invalid site Type code", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {},
      actions: {}
    });
    const wrapper = shallowMount(SiteTypeList, {
      store,
      localVue,
      propsData: {},
      stubs: ["input-tags"]
    });
    expect(wrapper.vm.getSiteTypeNameFromCode("NOTACODE")).toEqual("Invalid.");
  });
});

describe("addSiteTypeToSiteTypeList", () => {
  let resultVal = "";
  exports.notify = input => {
    resultVal = input;
  }; // checking to see what was notified
  let store;

  test("warns user correctly if no site type entered", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {},
      actions: {}
    });
    const wrapper = shallowMount(SiteTypeList, {
      store,
      localVue,
      propsData: {},
      stubs: ["input-tags"]
    });

    let input = "";
    const spy = jest.spyOn(exports, "notify");
    wrapper.vm.addSiteTypeToSiteTypeList(input);
    expect(spy).toHaveBeenCalled();
    expect(resultVal).toEqual("no site type entered");
  });

  test("warns user correctly if invalid site type entered", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {},
      actions: {}
    });
    const wrapper = shallowMount(SiteTypeList, {
      store,
      localVue,
      propsData: {},
      stubs: ["input-tags"]
    });

    wrapper.vm.getSiteTypeNameFromCode = () => {
      return "Invalid.";
    };
    let input = "something";
    const spy = jest.spyOn(exports, "notify");
    wrapper.vm.commitSiteTypeSelection = () => {};
    wrapper.vm.addSiteTypeToSiteTypeList(input);
    expect(spy).toHaveBeenCalled();
    expect(resultVal).toEqual("something: invalid site type entered");
  });

  test("warns user correctly if duplicate site type entered", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {},
      actions: {}
    });
    const wrapper = shallowMount(SiteTypeList, {
      store,
      localVue,
      propsData: {},
      stubs: ["input-tags"]
    });

    wrapper.vm.getSiteTypeNameFromCode = () => {
      return "not invalid.";
    };
    let input = "something";
    const spy = jest.spyOn(exports, "notify");
    wrapper.vm.commitSiteTypeSelection = () => {};
    wrapper.setData({ siteTypeList: ["something"] });
    wrapper.vm.addSiteTypeToSiteTypeList(input);
    expect(spy).toHaveBeenCalled();
    expect(resultVal).toEqual(
      "something: site type selected already in selection"
    );
  });

  test("Correctly adds a site type when it is valid and not a duplicate", () => {
    store = new Vuex.Store({
      state: {},
      modules: {},
      getters: {},
      actions: {}
    });
    const wrapper = shallowMount(SiteTypeList, {
      store,
      localVue,
      propsData: {},
      stubs: ["input-tags"]
    });

    wrapper.vm.getSiteTypeNameFromCode = () => {
      return "not invalid.";
    };
    let input = "something else";
    let expectedResult = ["something", "something else"];
    wrapper.vm.commitSiteTypeSelection = () => {};
    wrapper.setData({ siteTypeList: ["something"] });
    wrapper.vm.addSiteTypeToSiteTypeList(input);
    expect(wrapper.vm.siteTypeList).toEqual(expectedResult);
  });
});

test("updateSiteTypeInput correctly updates siteType", () => {
  let store = new Vuex.Store({
    state: {},
    modules: {},
    getters: {},
    actions: {}
  });
  const wrapper = shallowMount(SiteTypeList, {
    store,
    localVue,
    propsData: {},
    stubs: ["input-tags"]
  });

  wrapper.setData({ siteType: "default" });
  wrapper.vm.updateSiteTypeInput(undefined);
  expect(wrapper.vm.siteType).toEqual("");

  wrapper.setData({ siteType: "default" });
  wrapper.vm.updateSiteTypeInput(null);
  expect(wrapper.vm.siteType).toEqual("");

  let input = "validstring";
  wrapper.setData({ siteType: "default" });
  wrapper.vm.updateSiteTypeInput(input);
  expect(wrapper.vm.siteType).toEqual(input);
});
