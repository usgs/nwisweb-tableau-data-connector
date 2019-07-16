<template>
  <div>
    <br />
    <span class="input-desc">
      <label>Watershed Drainage Area Upper Boundary</label>
      <ToolTip
        hint="Use these fields to specify upper and lower bounds for desired watershed draiage areas of included results. Each number must be a positive integer. If nothing is entered in this field, it will be ignored."
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
      areaBoundsActive: false
    };
  },
  methods: {
    commitWatershedAreabounds: function(newValue) {
      this.$store.commit("changeWatershedAreaBounds", newValue);
    },
    commitAreaBoundsActive: function(newValue) {
      this.$store.commit("changeWatershedAreaBoundsActive", newValue);
    }
  },
  watch: {
    areaBounds: {
      handler: function(newValue) {
        this.commitWatershedAreabounds(newValue);
        this.areaBoundsActive =
          newValue.upperAreaBound != "" || newValue.lowerAreaBound != "";
        this.commitAreaBoundsActive(this.areaBoundsActive);
      },
      deep: true
    }
  }
};
</script>
