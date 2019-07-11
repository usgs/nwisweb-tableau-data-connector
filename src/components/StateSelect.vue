<template>
  <div v-show="!disabled">
    <br />
    <span>
      <label class="use-input" style="display: inline-block;"
        >State or Territory</label
      >
      <ToolTip
        hint="This field takes one US State or territory name, with the first letter capitalized. The list of allowed states and territories mirrors the list of allowed states and territories in the tool linked here. "
        url="https://waterservices.usgs.gov/rest/IV-Test-Tool.html"
      ></ToolTip>
    </span>
    <input
      v-model="state"
      :disabled="disabled"
      class="usa-input"
      type="text"
      list="states"
      style="width: 300px; margin: auto;"
    />
    <datalist id="states"> </datalist>
  </div>
</template>

<script>
import { locationMode } from "../enums.js";
import { mapState } from "vuex";
import ToolTip from "./ToolTip";
import stateList from "../fetchedValues/states.json";

export default {
  name: "StateSelect",
  components: {
    ToolTip
  },
  data: function() {
    return {
      state: "",
      activeLocationMode: locationMode.SITE
    };
  },
  methods: {
    populateStateList: function() {
      let dropDown = document.getElementById("states");
      Object.keys(stateList).forEach(element => {
        let option = document.createElement("option");
        option.text = element;
        option.value = element;
        dropDown.appendChild(option);
      });
    },
    commitStateSelection: function(newValue) {
      this.$store.commit("changeUSStateName", newValue);
    }
  },
  mounted() {
    this.populateStateList();
  },
  watch: {
    locationMode(newValue) {
      this.activeLocationMode = newValue;
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
