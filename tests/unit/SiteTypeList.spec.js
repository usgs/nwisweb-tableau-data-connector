import { mount } from "@vue/test-utils";
import SiteTypeList from "../../src/components/SiteTypeList.vue";

describe("SiteTypeList", () => {
  test("should fill site type list properly", () => {
    const wrapper = mount(SiteTypeList);
    let siteTypeDataList = wrapper.find("#siteTypeDL]");
    expect(siteTypeDataList).toBeNull();
  });
});
