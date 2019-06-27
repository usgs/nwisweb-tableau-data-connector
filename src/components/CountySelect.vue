<template>
  <div v-show="!disabled">
    <br />
    <label class="autocomplete-dropdown">State or Territory</label>
    <input
      v-model="state"
      :disabled="disabled"
      class="usa-input"
      list="states"
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
      list="counties"
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
      alert(JSON.stringify(stateList));
      Object.keys(stateList).forEach(element => {
        let option = document.createElement("option");
        option.text = element;
        option.value = element;
        dropDown.appendChild(option);
      });
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
