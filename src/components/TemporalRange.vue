<template>
  <div>
    <br />
    <span class="label-span">
      <label>Duration Code</label>
      <ToolTip
        hint="A link to a detailed explanation of the ISO 8601 duration format specification is available here. The format should look like P&ltdate&gtT&lttime&gt with the caveat that P must always be present and T must only be present if it is not the last character"
        url="https://en.wikipedia.org/wiki/ISO_8601#Durations"
      ></ToolTip>
    </span>
    <input v-model="durationCode" class="usa-input" />
  </div>
</template>

<script>
import ToolTip from "../components/ToolTip";
//import Datepicker from "vuejs-datepicker";

export default {
  name: "TemporalRange",
  data: function() {
    return {
      durationCode: ""
    };
  },
  components: {
    ToolTip
    // Datepicker
  },
  methods: {
    commitDurationCode: function(newValue) {
      let durationCodeActive = this.durationCode != "";
      this.$store.commit("changeDurationCodeActive", durationCodeActive);
      this.$store.commit("changeDurationCode", newValue);
    }
  },
  watch: {
    durationCode: function(newValue) {
      this.commitDurationCode(newValue);
    }
  }
};
</script>
