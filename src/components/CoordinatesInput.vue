<template>
  <div v-show="!disabled">
    <form class="usa-form">
      <label class="usa-label input-label" for="input-type-text"
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
      <label class="usa-label input-label" for="input-type-text"
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
      <label class="usa-label input-label" for="input-type-text"
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
      <label class="usa-label input-label" for="input-type-text"
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
  methods: {
    commitCoordinateSelection: function(newValue) {
      this.$store.commit("changeCoordinates", newValue);
    }
  },
  watch: {
    locationMode(newValue) {
      this.activeLocationMode = newValue;
      if (newValue != locationMode.COORDS) {
        this.coordinates = { north: "", south: "", east: "", west: "" };
      }
    },
    coordinates: {
      handler: function(newValue) {
        this.commitCoordinateSelection(newValue);
      },
      deep: true
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
