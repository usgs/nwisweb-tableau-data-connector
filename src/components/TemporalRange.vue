<template>
  <div>
    <div>
      <form class="input-desc">
        <fieldset class="usa-fieldset">
          <span>
            <input
              class="usa-checkbox__input"
              v-model="timeBoundsActive"
              id="durationCodeField"
              type="checkbox"
              name="historical-figures-1"
              value="durationCodeField"
            />
            <label class="usa-checkbox__label" for="durationCodeField">
              Set Date Time Boundaries
            </label>
          </span>
        </fieldset>
      </form>
    </div>
    <div class="left-aligned-span" v-show="timeboundsenabled">
      <span class="input-desc">
        <label style="display: inline-block;">Start Time</label>
        <ToolTip
          hint="Use this field to specify temporal boundaries for the timestamps of returned data. If this field is active, both timezone fields and both datetime fields must be filled out. The end datetime cannot come before the start datetime. "
        ></ToolTip>
      </span>
      <VueCtkDateTimePicker
        style="display:inline-block;"
        format="YYYY-MM-DDTHH:mmZ"
        v-model="startDateTime"
        ><input class="usa-input usa-input-custom"
      /></VueCtkDateTimePicker>

      <span class="input-desc">
        <label>End Time</label>
      </span>

      <VueCtkDateTimePicker
        style="display: inline-block;"
        format="YYYY-MM-DDTHH:mmZ"
        v-model="endDateTime"
        ><input class="usa-input usa-input-custom"
      /></VueCtkDateTimePicker>
      <label>Time Zone</label>

      <select
        v-model="timeZone"
        id="tzselect"
        class="usa-select timezone-select"
      ></select>
    </div>
    <br />
    <span class="input-desc">
      <label>Modified Since</label>
      <ToolTip
        hint="This parameterizes the query to return data only from sites which updated their values within a specified duration in the past. A link to a detailed explanation of the ISO 8601 duration format specification is available here. The format should look like P&ltdate&gtT&lttime&gt with the caveat that P must always be present and T must only be present if it is not the last character"
        url="https://en.wikipedia.org/wiki/ISO_8601#Durations"
      ></ToolTip>
    </span>
    <input v-model="modifiedSinceCode" class="usa-input usa-input-custom" />
    <br />
    <span class="input-desc">
      <label>Duration Code</label>
      <ToolTip
        hint="This parameterizes the query to return data from up to a specified duration in the past. A link to a detailed explanation of the ISO 8601 duration format specification is available here. The format should look like P&ltdate&gtT&lttime&gt with the caveat that P must always be present and T must only be present if it is not the last character"
        url="https://en.wikipedia.org/wiki/ISO_8601#Durations"
      ></ToolTip>
    </span>
    <input v-model="durationCode" class="usa-input usa-input-custom" />
    <br />
  </div>
</template>

<script>
import ToolTip from "../components/ToolTip";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import timezones from "../fetchedValues/timezones.json";

export default {
  name: "TemporalRange",
  data: function() {
    return {
      durationCode: "",
      startDateTime: "",
      timeZone: "",
      endDateTime: "",
      modifiedSinceCode: "",
      timeBoundsActive: false
    };
  },
  components: {
    ToolTip,
    VueCtkDateTimePicker
  },
  methods: {
    commitDurationCode: function(newValue) {
      let durationCodeActive = this.durationCode != "";
      this.$store.commit("changeDurationCodeActive", durationCodeActive);
      this.$store.commit("changeDurationCode", newValue);
    },
    commitStartDateTime: function(newValue) {
      this.$store.commit("changeStartDateTime", newValue);
    },
    commitEndDateTime: function(newValue) {
      this.$store.commit("changeEndDateTime", newValue);
    },
    commitTimeZone: function(newValue) {
      this.$store.commit("changeTimeZone", newValue);
    },
    commitTemporalRangeActive: function(newValue) {
      this.$store.commit("changeTemporalRangeActive", newValue);
    },
    commitModifiedSinceCode: function(newValue) {
      let modifiedSinceCodeActive = this.modifiedSinceCode != "";
      this.$store.commit(
        "changeModifiedSinceCodeActive",
        modifiedSinceCodeActive
      );
      this.$store.commit("changeModifiedSinceCode", newValue);
    },
    populateTimeZoneList: function(formName) {
      let dropDown = document.getElementById(formName);
      timezones.forEach(element => {
        let option = document.createElement("option");
        option.text = element;
        option.value = element;
        dropDown.appendChild(option);
      });
    }
  },
  mounted() {
    this.populateTimeZoneList("tzselect");
  },
  watch: {
    durationCode: function(newValue) {
      this.commitDurationCode(newValue);
    },
    modifiedSinceCode: function(newValue) {
      this.commitModifiedSinceCode(newValue);
    },
    startDateTime: function(newValue) {
      this.commitStartDateTime(newValue);
      newValue;
    },
    endDateTime: function(newValue) {
      this.commitEndDateTime(newValue);
    },
    timeZone: function(newValue) {
      this.commitTimeZone(newValue);
    },
    timeBoundsActive: function(newValue) {
      this.commitTemporalRangeActive(newValue);
      if (!newValue) {
        this.startDateTime = "";
        this.endDateTime = "";
        this.timeZone = "";
      }
    }
  },
  computed: {
    timeboundsenabled() {
      return this.timeBoundsActive;
    }
  }
};
</script>
