<template>
  <div>
    <ChosenSelect
      id="siteSelect"
      multiple="true"
      v-model="item"
      :options="list"
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
      item: null
    };
  },
  updated() {
    this.$store.commit("changeUSStateName", this.state);
  },
  mounted() {
    get();
    let siteSelect = document.getElementById("siteSelect");
    let listFromFile = Object.keys(siteTypes);
    listFromFile.forEach(function(element) {
      console.log(element);
      var option = document.createElement("option");
      var value = document.createTextNode(element);
      option.appendChild(value);
      siteSelect.appendChild(option);
    });
  }
};
</script>
