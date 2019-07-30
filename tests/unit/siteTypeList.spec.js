import { shallowMount, createLocalVue } from "@vue/test-utils";
import SiteTypeList from "../../src/components/SiteTypeList.vue";
import Vuex from "vuex";
import Notifications from "vue-notification";
import VueTags from "vue-tags";

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
