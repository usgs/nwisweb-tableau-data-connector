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
    <br />
    <span>
      <input type="checkbox" v-model="timeBoundsActive" />
      <label> Set Date Time Boundaries </label>
    </span>
    <br />
    <div v-show="timeboundsenabled">
      <span class="label-span">
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
          v-model="startDate"
        ></Datetime>
        <select style="display: inline-block;" id="starttzselect"></select>
      </span>
      <br />
      <span class="label-span">
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
          v-model="endDate"
        ></Datetime>
        <select id="endtzselect" style="display: inline-block;"></select>
      </span>
    </div>
    <br />
    <span class="label-span">
      <label>Modified Since</label>
      <ToolTip
        hint="todo"
        url="https://en.wikipedia.org/wiki/ISO_8601#Durations"
      ></ToolTip>
    </span>
    <input v-model="modifiedSinceCode" class="usa-input" />
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
      startDate: "",
      endDate: "",
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
    }
  },
  computed: {
    timeboundsenabled() {
      return this.timeBoundsActive;
    }
  }
};
</script>
