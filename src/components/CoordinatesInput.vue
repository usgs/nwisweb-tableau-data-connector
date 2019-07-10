<template>
  <div v-show="!disabled">
    <form class="usa-form" style="margin: auto;">
      <span>
        <label class="use-input" style="display: inline-block;"
          >Northern Boundary Latitude</label
        >
        <ToolTip hint="todo" url="https://www.google.com"></ToolTip>
      </span>
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
import ToolTip from "../components/ToolTip";

export default {
  name: "CoordinatesInput",
  components: {
    ToolTip
  },
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
