<template>
  <div style="margin:auto;">
    <form :key="selected" class="usa-form">
      <fieldset class="usa-fieldset">
        <legend class="usa-sr-only">Location Query Type</legend>
        <div class="usa-radio usa-radio-custom">
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
        <div class="usa-radio usa-radio-custom">
          <input
            class="usa-radio__input"
            :id="locationModeState"
            v-model="selected"
            type="radio"
            name="Location-Query-Type"
            :value="locationModeState"
          />
          <label class="usa-radio__label" :for="locationModeState">
            State or Territory
          </label>
        </div>
        <div class="usa-radio usa-radio-custom">
          <input
            class="usa-radio__input"
            :id="locationModeCoords"
            v-model="selected"
            type="radio"
            name="Location-Query-Type"
            :value="locationModeCoords"
          />
          <label class="usa-radio__label" :for="locationModeCoords">
            Coordinate Bounding Box
          </label>
        </div>
        <div class="usa-radio usa-radio-custom">
          <input
            class="usa-radio__input"
            :id="locationModeHydro"
            v-model="selected"
            type="radio"
            name="Location-Query-Type"
            :value="locationModeHydro"
          />
          <label class="usa-radio__label" :for="locationModeHydro">
            Hydrologic Unit Code
          </label>
        </div>
        <div class="usa-radio usa-radio-custom">
          <input
            class="usa-radio__input"
            :id="locationModeCounty"
            v-model="selected"
            type="radio"
            name="Location-Query-Type"
            :value="locationModeCounty"
          />
          <label class="usa-radio__label" :for="locationModeCounty">
            County Code
          </label>
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
  methods: {
    commitGlobalLocationMode: function(input) {
      this.$store.commit("changeLocationMode", input);
    }
  },
  watch: {
    selected: function(newValue /*, oldValue*/) {
      this.commitGlobalLocationMode(newValue);
    }
  },
  computed: {
    // fastidious attention to enum correctness
    locationModeState() {
      return locationMode.STATE;
    },
    locationModeSite() {
      return locationMode.SITE;
    },
    locationModeCoords() {
      return locationMode.COORDS;
    },
    locationModeHydro() {
      return locationMode.HYDRO;
    },
    locationModeCounty() {
      return locationMode.COUNTY;
    }
  }
};
</script>
