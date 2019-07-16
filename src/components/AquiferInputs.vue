<template>
  <div>
    <span class="input-desc">
      <label>Sites Contained within these National Aquifer Codes</label>
      <ToolTip
        hint="Enter up to 1000 national aquifer codes, separated by commas. A complete list of national aquifer codes is linked here."
        url="https://water.usgs.gov/ogw/NatlAqCode-reflist.html"
      ></ToolTip>
    </span>
    <input
      class="usa-input usa-input-custom"
      v-model="hydroUnitCode"
      id="input-type-text"
      name="input-type-text"
      type="text"
    />
    <span class="input-desc">
      <label>Sites Contained within these Local Aquifer Codes</label>
      <ToolTip
        hint="Enter up to 1000 local aquifer codes, separated by commas. A complete list of local aquifer codes is linked here."
        url="https://help.waterdata.usgs.gov/code/aqfr_cd_query?fmt=html"
      ></ToolTip>
    </span>
    <input
      class="usa-input usa-input-custom"
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
  name: "AquiferInputs",
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
