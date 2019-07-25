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
    <CustomAutoComplete
      v-on:valueupdate="updateAgencyInput"
      v-on:clear="updateAgencyInput"
      :source="agencyList"
      input-class="usa-input usa-input-custom"
    ></CustomAutoComplete>
  </div>
</template>

<script>
import agencies from "../fetchedValues/agency.json";
import ToolTip from "../components/ToolTip";
import CustomAutoComplete from "../components/CustomAutoComplete";

export default {
  name: "AgencySelect",
  data: function() {
    return {
      agency: "",
      agencyList: []
    };
  },
  components: {
    ToolTip,
    CustomAutoComplete
  },
  methods: {
    populateAgencyList: function() {
      this.agencyList = agencies.map(element => {
        return { name: element["party_nm"], id: element["agency_cd"] };
      });
    },
    commitAgencySelection: function(newValue) {
      let agencyActive = newValue != "";
      this.$store.commit("changeAgencyActive", agencyActive);
      this.$store.commit("changeAgencyCode", newValue);
    },
    updateAgencyInput: function(result) {
      if (result !== null && typeof result !== "undefined") {
        this.agency = result;
      } else {
        this.agency = "";
      }
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
