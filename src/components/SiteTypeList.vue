<template>
  <div>
    <br />
    <label class="autocomplete-dropdown">Site Type</label>
    <input
      v-model="siteType"
      class="usa-input"
      list="siteTypeDl"
      type="text"
      style="width: 300px; margin: auto;"
    />
    <datalist id="siteTypeDL"> </datalist>
    <button
      class="usa-button"
      v-on:click="addSiteTypeToSiteTypeList"
      style="margin-top: 30px"
    >
      Add SiteType
    </button>

    <h6>Selected SiteTypes</h6>

    <input-tags v-model="siteTypeNames" style="max-width: 375px; margin: auto;">
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
  components: {
    VueTags
  },
  data: function() {
    return {
      tags: ["test1"],
      siteType: "",
      siteTypeList: [],
      siteTypeNames: [],
      STCodes: [], //holds STCodes of sites that user has selected
      option: ""
    };
  },
  methods: {
    commitSiteTypeSelection: function() {
      this.$store.commit("changeSiteTypeListActive", true);
      this.$store.commit("changeSiteType", this.STCodes);
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
      console.log("add");
      this.siteTypeList.push(this.siteType);
    },
    removeElement: function(index) {
            console.log("remove");
      Vue.delete(this.siteTypeList, index);
    }
  },
  updated() {
    this.commitSiteTypeSelection();
  },
  mounted() {
    this.populateSiteType();
  }
};
</script>
