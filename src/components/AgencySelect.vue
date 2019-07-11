<template>
  <div>
    <br />
    <span class="input-desc">
      <label>Agency Code</label>
      <ToolTip
        hint="The complete list of agency codes is available here. This is an optional parameter. Only one agency code may be selected at a time."
        url="https://help.waterdata.usgs.gov/code/agency_cd_query?fmt=html?display=inline"
      ></ToolTip>
    </span>
    <input
      v-model="agency"
      class="usa-input usa-input-custom"
      type="text"
      list="agencylist"
    />
    <datalist id="agencylist"> </datalist>
  </div>
</template>

<script>
import agencies from "../fetchedValues/agency.json";
import ToolTip from "../components/ToolTip";

export default {
  name: "AgencySelect",
  data: function() {
    return {
      agency: ""
    };
  },
  components: {
    ToolTip
  },
  methods: {
    populateAgencyList: function() {
      let dropDown = document.getElementById("agencylist");
      agencies.forEach(element => {
        let option = document.createElement("option");
        option.text = element["party_nm"];
        option.value = element["agency_cd"];
        dropDown.appendChild(option);
      });
    },
    commitAgencySelection: function(newValue) {
      let agencyActive = newValue != "";
      this.$store.commit("changeAgencyActive", agencyActive);
      this.$store.commit("changeAgencyCode", newValue);
    }
  },
  mounted() {
    this.populateAgencyList();
  },
  watch: {
    agency: function(newValue) {
      this.commitAgencySelection(newValue);
    }
  }
};
</script>
