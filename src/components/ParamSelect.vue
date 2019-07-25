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
    <button class="usa-button usa-button-custom" v-on:click="addParams">
      Add Parameter
    </button>
    <h6 class="selected-tags">Selected parameters</h6>
    <input-tags v-model="selectedParams" class="input-tags-element">
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
    /*
      an async function to fetch paramData after the page has loaded so the
       long loading time for the params json doesn't slow dont UI loading

    */
    fetchparams: async function() {
      let localParamData = await import("../fetchedValues/paramTypes.json");
      this.paramData = [];
      Object.keys(localParamData).forEach(key => {
        if (typeof localParamData[key]["id"] !== "undefined") {
          this.paramData.push(localParamData[key]);
        }
      });
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
        if (
          typeof element["name"] === "undefined" ||
          typeof element["id"] === "undefined"
        ) {
          alert("element");
          alert(JSON.stringify(element));
          alert(element["name"]);
          alert(element["id"]);
        }
        dropDown.appendChild(option);
      });
    },
    commitParamList: function(value) {
      this.$store.commit("changeParamCodes", value);
    },
    /*
      Iterates over the comma separated input parameters and adds each
       parameter to the list of selected parameters if it's a valid selection

    */
    addParams: function() {
      let params = this.param.split(",");
      params.forEach(param => {
        this.addParam(param.replace(/\s/g, ""));
      });
    },
    addParam: function(param) {
      if (!this.loadedParamData) {
        notify("Please wait for param data to load");
        return;
      }
      if (this.paramList.includes(param)) {
        if (!this.selectedParams.includes(param)) {
          if (this.selectedParams.length < 100) {
            this.selectedParams.push(param);
          } else {
            notify(`${param}: Maximum number of parameters already selected.`);
          }
        } else {
          notify(`${param}: parameter selected already in selection.`);
        }
      } else {
        notify(`${param}: invalid param code entered`);
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
