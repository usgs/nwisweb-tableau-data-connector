<template>
  <div v-show="!disabled">
    <span class="input-desc">
      <label>State or Territory</label>
      <ToolTip
        hint="This is an optional field; when populated with a valid state name, county or equivalent subdivision suggestions from the current state or territory will be available in the county input field in compatibe browsers. This field takes one US State or territory name, with the first letter capitalized. The list of allowed states and territories mirrors the list of allowed states and territories in the tool linked here. "
        url="https://waterservices.usgs.gov/rest/IV-Test-Tool.html"
      ></ToolTip>
    </span>
    <input
      v-model="state"
      :disabled="disabled"
      class="usa-input usa-input-custom"
      list="csstates"
      type="text"
    />
    <datalist id="csstates"> </datalist>
    <br />
    <span class="input-desc">
      <label>County</label>
      <ToolTip
        hint="The complete list of county fips cods is available here. If you are entering the codes manually, please format them as follows &ltState Cd&gt&ltCounty Cd&gt. Each code is a 5 digit number."
        url="https://help.waterdata.usgs.gov/code/county_query?fmt=html?display=inline"
      ></ToolTip>
    </span>
    <input
      v-model="county"
      :disabled="disabled"
      class="usa-input usa-input-custom"
      list="cscounties"
      type="text"
    />
    <datalist id="cscounties"> </datalist>
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

Vue.component("input-tags", VueTags);

export default {
  name: "CountySelect",
  data: function() {
    return {
      state: "",
      county: "",
      counties: [],
      countyNames: [],
      activeLocationMode: locationMode.SITE
    };
  },
  components: {
    ToolTip
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
        this.addCountyToCounties(county);
      });
    },
    addCountyToCounties: function(county) {
      if (!(this.getCountyNameFromCode(county) == "invalid")) {
        if (!this.counties.includes(county)) {
          if (this.counties.length < 10) {
            this.counties.push(county);
          } else {
            notify("Maximum number of counties already selected.");
          }
        } else {
          notify("County selected already in selection.");
        }
      } else {
        notify("invalid county code entered");
      }
    },
    removeElement: function(index) {
      Vue.delete(this.counties, index);
    }
  },
  mounted() {
    this.populateStateList();
  },
  watch: {
    locationMode(newValue) {
      this.activeLocationMode = newValue;
      if (newValue != locationMode.COUNTY) {
        this.state = "";
        this.county = "";
        this.counties = [];
      }
    },
    state: function() {
      this.populateCountyList();
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
