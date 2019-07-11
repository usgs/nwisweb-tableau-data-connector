<template>
  <div v-show="!disabled">
    <form class="usa-form" style="margin: auto;">
      <label class="usa-label input-label" for="input-type-text"
        >Hydrologic Unit Code</label
      >
      <input
        class="usa-input"
        :disabled="disabled"
        v-model="hydroUnitCode"
        id="input-type-text"
        name="input-type-text"
        type="text"
      />
    </form>
  </div>
</template>

<script>
import { locationMode } from "../enums.js";
import { mapState } from "vuex";

export default {
  name: "CoordinatesInput",
  data: function() {
    return {
      hydroUnitCode: "",
      activeLocationMode: locationMode.SITE
    };
  },
  methods: {
    commitHydroCodes: function() {
      this.$store.commit("changeHydroCode", this.hydroUnitCode);
    }
  },
  watch: {
    hydroUnitCode: function(newValue) {
      this.commitHydroCodes(newValue);
    },
    locationMode: function(newLocationMode) {
      if (newLocationMode != locationMode.HYDRO) {
        this.hydroUnitCode = "";
      }
      this.activeLocationMode = newLocationMode;
    }
  },
  computed: {
    ...mapState(["locationMode"]),
    disabled() {
      return this.activeLocationMode != locationMode.HYDRO;
    }
  }
};
</script>
