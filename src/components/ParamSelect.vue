<template>
  <div>
    <br />
    <label class="autocomplete-dropdown">Parameter</label>
    <br />
    <span>
      <input
        id="paraminput"
        v-model="param"
        class="usa-input"
        list="csparams"
        type="text"
        style="width: 300px; margin: auto; display: inline-block"
      />
      <datalist id="csparams"> </datalist>
      <!-- <button
        class="usa-button"
        v-on:click="toggleWideInput"
        style=" margin-top: 30px display: inline-block"
      >
        Expand
      </button> -->
    </span>
    <br />
    <button class="usa-button" v-on:click="addParam" style="margin-top: 30px">
      Add Parameter
    </button>
    <h6 class="selected-tags">Selected parameters</h6>
    <input-tags
      v-model="selectedParams"
      class="input-tags-element"
    >
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
Vue.component("input-tags", VueTags);

export default {
  name: "ParamSelect",
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
        alert("Please wait for param data to load");
        return;
      }
      if (this.paramList.includes(this.param)) {
        if (!this.selectedParams.includes(this.param)) {
          if (this.selectedParams.length < 100) {
            this.selectedParams.push(this.param);
          } else {
            alert("Maximum number of parameters already selected.");
          }
        } else {
          alert("parameter selected already in selection.");
        }
      } else {
        alert("invalid param code entered");
      }
    },
    toggleWideInput: function() {
      if (this.wideInput) {
        this.wideInput = false;
        let input = document.getElementById("paraminput");
        input.setAttribute(
          "style",
          "width: 300px; margin: auto; display: inline-block"
        );
      } else {
        this.wideInput = true;
        let input = document.getElementById("paraminput");
        input.setAttribute(
          "style",
          "max-width: 1000px; width: 1000px; margin: auto; display: inline-block"
        );
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

<style lang="scss" scoped>
  @import "../style/leftJustified.css";
</style>