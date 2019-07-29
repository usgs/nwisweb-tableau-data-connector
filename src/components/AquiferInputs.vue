<template>
  <div>
    <span class="input-desc">
      <label>National Aquifer Code</label>
      <ToolTip
        hint="Enter up to 1000 national aquifer codes, separated by commas. Each National Aquifer Code is 10 digits. A complete list of national aquifer codes is linked here."
        url="https://water.usgs.gov/ogw/NatlAqCode-reflist.html"
      ></ToolTip>
    </span>
    <input
      class="usa-input usa-input-custom"
      v-model="natAquifer"
      type="text"
    />
    <br />
    <span class="input-desc">
      <label>Local Aquifer Code</label>
      <ToolTip
        hint="Select a state to search a list of local aquifers or enter up to 1000 local aquifer codes seperated by commas. A complete list of local aquifer codes is linked here."
        url="https://help.waterdata.usgs.gov/code/aqfr_cd_query?fmt=html"
      ></ToolTip>
    </span>
    <span class="input-desc">
      <label>Select State or Territory</label>
      <CustomAutoComplete
        v-on:valueupdate="updateStateInput"
        v-on:clear="updateStateInput"
        :source="stateSearchList"
        input-class="usa-input usa-input-custom"
      ></CustomAutoComplete>
    </span>
    <label class="input-desc">Local Aquifer Codes</label>
    <CustomAutoComplete
      v-bind:refresh="aqCodeRefreshIndicator"
      v-on:valueupdate="updateAqCode"
      v-on:clear="updateAqCode"
      :source="aqCodeSearchList"
      input-class="usa-input usa-input-custom"
    ></CustomAutoComplete>
    <button class="usa-button usa-button-custom" v-on:click="addLocalAq">
      Add Local Aquifer
    </button>
    <h6 class="selected-tags">Selected Local Aquifers</h6>
    <input-tags v-model="locAqNames" class="input-tags-element">
      <div class="tags-input">
        <span
          v-for="(tag, key) in locAqNames"
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
import ToolTip from "../components/ToolTip";
import stateList from "../fetchedValues/states.json";
import fipsInfo from "../fetchedValues/fips.json";
import localAquiferInfo from "../fetchedValues/locAquifer.json";
import aquiferAreas from "../fetchedValues/aquiferAreas.json";
import Vue from "vue";
import VueTags from "vue-tags";
import { notify } from "../notifications.js";
import CustomAutoComplete from "../components/CustomAutoComplete";

Vue.component("input-tags", VueTags);

