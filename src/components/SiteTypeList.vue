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
    <span id="tagHolder"></span>
    <Multiselect
      id="siteSelect"
      :multiple="true"
      :taggable="true"
      v-model="siteType"
      :options="listFromFile"
      aria-hidden="false"
      :close-on-select="false"
      :hide-selected="true"
      tag-placeholder="Add this as new tag" 
      placeholder="Search for a site type" 
    >
      <option v-for="option in siteType" v-bind:key="option.value">
        {{ option.text }}
      </option>
    </Multiselect>
    
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
      listFromFile: [],
    };
  },
  methods: {
    addTag() {
      console.log("in addTag");
      let tagHolder = document.getElementById("tagHolder");
      let newSiteType = this.siteType[0];
      let tag = document.createElement("br");
      tag.text = newSiteType;
      tagHolder.appendChild(tag);
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
  Multiselect {
          width: 300px; 
          height:300px; 
          margin: auto;
  }
  .multiselect_tag {
    color: red;
  }
</style>


