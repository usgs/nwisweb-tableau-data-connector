<template>
  <div>
    <br />
    <span class="input-desc">
      <label>Watershed Drainage Area Upper Boundary</label>
      <ToolTip
        hint="Use these fields to specify upper and lower bounds for desired watershed drainage areas of included results. Each number must be a positive integer. If nothing is entered in this field, it will be ignored."
      ></ToolTip>
    </span>
    <input
      class="usa-input usa-input-custom"
      v-model="areaBounds.upperAreaBound"
      id="input-type-text"
      name="input-type-text"
      type="text"
    />
    <label class="input-desc" for="input-type-text"
      >Watershed Drainage Area Lower Boundary</label
    >
    <input
      class="usa-input usa-input-custom"
      v-model="areaBounds.lowerAreaBound"
      id="input-type-text"
      name="input-type-text"
      type="text"
    />
  </div>
</template>

<script>
import ToolTip from "../components/ToolTip";

export default {
  name: "WatershedInput",
  components: {
    ToolTip
  },
  data: function() {
    return {
      areaBounds: {
        upperAreaBound: "",
        lowerAreaBound: ""
      },
      upperWatershedAreaBoundsActive: false,
      lowerWatershedAreaBoundsActive: false
    };
  },
  methods: {
    commitWatershedAreabounds: function(newValue) {
      this.$store.commit("changeWatershedAreaBounds", newValue);
    },
    commitUpperAreaBoundsActive: function(newValue) {
      this.$store.commit("changeUpperWatershedAreaBoundsActive", newValue);
    },
    commitLowerAreaBoundsActive: function(newValue) {
      this.$store.commit("changeLowerWatershedAreaBoundsActive", newValue);
    }
  },
  watch: {
    areaBounds: {
      handler: function(newValue) {
        this.commitWatershedAreabounds(newValue);
        this.upperWatershedAreaBoundsActive = newValue.upperAreaBound != "";
        this.lowerWatershedAreaBoundsActive = newValue.lowerAreaBound != "";

        this.commitUpperAreaBoundsActive(this.upperWatershedAreaBoundsActive);
        this.commitLowerAreaBoundsActive(this.lowerWatershedAreaBoundsActive);
      },
      deep: true
    }
  }
};
</script>
