<template>
  <div v-show="!disabled">
    <span class="input-desc">
      <label>State or Territory</label>
      <ToolTip
        hint="This is an optional field; when populated with a valid state name, county or equivalent subdivision suggestions from the current state or territory will be available in the county input field in compatibe browsers. This field takes one US State or territory name, with the first letter capitalized. The list of allowed states and territories mirrors the list of allowed states and territories in the tool linked here. "
        url="https://waterservices.usgs.gov/rest/IV-Test-Tool.html"
      ></ToolTip>
    </span>
    <CustomAutoComplete
      v-bind:refresh="stateAutoCompleteRefreshIndicator"
      v-on:valueupdate="updateStateInput"
      v-on:clear="updateStateInput"
      :source="stateSearchList"
      input-class="usa-input usa-input-custom"
    ></CustomAutoComplete>
    <br />
    <span class="input-desc">
      <label>County</label>
      <ToolTip
        hint="The complete list of county fips cods is available here. If you are entering the codes manually, please format them as follows &ltState Cd&gt&ltCounty Cd&gt. Each code is a 5 digit number."
        url="https://help.waterdata.usgs.gov/code/county_query?fmt=html?display=inline"
      ></ToolTip>
    </span>
    <CustomAutoComplete
      v-bind:refresh="countyAutoCompleteRefreshIndicator"
      v-on:valueupdate="updateCountyInput"
      v-on:clear="updateCountyInput"
      :source="countySearchList"
      input-class="usa-input usa-input-custom"
    ></CustomAutoComplete>
    <button class="usa-button usa-button-custom" v-on:click="addCounties">
      Add County
    </button>
    <h6 class="selected-tags">Selected Counties</h6>
    <input-tags v-model="countyNames" class="input-tags-element">
      <div class="tags-input">
        <span
          v-for="(tag, key) in countyNames"
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
import { locationMode } from "../enums.js";
import { mapState } from "vuex";
import stateList from "../fetchedValues/states.json";
import countyInfo from "../fetchedValues/counties.json";
import fipsInfo from "../fetchedValues/fips.json";
import Vue from "vue";
import ToolTip from "../components/ToolTip";
import VueTags from "vue-tags";
import { notify } from "../notifications.js";
import CustomAutoComplete from "../components/CustomAutoComplete";

Vue.component("input-tags", VueTags);

export default {
  name: "CountySelect",
  data: function() {
    return {
      state: "",
      stateSearchList: [],
      countySearchList: [],
      county: "",
      counties: [],
      countyAutoCompleteRefreshIndicator: true,
      stateAutoCompleteRefreshIndicator: true,
      countyNames: [],
      activeLocationMode: locationMode.SITE
    };
  },
  components: {
    ToolTip,
    CustomAutoComplete
  },
  methods: {
    populateStateList: function() {
      Object.keys(stateList).forEach(element => {
        this.stateSearchList.push({ name: element, id: element });
      });
    },
    populateCountyList: function() {
      let countyList = this.getCounties(this.state);

      this.countySearchList = [];

      countyList.forEach(element => {
        this.countySearchList.push({
          name: element["county_nm"],
          id: `${element["state_cd"]}${element["county_cd"]}`
        });
      });
    },
    commitCountySelection: function() {
      this.$store.commit("changeCountyCode", this.counties);
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
    },
    getCountyNameFromCode: function(fullCountyCode) {
      if (fullCountyCode.length != 5) {
        return "invalid";
      }
      let stateCode = fullCountyCode.substring(0, 2);
      let countyCode = fullCountyCode.substring(2, 5);
      let result = "invalid";
      countyInfo.forEach(element => {
        if (
          element["state_cd"] == stateCode &&
          element["county_cd"] == countyCode
        ) {
          result = element["county_nm"];
        }
      });
      return result;
    },
    addCounties: function() {
      let counties = this.county.split(",");
      counties.forEach(county => {
        this.addCountyToCounties(county.replace(/\s/g, ""));
      });
    },
    addCountyToCounties: function(county) {
      if (county == "") {
        notify(`no county code is entered`);
        return;
      }
      if (!(this.getCountyNameFromCode(county) == "invalid")) {
        if (!this.counties.includes(county)) {
          if (this.counties.length < 10) {
            this.counties.push(county);
          } else {
            notify(`${county}: Maximum number of counties already selected.`);
          }
        } else {
          notify(`${county}: County selected already in selection.`);
        }
      } else {
        notify(`${county}: invalid county code entered`);
      }
    },
    removeElement: function(index) {
      Vue.delete(this.counties, index);
    },
    updateStateInput: function(result) {
      if (result !== null && typeof result !== "undefined") {
        this.state = result;
      } else {
        this.state = "";
      }
    },
    updateCountyInput: function(result) {
      if (result !== null && typeof result !== "undefined") {
        this.county = result;
      } else {
        this.county = "";
      }
    },
    triggerCountyAutoCompleteRefreshIndicator() {
      this.countyAutoCompleteRefreshIndicator = !this
        .countyAutoCompleteRefreshIndicator;
    },
    triggerStateAutoCompleteRefreshIndicator() {
      this.stateAutoCompleteRefreshIndicator = !this
        .stateAutoCompleteRefreshIndicator;
    }
  },
  mounted() {
    this.populateStateList();
  },
  watch: {
    locationMode(newValue) {
      this.activeLocationMode = newValue;
      this.triggerCountyAutoCompleteRefreshIndicator();
      this.triggerStateAutoCompleteRefreshIndicator();
      if (newValue != locationMode.COUNTY) {
        this.state = "";
        this.county = "";
        this.counties = [];
      }
    },
    state: function() {
      this.populateCountyList();
      this.triggerCountyAutoCompleteRefreshIndicator();
      this.county = "";
    },
    counties: function(newValue) {
      this.countyNames = [];
      newValue.forEach(element => {
        this.countyNames.push(this.getCountyNameFromCode(element));
      });
      this.commitCountySelection();
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
