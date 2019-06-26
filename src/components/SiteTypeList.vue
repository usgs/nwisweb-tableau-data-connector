<template>
  <div>
    <ChosenSelect
      id="siteSelect"
      multiple
      optgroup
      v-model="siteType"
      :options="listFromFile"
      style="width: 300px; height:300px; margin: auto;"
    >
    </ChosenSelect>
  </div>
</template>

<script>
import { siteTypes, get } from "./params.js";
import ChosenSelect from "./ChosenSelect";

export default {
  name: "SiteTypeList",
  components: {
    ChosenSelect
  },
  data: function() {
    return {
      siteType: "",
      listFromFile: []
    };
  },
  updated() {
    console.log(this.siteType);
    this.$store.commit("changeSiteType", this.siteType);
  },
  mounted() {
    let siteSelect = document.getElementById("siteSelect");
    this.listFromFile = Object.keys(siteTypes);
    this.listFromFile.forEach(function(element) {
      // if(element.charAt(0) == "@"){

      // }
      //console.log(element);
      var option = document.createElement("option");
      option.text = element;
      option.value = element;
      siteSelect.appendChild(option);
    });
  }
};
</script>
