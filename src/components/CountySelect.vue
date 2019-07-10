<template>
  <div v-show="!disabled">
    <br />
    <span>
      <label style="display: inline-block;">State or Territory</label>
      <ToolTip hint="todo" url="https://www.google.com"></ToolTip>
    </span>
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
    <span>
      <label style="display: inline-block;">County</label>
      <ToolTip hint="todo" url="https://www.google.com"></ToolTip>
    </span>
    <input
      v-model="county"
      :disabled="disabled"
      class="usa-input"
      list="cscounties"
      type="text"
      style="width: 300px; margin: auto;"
    />
    <datalist id="cscounties"> </datalist>
    <button
      class="usa-button"
      v-on:click="addCountyToCounties"
      style="margin-top: 30px"
    >
      Add County
    </button>
    <h6>Selected Counties</h6>
    <input-tags v-model="countyNames" style="max-width: 375px; margin: auto;">
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
    addCountyToCounties: function() {
      if (!(this.getCountyNameFromCode(this.county) == "invalid")) {
        if (!this.counties.includes(this.county)) {
          if (this.counties.length < 10) {
            this.counties.push(this.county);
          } else {
            alert("Maximum number of counties already selected.");
          }
        } else {
          alert("County selected already in selection.");
        }
      } else {
        alert("invalid county code entered");
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
