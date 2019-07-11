<template>
  <div>
    <br />
    <span class="input-desc">
      <label>Parameters</label>
      <ToolTip
        hint="The complete list of parameter codes is available here."
        url="https://help.waterdata.usgs.gov/codes-and-parameters/parameters"
      ></ToolTip>
    </span>
    <span>
      <input
        id="paraminput"
        v-model="param"
        class="usa-input usa-input-custom"
        list="csparams"
        type="text"
      />
      <datalist id="csparams"> </datalist>
    </span>
    <br />
    <button class="usa-button usa-button-custom" v-on:click="addParam">
      Add Parameter
    </button>
    <h6 class="selected-tags">Selected parameters</h6>
    <input-tags 
      v-model="selectedParams" 
      class="input-tags-element">
      <div class="tags-input">
        <span
          v-for="(tag, key) in selectedParams"
          class="tags-input-tag"
          :key="key"
        >
          <span>{{ tag }}</span>
          <button
            type="button"
            class="tags-input-remove"
            v-on:click="removeElement(key)"
          >
            &times;
          </button>
        </span>
      </div>
    </input-tags>
  </div>
</template>

<script>
import Vue from "vue";
import VueTags from "vue-tags";
import ToolTip from "./ToolTip";
import { notify } from "../notifications.js";
Vue.component("input-tags", VueTags);

export default {
  name: "ParamSelect",
  components: {
    ToolTip
  },
  data: function() {
    return {
      loadedParamData: false,
      wideInput: false,
      param: "",
      paramData: [],
      paramList: [],
      selectedParams: []
    };
  },
  methods: {
    fetchparams: async function() {
      let localParamData = await import("../fetchedValues/paramTypes.json");
      let paramList = [];
      Object.keys(localParamData).forEach(key => {
        paramList.push(localParamData[key]);
      });
      this.paramData = paramList;
      this.paramData.forEach(element => {
        this.paramList.push(element["id"]);
      });
      this.populateParamList();
      this.loadedParamData = true;
    },
    populateParamList: function() {
      let dropDown = document.getElementById("csparams");
      this.paramData.forEach(element => {
        let option = document.createElement("option");
        option.text = element["name"];
        option.value = element["id"];
        option.title = element["name"];
        dropDown.appendChild(option);
      });
    },
    commitParamList: function(value) {
      this.$store.commit("changeParamCodes", value);
    },
    addParam: function() {
      if (!this.loadedParamData) {
        notify("Please wait for param data to load");
        return;
      }
      if (this.paramList.includes(this.param)) {
        if (!this.selectedParams.includes(this.param)) {
          if (this.selectedParams.length < 100) {
            this.selectedParams.push(this.param);
          } else {
            notify("Maximum number of parameters already selected.");
          }
        } else {
          notify("parameter selected already in selection.");
        }
      } else {
        notify("invalid param code entered");
      }
    },
    removeElement: function(index) {
      Vue.delete(this.selectedParams, index);
    }
  },
  mounted() {
    this.fetchparams();
  },
  watch: {
    selectedParams: function(newValue) {
      this.commitParamList(newValue);
    }
  }
};
</script>
