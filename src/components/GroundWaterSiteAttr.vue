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
import { mapState } from "vuex";
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
      }
    };
  },
  methods: {
    commitGroundWaterSiteAttr: function() {
      console.log(this.GWSiteAttrDepths);
      let GWSiteAttrActive = true;
      this.$store.commit("changeGWSiteAttrActive", GWSiteAttrActive);
      this.$store.commit("changeGWSiteAttrDepths", this.GWSiteAttrDepths);
    }
  },
  watch: {
    GWSiteAttrDepths: {
      handler: function() {
        this.commitGroundWaterSiteAttr();
      },
      deep: true
    }
  }
};
</script>
