<template>
  <div v-show="!disabled">
    <span class="input-desc">
      <label>Site or Sites</label>
      <ToolTip
        hint="This field takes comma-separated 8-15 digit site codes. Open this link in a new tab to use the NWISWeb location finder, remember to limit your search to time-series sites."
        url="http://maps.waterdata.usgs.gov/mapper/"
      ></ToolTip>
    </span>
    <input
      class="usa-input usa-input-custom"
      v-model="sites"
      :disabled="disabled"
    />
  </div>
</template>

<script>
import ToolTip from "../components/ToolTip";
import { locationMode } from "../enums.js";
import { mapState } from "vuex";

export default {
  name: "SiteSelect",
  props: {
    msg: String
  },
  components: {
    ToolTip
  },
  data: function() {
    return {
      sites: "",
      activeLocationMode: locationMode.SITE
    };
  },
  methods: {
    commitSites: function(input) {
      this.$store.commit("changeSites", input);
    }
  },
  watch: {
    locationMode(newValue) {
      this.activeLocationMode = newValue;
      if (newValue != locationMode.SITE) {
        this.sites = "";
      }
    },
    sites(newValue) {
      this.commitSites(newValue);
    }
  },
  computed: {
    ...mapState(["locationMode"]),
    disabled() {
      return this.activeLocationMode != locationMode.SITE;
    }
  }
};
</script>
