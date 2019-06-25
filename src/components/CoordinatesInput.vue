<template>
  <div v-show="!disabled">
    <form class="usa-form" style="margin: auto;">
      <label class="usa-label" for="input-type-text"
        >Northern Boundary Latitude</label
      >
      <input
        class="usa-input"
        :disabled="disabled"
        v-model="coordinates.north"
        id="input-type-text"
        name="input-type-text"
        type="text"
      />
      <label class="usa-label" for="input-type-text"
        >Southern Boundary Latitude</label
      >
      <input
        class="usa-input"
        :disabled="disabled"
        v-model="coordinates.south"
        id="input-type-text"
        name="input-type-text"
        type="text"
      />
      <label class="usa-label" for="input-type-text"
        >Eastern Boundary Longitude</label
      >
      <input
        class="usa-input"
        :disabled="disabled"
        v-model="coordinates.east"
        id="input-type-text"
        name="input-type-text"
        type="text"
      />
      <label class="usa-label" for="input-type-text"
        >Western Boundary Longitude</label
      >
      <input
        class="usa-input"
        :disabled="disabled"
        v-model="coordinates.west"
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
      coordinates: {
        north: "",
        south: "",
        east: "",
        west: ""
      },
      activeLocationMode: locationMode.SITE
    };
  },
  updated() {
    this.$store.commit("changeCoordinates", this.coordinates);
  },
  mounted: function() {
    let store = this.$store;
    store.subscribe((mutation) /*, state*/ => {
      if (mutation.type == "changeLocationMode") {
        this.activeLocationMode = store.getters.locationMode;
        if (store.getters.locationMode != locationMode.COORDS) {
          this.state = "";
        }
      }
    });
  },
  computed: {
    disabled() {
      return this.activeLocationMode != locationMode.COORDS;
    }
  }
};
</script>