export default {
  name: "AquiferInputs",
  components: {
    ToolTip,
    CustomAutoComplete
  },
  data: function() {
    return {
      state: "",
      natAquifer: "",
      natAquiferActive: "",
      locAquifer: "",
      localAquifers: [],
      locAqNames: [],
      locAquiferActive: "",
      stateSearchList: [],
      aqCodeSearchList: [],
      aqCodeRefreshIndicator: true
    };
  },
  methods: {
    populateStateList: function() {
      this.stateSearchList = [];
      Object.keys(stateList).forEach(element => {
        this.stateSearchList.push({ name: element, id: element });
      });
      Object.keys(aquiferAreas).forEach(element => {
        this.stateSearchList.push({ name: element, id: element });
      });
    },
    populateLocalAqList: function() {
      let aquiferList = this.getLocAquifers(this.state);
      this.aqCodeSearchList = [];
      let stateAbbrev = stateList[this.state];
      let stateCode = aquiferAreas[this.state];

      aquiferList.forEach(element => {
        let newEntry = {};
        if (stateCode !== undefined) {
          newEntry["id"] = `${element["state_cd"]}:${element["aqfr_cd"]}`;
        } else {
          newEntry["id"] = `${stateAbbrev}:${element["aqfr_cd"]}`;
        }
        newEntry["name"] = element["aqfr_nm"];
        this.aqCodeSearchList.push(newEntry);
      });
    },
    getLocAquifers: function(stateName) {
      if (!(stateName in fipsInfo) && !(stateName in aquiferAreas)) {
        return [];
      }
      let fipsCode = fipsInfo[stateName];
      let result = [];
      for (let key in localAquiferInfo) {
        if (localAquiferInfo[key]["state_cd"] == fipsCode) {
          result.push(localAquiferInfo[key]);
        }
      }
      let stateCode = aquiferAreas[stateName];
      for (let key in localAquiferInfo) {
        if (localAquiferInfo[key]["state_cd"] == stateCode) {
          result.push(localAquiferInfo[key]);
        }
      }
      return result;
    },
    getStateNamefromAbbrev: function(stateAbbrev) {
      for (let key in stateList) {
        if (stateList[key] == stateAbbrev) {
          return key;
        }
      }
      for (let key in aquiferAreas) {
        if (aquiferAreas[key] == stateAbbrev) {
          return key;
        }
      }
    },
    getLocAqNameFromCode: function(fullLocAqCode) {
      if (fullLocAqCode.length > 11) {
        return "Invalid.";
      }
      let stateAbbrev = fullLocAqCode.substring(0, 2);
      let aqCode = fullLocAqCode.substring(3, 11);
      let stateName = this.getStateNamefromAbbrev(stateAbbrev);
      let stateCode = fipsInfo[stateName];
      let result = "Invalid.";
      localAquiferInfo.forEach(element => {
        if (element["state_cd"] == stateCode && element["aqfr_cd"] == aqCode) {
          result = stateAbbrev + ":" + aqCode;
        }
        if (
          element["state_cd"] == stateAbbrev &&
          element["aqfr_cd"] == aqCode
        ) {
          result = stateAbbrev + ":" + aqCode;
        }
      });
      return result;
    },
    addLocalAq: function() {
      let aquifers = this.locAquifer.split(",");
      aquifers.forEach(element => {
        this.addLocalAqToSelected(element.replace(/\s/g, ""));
      });
    },
    addLocalAqToSelected: function(locAquifer) {
      if (locAquifer == "") {
        notify("no aquifer code selected");
        return;
      }
      if (!(this.getLocAqNameFromCode(locAquifer) == "Invalid.")) {
        if (!this.localAquifers.includes(locAquifer)) {
          if (this.localAquifers.length < 1000) {
            this.localAquifers.push(locAquifer);
          } else {
            notify("Maximum number of Local Aquifers already selected.");
          }
        } else {
          notify("Local Aquifer selected already in selection.");
        }
      } else {
        notify("Invalid Local Aquifer code entered.");
      }
    },
    removeElement: function(index) {
      Vue.delete(this.localAquifers, index);
    },
    commitNatAquifer: function(newValue) {
      this.$store.commit("changeNatAquifer", newValue);
    },
    commitNatAquiferActive: function(newValue) {
      this.$store.commit("changeNatAquiferActive", newValue);
    },
    commitLocAquifer: function() {
      this.$store.commit("changeLocAquifer", this.localAquifers);
    },
    commitLocAquiferActive: function(newValue) {
      this.$store.commit("changeLocAquiferActive", newValue);
    },
    updateStateInput: function(result) {
      if (result !== null && typeof result !== "undefined") {
        this.state = result;
      } else {
        this.state = "";
      }
    },
    updateAqCode: function(result) {
      if (result !== null && typeof result !== "undefined") {
        this.locAquifer = result;
      } else {
        this.locAquifer = "";
      }
    },
    triggerAqCodeRefreshIndicator: function() {
      this.aqCodeRefreshIndicator = !this.aqCodeRefreshIndicator;
    }
  },
  mounted() {
    this.populateStateList();
  },
  watch: {
    state: function() {
      this.populateLocalAqList();
      this.locAquifer = "";
      this.triggerAqCodeRefreshIndicator();
    },
    localAquifers: function(newValue) {
      this.locAqNames = [];
      newValue.forEach(element => {
        this.locAqNames.push(this.getLocAqNameFromCode(element));
      });
      this.commitLocAquifer();
    },
    natAquifer: function(newValue) {
      this.natAquiferActive = newValue != "";
      this.commitNatAquifer(newValue);
      this.commitNatAquiferActive(this.natAquiferActive);
    },
    locAquifer: function(newValue) {
      this.locAquiferActive = newValue != "";
      this.commitLocAquifer(newValue);
      this.commitLocAquiferActive(this.locAquiferActive);
    }
  }
};
</script>
