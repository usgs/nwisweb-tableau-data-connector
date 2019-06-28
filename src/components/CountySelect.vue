<template>
  <div v-show="!disabled">
    <br />
    <label class="autocomplete-dropdown">State or Territory</label>
    <input
      v-model="state"
      :disabled="disabled"
      class="usa-input"
      list="csstates"
      type="text"
      style="width: 300px; margin: auto;"
    />
    <datalist id="csstates"> </datalist>
    <br />
    <label class="autocomplete-dropdown">County</label>
    <input
      v-model="county"
      :disabled="disabled"
      class="usa-input"
      list="cscounties"
      type="text"
      style="width: 300px; margin: auto;"
    />
    <datalist id="cscounties"> </datalist>
  </div>
</template>

<script>
import { locationMode } from "../enums.js";
import { mapState } from "vuex";
import stateList from "../fetchedValues/states.json";
import countyInfo from "../fetchedValues/counties.json";
import fipsInfo from "../fetchedValues/fips.json";

export default {
  name: "CountySelect",
  data: function() {
    return {
      state: "",
      county: "",
      activeLocationMode: locationMode.SITE
    };
  },
  methods: {
    populateStateList: function() {
      let dropDown = document.getElementById("csstates");
      Object.keys(stateList).forEach(element => {
        let option = document.createElement("option");
        option.text = element;
        option.value = element;
        dropDown.appendChild(option);
      });
    },
    populateCountyList: function() {
      let dropDown = document.getElementById("cscounties");
      Array.prototype.slice
        .call(dropDown.getElementsByTagName("option"))
        .forEach(function(item) {
          dropDown.removeChild(item);
        });
      let countyList = this.getCounties(this.state);

      countyList.forEach(element => {
        let option = document.createElement("option");
        option.value = `${element["state_cd"]}${element["county_cd"]}`;
        option.text = element["county_nm"];
        dropDown.appendChild(option);
      });
    },
    getCounties: function(stateName) {
      if (!(stateName in fipsInfo)) {
        return [];
      }
      let fipsCode = fipsInfo[stateName];
      let result = [];
      for (let key in countyInfo) {
        if (countyInfo[key]["state_cd"] == fipsCode) {
          result.push(countyInfo[key]);
        }
      }
      return result;
    }
  },
  updated() {
    //this.$store.commit("changeUSStateName", this.state); todo
  },
  mounted() {
    this.populateStateList();
  },
  watch: {
    locationMode(newValue) {
      this.activeLocationMode = newValue;
      if (newValue != locationMode.COUNTY) {
        this.state = "";
      }
    },
    state: function() {
      this.populateCountyList();
      this.county = "";
    }
  },
  computed: {
    ...mapState(["locationMode"]),
    disabled() {
      return this.activeLocationMode != locationMode.COUNTY;
    }
  }
};
</script>
