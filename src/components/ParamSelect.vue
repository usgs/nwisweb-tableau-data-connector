<template>
  <div>
    <br />
    <span class="input-desc">
      <label>Parameters</label>
      <ToolTip
        hint="The complete list of parameter codes is available here. A maximum of 100 parameters are allowed per query."
        url="https://help.waterdata.usgs.gov/codes-and-parameters/parameters"
      ></ToolTip>
    </span>
    <span>
      <CustomAutoComplete
        v-on:valueupdate="updateParamInput"
        v-on:clear="updateParamInput"
        :source="paramData"
        input-class="usa-input usa-input-custom"
      ></CustomAutoComplete>
    </span>
    <br />
    <span class="input-desc">
      <label>Parameter Groups</label>
      <ToolTip
        hint="Parameter group information can be found in the 'group' column of the parameter code table. A maximum of 100 parameters are allowed per query. Some groups contain more than 100 parameters codes, in these cases it is most efficient to manually remove unnecesarry parameters."
        url="https://help.waterdata.usgs.gov/codes-and-parameters/parameters"
      ></ToolTip>
    </span>
    <span>
      <CustomAutoComplete
        v-on:valueupdate="updateParamGroupInput"
        v-on:clear="updateParamGroupInput"
        :source="paramGroupList"
        input-class="usa-input usa-input-custom"
      ></CustomAutoComplete>
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
import CustomAutoComplete from "../components/CustomAutoComplete";
Vue.component("input-tags", VueTags);

export default {
  name: "ParamSelect",
  components: {
    ToolTip,
    CustomAutoComplete
  },
  data: function() {
    return {
      loadedParamData: false,
      wideInput: false,
      param: "",
      paramGroup: "",
      paramData: [],
      paramList: [],
      paramGroupData: {},
      paramGroupList: [],
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
        if ("name" in localParamData[key] && "id" in localParamData[key]) {
          this.paramData.push({
            id: localParamData[key]["id"],
            name: localParamData[key]["name"]
          });
          if ("Group" in localParamData[key]) {
            if (!(localParamData[key]["Group"] in this.paramGroupData)) {
              this.paramGroupData[localParamData[key]["Group"]] = [
                localParamData[key]["id"]
              ];
            } else {
              this.paramGroupData[localParamData[key]["Group"]].push(
                localParamData[key]["id"]
              );
            }
          }
        }
      });

      let groupList = Object.keys(this.paramGroupData);
      groupList.forEach(element => {
        this.paramGroupList.push({ name: element, id: element });
      });

      this.paramData.forEach(element => {
        this.paramList.push(element["id"]);
      });
      this.loadedParamData = true;
    },
    commitParamList: function(value) {
      this.$store.commit("changeParamCodes", value);
    },
    /*
      Iterates over the comma separated input parameters and adds each
       parameter to the list of selected parameters if it's a valid selection

    */
    addParams: function() {
      if (this.param == "" && this.paramGroup == "") {
        notify(`no param code or group entered`);
        return;
      }

      if (this.param != "") {
        let params = this.param.split(",");
        params.forEach(param => {
          this.addParam(param.replace(/\s/g, ""));
        });
      }

      if (this.paramGroup != "") {
        if (this.paramGroup in this.paramGroupData) {
          let self = this;
          this.paramGroupData[this.paramGroup].forEach(element => {
            self.addParam(element);
          });
        } else {
          notify(`${this.paramGroup}: invalid parameter group entered`);
        }
      }
    },
    addParam: function(param) {
      if (!this.loadedParamData) {
        notify("Please wait for param data to load");
        return;
      }
      if (this.paramList.includes(param)) {
        if (!this.selectedParams.includes(param)) {
          this.selectedParams.push(param);
        } else {
          notify(`${param}: parameter selected already in selection.`);
        }
      } else {
        notify(`${param}: invalid param code entered`);
      }
    },
    removeElement: function(index) {
      Vue.delete(this.selectedParams, index);
    },
    updateParamInput: function(newParamInput) {
      if (newParamInput !== null && typeof newParamInput !== "undefined") {
        this.param = newParamInput;
      } else {
        this.param = "";
      }
    },
    updateParamGroupInput: function(newParamGroupInput) {
      if (
        newParamGroupInput !== null &&
        typeof newParamGroupInput !== "undefined"
      ) {
        this.paramGroup = newParamGroupInput;
      } else {
        this.paramGroup = "";
      }
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
