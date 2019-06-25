<template>
  <div>
    <form class="usa-form">
      <fieldset class="usa-fieldset">
        <legend class="usa-sr-only">Location Query Type</legend>
        <div class="usa-form">
          <select
            class="usa-select"
            id="siteSelect"
            multiple="multiple"
            size="5"
            name="siteType"
          >
          </select>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import {siteTypes} from "./params.js";

export default {
  name: "SiteTypeList",
  data: function() {
    return {
      siteType: ""
    };
  },
  updated() {
    this.$store.commit("changeUSStateName", this.state);
  },
  mounted() {
      //let datalist = document.getElementById("siteSelect").getElementsByClassName("dataList");
      let siteSelect = document.getElementById("siteSelect");
      let listFromFile = Object.keys(siteTypes);
      listFromFile.forEach(function(element) {
        console.log(element);
        //datalist.innerHTML = `<option value=${element} />`;
        var option = document.createElement("option");
        var value = document.createTextNode(element);
        option.appendChild(value);
        siteSelect.appendChild(option);
      });
  }
};
</script>
