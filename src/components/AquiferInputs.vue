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
    <span class="input-desc">
      <label>Local Aquifer Code</label>
      <ToolTip
        hint="Enter up to 1000 local aquifer codes, separated by commas. A complete list of local aquifer codes is linked here."
        url="https://help.waterdata.usgs.gov/code/aqfr_cd_query?fmt=html"
      ></ToolTip>
    </span>
    <input
      v-model="state"
      class="usa-input usa-input-custom"
      list="aqstates"
      type="text"
    />
    <datalist id="aqstates"></datalist>
    <input
      v-model="locAquifer"
      class="usa-input usa-input-custom"
      list="localAquifers"
      type="text"
    />
    <datalist id="localAquifers"></datalist>
    <button
      class="usa-button usa-button-custom"
      v-on:click="addLocalAqToSelected"
    >
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
import localAquiferInfo from "../fetchedValues/aquifer.json";
import Vue from "vue";
import VueTags from "vue-tags";
import { notify } from "../notifications.js";

Vue.component("input-tags", VueTags);

export default {
  name: "AquiferInputs",
  components: {
    ToolTip
  },
  data: function() {
    return {
      state: "",
      natAquifer: "",
      natAquiferActive: "",
      locAquifer: "",
      localAquifers: [],
      locAqNames: [],
      locAquiferActive: ""
    };
  },
  methods: {
    populateStateList: function() {
      let dropDown = document.getElementById("aqstates");
      Object.keys(stateList).forEach(element => {
        let option = document.createElement("option");
        option.text = element;
        option.value = element;
        dropDown.appendChild(option);
      });
    },
    populateLocalAqList: function() {
      let dropDown = document.getElementById("localAquifers");
      Array.prototype.slice
        .call(dropDown.getElementsByTagName("option"))
        .forEach(function(item) {
          dropDown.removeChild(item);
        });
      let aquiferList = this.getLocAquifers(this.state);

      aquiferList.forEach(element => {
        let stateAbbrev = stateList[this.state];
        let option = document.createElement("option");
        option.value = `${stateAbbrev}:${element["aqfr_cd"]}`;
        option.text = element["aqfr_nm"];
        dropDown.appendChild(option);
      });
    },
    getLocAquifers: function(stateName) {
      if (!(stateName in fipsInfo)) {
        return ["No Local Aquifers for this state"];
      }
      let fipsCode = fipsInfo[stateName];
      let result = [];
      for (let key in localAquiferInfo) {
        if (localAquiferInfo[key]["state_cd"] == fipsCode) {
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
    },
    getLocAqNameFromCode: function(fullLocAqCode) {
      if (fullLocAqCode.length != 10) {
        return "invalid";
      }
      let stateAbbrev = fullLocAqCode.substring(0, 2);
      let aqCode = fullLocAqCode.substring(3, 10);
      let stateName = this.getStateNamefromAbbrev(stateAbbrev);
      let stateCode = fipsInfo[stateName];
      let result = "invalid";
      localAquiferInfo.forEach(element => {
        if (element["state_cd"] == stateCode && element["aqfr_cd"] == aqCode) {
          result = stateAbbrev + ":" + aqCode;
        }
      });
      return result;
    },
    addLocalAqToSelected: function() {
      if (!(this.getLocAqNameFromCode(this.locAquifer) == "invalid")) {
        if (!this.localAquifers.includes(this.locAquifer)) {
          if (this.localAquifers.length < 1000) {
            this.localAquifers.push(this.locAquifer);
          } else {
            notify("Maximum number of Local Aquifers already selected.");
          }
        } else {
          notify("Local Aquifer selected already in selection.");
        }
      } else {
        notify("invalid Local Aquifer code entered");
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
    }
  },
  mounted() {
    this.populateStateList();
  },
  watch: {
    state: function() {
      this.populateLocalAqList();
      this.locAquifer = "";
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
