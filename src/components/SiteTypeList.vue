<template>
  <div>
    <br />
    <label class="autocomplete-dropdown">Site Type</label>
    <input
      v-model="siteType"
      class="usa-input"
      list="siteTypeDL"
      type="text"
      style="width: 300px; margin: auto;"
    />
    <datalist id="siteTypeDL"> </datalist>
    <button
      class="usa-button"
      v-on:click="addSiteTypeToSiteTypeList"
    >
      Add SiteType
    </button>

    <h6 class="selected-tags">Selected SiteTypes</h6>

    <input-tags 
      v-model="siteTypeNames"
      class="input-tags-element" >
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
Vue.component("input-tags", VueTags);

export default {
  name: "SiteTypeList",
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
      this.$store.commit("changeSiteTypeListActive", true);
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
          alert("Site Type selected already in selection");
        }
      } else {
        alert("invalid site type entered");
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

<style lang="scss" scoped>
  @import "../style/leftJustified.css";
</style>