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
      v-model="siteType"
      :options="listFromFile"
      :close-on-select="false"
      :hide-selected="true"
      tag-placeholder="Add this as new tag" 
      placeholder="Search for a site type" 
    >
      <template v-for="option in siteType" slot="tag" slot-scope="{ option, remove }">
        <span class="custom__tag">
          {{ option }}
          <span class="custom__remove" v-on:click="remove(option)">❌</span>
        </span>
      </template>
      <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
    </multiselect>
  </div>
</template>

<script>
import { siteTypes } from "./params.js";
//import ChosenSelect from "./ChosenSelect";
import Multiselect from "vue-multiselect";

export default {
  name: "SiteTypeList",
  components: {
    //ChosenSelect,
    Multiselect
  },
  data: function() {
    return {
      siteType: [],
      option: "",
      listFromFile: [],
    };
  },
  methods: {
    addTag() {
      console.log("in addTag");
      //let tagHolder = document.getElementById("tagHolder");
      let newSiteType = this.siteType[0];
      let tag = document.createElement("br");
      tag.text = newSiteType;
      //tagHolder.appendChild(tag);
    },
    fillList() {
      let siteSelect = document.getElementById("siteSelect");
      this.listFromFile = Object.keys(siteTypes);
      this.listFromFile.forEach(function(element) {
        let option = document.createElement("option");
        option.text = element;
        option.value = element;
        siteSelect.appendChild(option);
                //console.log(element);

      });
    }
  },
  updated() {
    console.log(this.siteType +" in updated");
    this.addTag();
    this.$store.commit("changeSiteType", this.siteType);
  },
  mounted() {
    this.fillList();
  }
};
</script>

<style scoped lang="scss">
  span.custom_tag {
    min-height: 40px;
    display: block;
    padding: 8px 40px 0 8px;
    border-radius: 5px;
    border: 1px solid red;
    background: red;
    font-size: 14px;
  }
  
  div.multiselect__tag {
    min-height: 40px;
    display: block;
    padding: 8px 40px 0 8px;
    border-radius: 5px;
    border: 1px solid red;
    background: red;
    font-size: 14px;
  }
  
</style>


