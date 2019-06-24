<template>
  <div>
    <form class="usa-form">
      <fieldset class="usa-fieldset">
        <legend class="usa-sr-only">Location Query Type</legend>
        <div class="usa-radio">
          <input
            class="usa-radio__input"
            :id="locationModeSite"
            v-model="selected"
            type="radio"
            checked
            name="Location-Query-Type"
            :value="locationModeSite"
          />
          <label class="usa-radio__label" :for="locationModeSite">
            Site ID</label
          >
        </div>
        <div class="usa-radio">
          <input
            class="usa-radio__input"
            :id="locationModeState"
            v-model="selected"
            type="radio"
            name="Location-Query-Type"
            :value="locationModeState"
          />
          <label class="usa-radio__label" :for="locationModeState">
            State or Territory</label
          >
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import { locationMode } from "../enums.js";
export default {
  name: "LocationQueryType",
  data: function() {
    return {
      selected: locationMode.SITE
    };
  },

  updated() {
    this.$store.commit("changeLocationMode", this.selected);
  },
  computed: {
    // fastidious attention to enum correctness
    locationModeState() {
      return locationMode.STATE;
    },
    locationModeSite() {
      return locationMode.SITE;
    }
  }
};
</script>
