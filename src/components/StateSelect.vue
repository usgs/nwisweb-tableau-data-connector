<template>
  <div v-show="!disabled">
    <br />
    <label class="input-label">State or Territory</label>
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
import stateList from "../fetchedValues/states.json";

export default {
  name: "StateSelect",
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
