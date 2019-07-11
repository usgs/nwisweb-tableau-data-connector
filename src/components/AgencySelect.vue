<template>
  <div>
    <br />
    <label class="autocomplete-dropdown">Agency Code</label>
    <input
      v-model="agency"
      class="usa-input"
      type="text"
      list="agencylist"
      style="width: 300px; margin: auto;"
    />
    <datalist id="agencylist"> </datalist>
  </div>
</template>

<script>
import agencies from "../fetchedValues/agency.json";

export default {
  name: "AgencySelect",
  data: function() {
    return {
      agency: ""
    };
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
