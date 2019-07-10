<template>
  <div v-show="!disabled">
    <form class="usa-form" style="margin: auto;">
      <span>
        <label class="use-input" style="display: inline-block;"
          >Hydrologic unit Code</label
        >
        <ToolTip hint="todo" url="https://www.google.com"></ToolTip>
      </span>
      <input
        class="usa-input"
        :disabled="disabled"
        v-model="hydroUnitCode"
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
