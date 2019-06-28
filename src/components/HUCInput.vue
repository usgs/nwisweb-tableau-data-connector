<template>
  <div v-show="!disabled">
    <form class="usa-form" style="margin: auto;">
      <label class="usa-label" for="input-type-text"
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
export default {
  name: "CoordinatesInput",
  data: function() {
    return {
      hydroUnitCode: "",
      activeLocationMode: locationMode.SITE
    };
  },
  updated() {
    this.$store.commit("changeHydroCode", this.hydroUnitCode);
  },
  mounted: function() {
    let store = this.$store;
    store.subscribe((mutation) /*, state*/ => {
      if (mutation.type == "changeLocationMode") {
        this.activeLocationMode = store.getters.locationMode;
        if (store.getters.locationMode != locationMode.HYDRO) {
          this.state = "";
        }
      }
    });
  },
  computed: {
    disabled() {
      return this.activeLocationMode != locationMode.HYDRO;
    }
  }
};
</script>
