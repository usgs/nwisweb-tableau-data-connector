<template>
  <div>
    <span class="input-desc">
      <label>Sites Contained within these National Aquifer Codes</label>
      <ToolTip
        hint="Enter up to 1000 national aquifer codes, separated by commas. Each National Aquifer Code is 10 digits. A complete list of national aquifer codes is linked here."
        url="https://water.usgs.gov/ogw/NatlAqCode-reflist.html"
      ></ToolTip>
    </span>
    <input
      class="usa-input usa-input-custom"
      v-model="natAquifer"
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
      v-model="locAquifer"
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
      natAquiferActive: "",
      locAquifer: "",
      locAquiferActive: "",
    };
  },
  methods: {
    commitNatAquifer: function(newValue) {
      this.$store.commit("changeNatAquifer", newValue);
    },
    commitNatAquiferActive: function(newValue) {
      this.$store.commit("changeNatAquiferActive", newValue);
    },
    commitLocAquifer: function(newValue) {
      this.$store.commit("changeLocAquifer", newValue);
    },
    commitLocAquiferActive: function(newValue) {
      this.$store.commit("changeLocAquiferActive", newValue);
    },
  },
  watch: {
    natAquifer: function(newValue) {
      this.natAquiferActive = newValue != "";
      this.commitNatAquifer(newValue);
      this.commitNatAquiferActive(this.natAquiferActive);
    },
    locAquifer: function(newValue) {
      this.locAquiferActive = newValue != "";
      this.commitLocAquifer(newValue);
      this.commitLocAquiferActive(this.locAquiferActive);
    }
  }
};
</script>
