<template>
  <div>
    <br />
    <span class="input-desc">
      <label>Duration Code</label>
      <ToolTip
        hint="A link to a detailed explanation of the ISO 8601 duration format specification is available here. The format should look like P&ltdate&gtT&lttime&gt with the caveat that P must always be present and T must only be present if it is not the last character"
        url="https://en.wikipedia.org/wiki/ISO_8601#Durations"
      ></ToolTip>
    </span>
    <input v-model="durationCode" class="usa-input usa-input-custom" />
    <br />
    <div class="usa-checkbox">
      <input
        type="checkbox"
        v-model="timeBoundsActive"
        class="usa-checkbox__input"
        value="timeBoundsActive"
      />
      <label class="usa-checkbox__label"> Set Date Time Boundaries </label>
    </div>
    <br />
    <div v-show="timeboundsenabled">
      <span class="input-desc">
        <label style="display: inline-block;">Start Time</label>
        <ToolTip
          hint="todo"
          url="https://en.wikipedia.org/wiki/ISO_8601#Durations"
        ></ToolTip>
      </span>
      <br />
      <span>
        <Datetime
          style="display: inline-block;"
          type="datetime"
          v-model="startDateTime"
        ></Datetime>
        <select
          v-model="startTimeZone"
          style="display: inline-block;"
          id="starttzselect"
        ></select>
      </span>
      <br />
      <span class="input-desc">
        <label>End Time</label>
        <ToolTip
          hint="todo"
          url="https://en.wikipedia.org/wiki/ISO_8601#Durations"
        ></ToolTip>
      </span>
      <br />
      <span>
        <Datetime
          style="display: inline-block;"
          type="datetime"
          v-model="endDateTime"
        ></Datetime>
        <select
          v-model="endTimeZone"
          id="endtzselect"
          style="display: inline-block;"
        ></select>
      </span>
    </div>
    <br />
    <span class="input-desc">
      <label>Modified Since</label>
      <ToolTip
        hint="todo"
        url="https://en.wikipedia.org/wiki/ISO_8601#Durations"
      ></ToolTip>
    </span>
    <input v-model="modifiedSinceCode" class="usa-input usa-input-custom" />
  </div>
</template>

<script>
import ToolTip from "../components/ToolTip";
import { Datetime } from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";
import timezones from "../fetchedValues/timezones.json";

export default {
  name: "TemporalRange",
  data: function() {
    return {
      durationCode: "",
      startDateTime: "",
      startTimeZone: "",
      endDateTime: "",
      endTimeZone: "",
      modifiedSinceCode: "",
      timeBoundsActive: false
    };
  },
  components: {
    ToolTip,
    Datetime
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
    commitStartTimeZone: function(newValue) {
      this.$store.commit("changeStartTimeZone", newValue);
    },
    commitEndDateTime: function(newValue) {
      this.$store.commit("changeEndDateTime", newValue);
    },
    commitEndTimeZone: function(newValue) {
      this.$store.commit("changeEndTimeZone", newValue);
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
    this.populateTimeZoneList("starttzselect");
    this.populateTimeZoneList("endtzselect");
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
      alert(newValue);
    },
    startTimeZone: function(newValue) {
      this.commitStartTimeZone(newValue);
      alert(newValue);
    },
    endDateTime: function(newValue) {
      this.commitEndDateTime(newValue);
      alert(newValue);
    },
    endTimeZone: function(newValue) {
      this.commitEndTimeZone(newValue);
      alert(newValue);
    },
    timeBoundsActive: function(newValue) {
      this.commitTemporalRangeActive(newValue);
      if (!newValue) {
        this.startDateTime = "";
        this.startTimeZone = "";
        this.endDateTime = "";
        this.endTimeZone = "";
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
