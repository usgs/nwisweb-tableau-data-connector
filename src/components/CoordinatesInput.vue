<template>
  <div v-show="!disabled">
    <span class="input-desc">
      <label>Northern Boundary Latitude</label>
      <ToolTip
        hint="Note: to ensure fair access, the product of the range of latitude and longitude cannot exceed 25 degrees. Use decimal degrees rather than degrees, minutes and seconds. Decimals are not required, but only six decimals of precision will be used. Longitude is in the range of -180 to 180, latitude from -90 to 90. Remember, in the Western hemisphere, longitude is expressed in negative numbers. Note: many sites outside the continental US do not have latitude and longitude referenced to NAD83 and therefore can not be found using these arguments. Certain sites are not associated with latitude and longitude due to homeland security concerns and cannot be found using this filter."
      ></ToolTip>
    </span>
    <input
      class="usa-input usa-input-custom"
      :disabled="disabled"
      v-model="coordinates.north"
      id="input-type-text"
      name="input-type-text"
      type="text"
    />
    <label class="input-desc" for="input-type-text"
      >Southern Boundary Latitude</label
    >
    <input
      class="usa-input usa-input-custom"
      :disabled="disabled"
      v-model="coordinates.south"
      id="input-type-text"
      name="input-type-text"
      type="text"
    />
    <label class="input-desc" for="input-type-text"
      >Eastern Boundary Longitude</label
    >
    <input
      class="usa-input usa-input-custom"
      :disabled="disabled"
      v-model="coordinates.east"
      id="input-type-text"
      name="input-type-text"
      type="text"
    />
    <label class="input-desc" for="input-type-text"
      >Western Boundary Longitude</label
    >
    <input
      class="usa-input usa-input-custom"
      :disabled="disabled"
      v-model="coordinates.west"
      id="input-type-text"
      name="input-type-text"
      type="text"
    />
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
