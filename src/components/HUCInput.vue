<template>
  <div v-show="!disabled">
    <span class="input-desc">
      <label>Hydrologic Unit Code</label>
      <ToolTip
        hint="The complete list of hydrologic unit codes is available here."
        url="https://water.usgs.gov/GIS/huc_name.html"
      ></ToolTip>
    </span>
    <input
      class="usa-input usa-input-custom"
      :disabled="disabled"
      v-model="hydroUnitCode"
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
