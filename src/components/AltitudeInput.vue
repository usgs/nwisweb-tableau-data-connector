<template>
  <div>
    <br />
    <span class="input-desc">
      <label>Upper Altitude Boundary</label>
      <ToolTip
        hint="Use these fields to specify upper and lower bounds for desired watershed draiage areas of included results. Each number must be a positive integer. If nothing is entered in this field, it will be ignored."
      ></ToolTip>
    </span>
    <input
      class="usa-input usa-input-custom"
      v-model="altitudeBounds.upperAltitudeBound"
      id="input-type-text"
      name="input-type-text"
      type="text"
    />
    <label class="input-desc" for="input-type-text"
      >Lower Altitude Boundary</label
    >
    <input
      class="usa-input usa-input-custom"
      v-model="altitudeBounds.lowerAltitudeBound"
      id="input-type-text"
      name="input-type-text"
      type="text"
    />
  </div>
</template>

<script>
import ToolTip from "../components/ToolTip";

export default {
  name: "AltitudeInput",
  components: {
    ToolTip
  },
  data: function() {
    return {
      altitudeBounds: {
        upperAltitudeBound: "",
        lowerAltitudeBound: ""
      },
      upperAltitudeBoundActive: false,
      lowerAltitudeBoundActive: false
    };
  },
  methods: {
    commitAltitudeBounds: function(newValue) {
      this.$store.commit("changeAltitudeBounds", newValue);
    },
    commitLowerAltitudeBoundActive: function(newValue) {
      this.$store.commit("changeLowerAltitudeBound", newValue);
    },
    commitUpperAltitudeBoundActive: function(newValue) {
      this.$store.commit("changeUpperAltitudeBound", newValue);
    }
  },
  watch: {
    areaBounds: {
      handler: function(newValue) {
        this.commitAltitudeBounds(newValue);
        this.upperAltitudeBoundActive = newValue.upperAltitudeBound != "";
        this.lowerAltitudeBoundActive = newValue.lowerAltitudeBound != "";

        this.commitLowerAltitudeBound(this.upperWatershedAreaBoundsActive);
        this.commitLowerAreaBoundsActive(this.lowerWatershedAreaBoundsActive);
      },
      deep: true
    }
  }
};
</script>
