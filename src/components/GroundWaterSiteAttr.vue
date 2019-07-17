<template>
  <div>
    <span class="input-desc">
      <label>Well minimum depth in feet</label>
      <ToolTip
        hint="These arguments allow you to select finished wells with the desired depth from the land surface datum, expressed in feet. If neither field is specified, well depth is ignored. If both the minimum and maximum well depths are specified, then sites between the minimum and maximum well depth are returned. If only one is provided, then only sites at or above the well depth or at or below the well depth are returned."
      ></ToolTip>
    </span>
    <input
      class="usa-input usa-input-custom"
      v-model="GWSiteAttrDepths.wellMin"
      type="text"
    />
    <span class="input-desc">
      <label>Well maximum depth in feet</label>
    </span>
    <input
      class="usa-input usa-input-custom"
      v-model="GWSiteAttrDepths.wellMax"
      type="text"
    />

    <span class="input-desc">
      <label>Hole minimum depth in feet</label>
      <ToolTip
        hint="These arguments allows you to select sites where the hole was initially drilled within a given range, with the depth from the land surface expressed in feet. If neither field is specified, hole depth is ignored. If both the minimum and maximum hole depths are specified, sites between the minimum and maximum hole depth are returned. If only one is provided, then only sites at or above the hole depth or at or below the hole depth are returned."
      ></ToolTip>
    </span>
    <input
      class="usa-input usa-input-custom"
      v-model="GWSiteAttrDepths.holeMin"
      type="text"
    />
    <span class="input-desc">
      <label>Hole maximum depth in feet</label>
    </span>
    <input
      class="usa-input usa-input-custom"
      v-model="GWSiteAttrDepths.holeMax"
      type="text"
    />
  </div>
</template>

<script>
import ToolTip from "../components/ToolTip";

export default {
  name: "GroundWaterSiteAttr",
  components: {
    ToolTip
  },
  data: function() {
    return {
      GWSiteAttrDepths: {
        wellMin: "",
        wellMax: "",
        holeMin: "",
        holeMax: ""
      },
      wellMinActive: false,
      wellMaxActive: false,
      holeMinActive: false,
      holeMaxActive: false
    };
  },
  methods: {
    commitWellMinActive: function(newValue) {
      this.$store.commit("changeWellMinActive", newValue);
    },
    commitWellMaxActive: function(newValue) {
      this.$store.commit("changeWellMaxActive", newValue);
    },
    commitHoleMinActive: function(newValue) {
      this.$store.commit("changeHoleMinActive", newValue);
    },
    commitHoleMaxActive: function(newValue) {
      this.$store.commit("changeHoleMaxActive", newValue);
    },
    commitGWSiteAttrDepths: function(newValue) {
      this.$store.commit("changeGWSiteAttrDepths", newValue);
    }
  },
  watch: {
    GWSiteAttrDepths: {
      handler: function(newValue) {
        this.commitGWSiteAttrDepths(newValue);

        this.wellMinActive = newValue.wellMin != "";
        this.wellMaxActive = newValue.wellMax != "";
        this.holeMinActive = newValue.holeMin != "";
        this.holeMaxActive = newValue.holeMax != "";

        this.commitWellMinActive(this.wellMinActive);
        this.commitWellMaxActive(this.wellMaxActive);
        this.commitHoleMinActive(this.holeMinActive);
        this.commitHoleMaxActive(this.holeMaxActive);
      },
      deep: true
    }
  }
};
</script>
