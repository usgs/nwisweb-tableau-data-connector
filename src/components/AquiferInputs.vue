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
      v-model="natAquiferCode"
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
      v-model="locAquiferCode"
      type="text"
    />
  </div>
</template>

<script>
import ToolTip from "../components/ToolTip";

export default {
  name: "AquiferInputs",
  components: {
    ToolTip
  },
  data: function() {
    return {
      natAquifer: "",
      locAquifer: ""
    };
  },
  methods: {
    commitNatAquifer: function(newValue) {
      this.$store.commit("changeNatAquiferCode", newValue);
    },
    commitLocAquifer: function(newValue) {
      this.$store.commit("changeLocAquiferCode", newValue);
    }
  },
  watch: {
    natAquifer: function(newValue) {
      this.commitNatAquifer(newValue);
    },
    locAquifer: function(newValue) {
      this.commitLocAquifer(newValue);
    }
  }
};
</script>
