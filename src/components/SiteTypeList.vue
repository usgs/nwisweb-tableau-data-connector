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
    <input v-model="siteType" class="usa-input usa-input-custom" list="siteTypeDL" type="text" />
    <datalist id="siteTypeDL"> </datalist>
    <button
      class="usa-button usa-button-custom"
      v-on:click="addSiteTypeToSiteTypeList"
    >
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

Vue.component("input-tags", VueTags);

export default {
  name: "SiteTypeList",
  components: {
    ToolTip
  },
  data: function() {
    return {
      tags: [],
      siteType: "",
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
      let siteSelect = document.getElementById("siteTypeDL");
      siteTypes.forEach(element => {
        let option = document.createElement("option");
        option.text = element["site_tp_ln"];
        option.value = element["site_tp_cd"];
        siteSelect.appendChild(option);
      });
    },
    addSiteTypeToSiteTypeList: function() {
      if (!(this.getSiteTypeNameFromCode(this.siteType) == "invalid")) {
        if (!this.siteTypeList.includes(this.siteType)) {
          this.siteTypeList.push(this.siteType);
        } else {
          notify("Site Type selected already in selection");
        }
      } else {
        notify("invalid site type entered");
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
