<template>
  <div>
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
import { mapState } from "vuex";

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
  watch: {
    locationMode(newValue) {
      this.activeLocationMode = newValue;
      if (newValue != locationMode.COORDS) {
        this.coordinates = { north: "", south: "", east: "", west: "" };
      }
    }
  },
  computed: {
    ...mapState(["locationMode"]),
    disabled() {
      return this.activeLocationMode != locationMode.COORDS;
    }
  }
};
</script>
