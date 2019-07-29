<template>
  <div v-show="!disabled">
    <span class="input-desc">
      <label>State or Territory</label>
      <ToolTip
        hint="This field takes one US State or territory name, with the first letter of each word capitalized. The list of allowed states and territories mirrors the list of allowed states and territories in the tool linked here. "
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
  </div>
</template>

<script>
import { locationMode } from "../enums.js";
import { mapState } from "vuex";
import ToolTip from "./ToolTip";
import stateList from "../fetchedValues/states.json";
import CustomAutoComplete from "../components/CustomAutoComplete";

export default {
  name: "StateSelect",
  components: {
    ToolTip,
    CustomAutoComplete
  },
  data: function() {
    return {
      state: "",
      stateSearchList: [],
      stateAutoCompleteRefreshIndicator: true,
      activeLocationMode: locationMode.SITE
    };
  },
  methods: {
    populateStateList: function() {
      Object.keys(stateList).forEach(element => {
        this.stateSearchList.push({ name: element, id: element });
      });
    },
    commitStateSelection: function(newValue) {
      this.$store.commit("changeUSStateName", newValue);
    },
    updateStateInput: function(result) {
      if (result !== null && typeof result !== "undefined") {
        this.state = result;
      } else {
        this.state = "";
      }
    },
    triggerStateAutoCompleteRefreshIndicator: function() {
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
      this.triggerStateAutoCompleteRefreshIndicator();
      if (newValue != locationMode.STATE) {
        this.state = "";
      }
    },
    state: function(newValue) {
      this.commitStateSelection(newValue);
    }
  },
  computed: {
    ...mapState(["locationMode"]),
    disabled() {
      return this.activeLocationMode != locationMode.STATE;
    }
  }
};
</script>
