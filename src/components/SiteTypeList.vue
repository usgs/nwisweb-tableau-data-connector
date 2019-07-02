<template>
  <div>
    <!-- <ChosenSelect
      id="siteSelect"
      multiple
      optgroup
      v-model="siteType"
      :options="listFromFile"
      style="width: 300px; height:300px; margin: auto;"
    >
    </ChosenSelect> -->
    <multiselect
      id="siteSelect"
      :multiple="true"
      :taggable="true"
      v-model="selectedSiteType"
      :max-height="600"
      :options="listFromFile"
      :optionHeight="40"
      :showPointer="true"
      :searchable="true"
      :close-on-select="false"
      :hide-selected="true"
      tag-placeholder="Add this as new tag"
      placeholder="Search for a site type"
    >
      <template
        v-for="option in selectedSiteType"
        slot="tag"
        slot-scope="{ option, remove }"
      >
        <span class="custom__tag">
          {{ option }}
          <span class="custom__remove" v-on:click="remove(option)">❌</span>
        </span>
      </template>
      <span slot="noResult"
        >Oops! No elements found. Consider changing the search query.</span
      >
    </multiselect>
  </div>
</template>

<script>
import { siteTypes } from "./params.js";
import Multiselect from "vue-multiselect";

export default {
  name: "SiteTypeList",
  components: {
    Multiselect
  },
  data: function() {
    return {
      selectedSiteType: [], //site types the user has clicked on
      STCodes: [], //holds STCodes of sites that user has selected
      option: "",
      listFromFile: [] //list of keys from siteTypes in param.js
    };
  },
  methods: {
    fillDropdown() {
      let siteSelect = document.getElementById("siteSelect");
      this.listFromFile = Object.keys(siteTypes);
      this.listFromFile.forEach(function(element) {
        //siteTypes.forEach(function(element) {
        let option = document.createElement("option");
        option.text = siteTypes[element];
        //alert(siteTypes[element]);
        option.value = siteTypes[element];
        siteSelect.appendChild(option);
        //console.log(element);
      });
    }
  },
  updated() {
    if (this.selectedSiteType.length > 0) {
      this.STCodes.push(
        siteTypes[this.selectedSiteType[this.selectedSiteType.length - 1]]
      );
    }
    this.$store.commit("changeSiteTypeListActive", true);
    this.$store.commit("changeSiteType", this.STCodes);
  },
  mounted() {
    this.fillDropdown();
  }
};
</script>

<style scoped lang="scss">
@import "../style/vue-multiselect.scss";

span.custom__tag {
  //blue bubble around selected sitetype
  display: inline-block;
  padding: 3px 12px;
  background: #2491ff;
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
}
//li.multiselect__element {//the dropdown list items that currently have bullets
span.multiselect__option {
  display: inline-block;
  padding: 3px 12px;
  background: #2491ff;
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 8px;
}
div.multiselect__content {
  display: inline-block;
}
div.multiselect__content-wrapper {
  display: inline-block;
}
input.multiselect__input {
  min-height: 40px;
  display: block;
  padding: 8px 40px 0 8px;
  border-radius: 5px;
  font-size: 14px;
  width: 100%;
}
div.multiselect {
  min-height: 40px;
  display: block;
  padding: 8px 40px 0 8px;
  border-radius: 5px;
  border: 1px solid #e8e8e8;
  background: #fff;
  font-size: 14px;
  width: 300px;
  margin: auto;
}
</style>
