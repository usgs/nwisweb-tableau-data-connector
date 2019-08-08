<template>
  <div>
    <br />
    <span class="input-desc">
      <label>Upper Altitude Boundary</label>
      <ToolTip
        hint="Use these fields to specify upper and lower bounds for site altitude. If these fields are left empty, sites will not be filtered by altitude. Negative values for altitude are allowed."
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
      this.$store.commit("changeLowerAltitudeBoundActive", newValue);
    },
    commitUpperAltitudeBoundActive: function(newValue) {
      this.$store.commit("changeUpperAltitudeBoundActive", newValue);
    }
  },
  watch: {
    altitudeBounds: {
      handler: function(newValue) {
        this.commitAltitudeBounds(newValue);
        this.upperAltitudeBoundActive = newValue.upperAltitudeBound != "";
        this.lowerAltitudeBoundActive = newValue.lowerAltitudeBound != "";

        this.commitUpperAltitudeBoundActive(this.upperAltitudeBoundActive);
        this.commitLowerAltitudeBoundActive(this.lowerAltitudeBoundActive);
      },
      deep: true
    }
  }
};
</script>
