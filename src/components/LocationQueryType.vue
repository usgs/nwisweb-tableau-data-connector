<template>
  <div>
    <form class="usa-form">
      <fieldset class="usa-fieldset">
        <legend class="usa-sr-only">Location Query Type</legend>
        <div class="usa-radio">
          <input
            class="usa-radio__input"
            id="site"
            v-model="selected"
            type="radio"
            checked
            name="Location-Query-Type"
            value="site"
          />
          <label class="usa-radio__label" for="site">Site ID</label>
        </div>
        <div class="usa-radio">
          <input
            class="usa-radio__input"
            id="state"
            v-model="selected"
            type="radio"
            name="Location-Query-Type"
            value="state"
          />
          <label class="usa-radio__label" for="state">State or Territory</label>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import { locationMode } from "../enums.js";
export default {
  name: "LocationQueryType",
  data: function() {
    return {
      locationModeEnum: locationMode, //todo refactor this
      selected: "site"
    };
  },
  /*
we translate local hardcoded strings to enums here because it would be difficult to initialize the 
radiobuttons to use the enums. 
*/
  updated() {
    let selectionEnum = "";
    switch (this.selected) {
      case "site":
        selectionEnum = locationMode.SITE;
        break;
      case "state":
        selectionEnum = locationMode.STATE;
        break;
    }
    alert(this.selected);
    this.$store.commit("changeLocationMode", selectionEnum);
  }
};
</script>
