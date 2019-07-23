<template>
  <div>
    <br />
    <span class="input-desc">
      <label>Site Type Code</label>
      <ToolTip
        hint="The complete list of site type codes is available here."
        url="https://help.waterdata.usgs.gov/code/site_tp_query?fmt=html?display=inline"
      ></ToolTip>
    </span>

    <CustomAutoComplete
      v-on:valueupdate="updateSiteTypeInput"
      v-on:clear="updateSiteTypeInput"
      :source="siteTypeSearchList"
      input-class="usa-input usa-input-custom"
    ></CustomAutoComplete>
    <button class="usa-button usa-button-custom" v-on:click="addSiteTypes">
      Add Site Type
    </button>

    <h6 class="selected-tags">Selected SiteTypes</h6>

    <input-tags v-model="siteTypeNames" class="input-tags-element">
      <div class="tags-input">
        <span
          v-for="(tag, key) in siteTypeNames"
          class="tags-input-tag"
          :key="key"
        >
          <span>{{ tag }}</span>
          <button
            type="button"
            class="tags-input-remove"
            v-on:click="removeElement(key)"
          >
            &times;
          </button>
        </span>
      </div>
    </input-tags>
  </div>
</template>

<script>
import siteTypes from "../fetchedValues/siteTypes.json";
import VueTags from "vue-tags";
import Vue from "vue";
import { notify } from "../notifications.js";
import ToolTip from "../components/ToolTip";
import CustomAutoComplete from "../components/CustomAutoComplete";

Vue.component("input-tags", VueTags);

export default {
  name: "SiteTypeList",
  components: {
    ToolTip,
    CustomAutoComplete
  },
  data: function() {
    return {
      tags: [],
      siteType: "",
      siteTypeSearchList: [],
      siteTypeList: [], //holds selected siteTypes
      siteTypeNames: []
    };
  },
  methods: {
    commitSiteTypeSelection: function() {
      let siteTypeStatus = this.siteTypeList.length != 0;
      this.$store.commit("changeSiteTypeListActive", siteTypeStatus);
      this.$store.commit("changeSiteType", this.siteTypeList);
    },
    populateSiteType: function() {
      this.siteTypeSearchList = siteTypes.map(element => {
        return { name: element["site_tp_ln"], id: element["site_tp_cd"] };
      });
    },
    addSiteTypes: function() {
      let siteTypes = this.siteType.split(",");
      siteTypes.forEach(siteType => {
        this.addSiteTypeToSiteTypeList(siteType.replace(/\s/g, ""));
      });
    },
    addSiteTypeToSiteTypeList: function(siteType) {
     if (this.siteType == "") {
        notify(`no site type entered`);
        return;
      }


      if (!(this.getSiteTypeNameFromCode(siteType) == "invalid")) {
        if (!this.siteTypeList.includes(siteType)) {
          this.siteTypeList.push(siteType);
        } else {
          notify(`${siteType}: site type selected already in selection`);
        }
      } else {
        notify(`${siteType}: invalid site type entered`);
      }
    },
    removeElement: function(index) {
      Vue.delete(this.siteTypeList, index);
    },
    getSiteTypeNameFromCode: function(siteTypeCode) {
      let result = "invalid";
      siteTypes.forEach(element => {
        if (element["site_tp_cd"] == siteTypeCode) {
          result = element["site_tp_ln"];
        }
      });
      return result;
    },
    updateSiteTypeInput: function(result) {
       if (result !== null && (typeof result) !== 'undefined') {
        this.siteType = result;
      } else {
        this.siteType = "";
      }    
    }
  },
  mounted() {
    this.populateSiteType();
  },
  watch: {
    siteTypeList: function(newValue) {
      this.siteTypeNames = [];
      newValue.forEach(element => {
        this.siteTypeNames.push(this.getSiteTypeNameFromCode(element));
      });
      this.commitSiteTypeSelection();
    }
  }
};
</script>
