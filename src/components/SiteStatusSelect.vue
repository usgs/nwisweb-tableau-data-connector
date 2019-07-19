<template>
  <div style="margin:auto;">
    <span class="input-desc">
      <label>Site Status</label>
      <ToolTip
        hint="The site status indicates whether the site is active or inactive. A site is considered active if:
it has collected time-series (automated) data within the last 183 days (6 months),
it has collected discrete (manually collected) data within 397 days (13 months).
If it does not meet these criteria, it is considered inactive. Some exceptions apply. If a site is flagged by a USGS water science center as discontinued, it will show as inactive. A USGS science center can also flag a new site as active even if it has not collected any data.

"
      ></ToolTip>
    </span>
    <form :key="selected" class="usa-form">
      <fieldset class="usa-fieldset">
        <legend class="usa-sr-only">Site Status</legend>

        <div class="usa-radio usa-radio-custom">
          <input
            class="usa-radio__input"
            id="all"
            v-model="selected"
            type="radio"
            checked
            name="Location-Query-Type"
            value="all"
          />
          <label class="usa-radio__label" for="all"> All Sites</label>
        </div>
        <div class="usa-radio usa-radio-custom">
          <input
            class="usa-radio__input"
            id="active"
            v-model="selected"
            type="radio"
            name="Location-Query-Type"
            value="active"
          />
          <label class="usa-radio__label" for="active">
            Active Sites Only
          </label>
        </div>
        <div class="usa-radio usa-radio-custom">
          <input
            class="usa-radio__input"
            id="inactive"
            v-model="selected"
            type="radio"
            name="Location-Query-Type"
            value="inactive"
          />
          <label class="usa-radio__label" for="inactive">
            Inactive Sites Only
          </label>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import ToolTip from "../components/ToolTip";
export default {
  name: "SiteStatusSelect",
  data: function() {
    return {
      selected: "all"
    };
  },
  components: {
    ToolTip
  },
  methods: {
    commitSiteStatus: function(input) {
      this.$store.commit("changeSiteStatus", input);
    }
  },
  watch: {
    selected: function(newValue /*, oldValue*/) {
      this.commitSiteStatus(newValue);
    }
  }
};
</script>
