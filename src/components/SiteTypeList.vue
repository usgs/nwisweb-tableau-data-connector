<template>
  <div>
    <!-- <ChosenSelect
      id="siteSelect"
      multiple
      optgroup
      v-model="siteType"
      :options="listFromFile"
      style="width: 300px; height:300px; margin: auto;"
    >
    </ChosenSelect> -->
    <multiselect
      id="siteSelect"
      :close-on-select="false"
      :multiple="true"
      :taggable="true"
      v-model="siteType"
      :options="listFromFile"
      tag-placeholder="Add this as new tag" 
      placeholder="Search or add a tag" 
      label="name" track-by="code" 
      @tag="addTag"
    >
    </multiselect>
      <pre class="language-json"><code>{{ value  }}</code></pre>

  </div>
</template>

<script>
import { siteTypes } from "./params.js";
import ChosenSelect from "./ChosenSelect";
import Multiselect from "vue-multiselect";

export default {
  name: "SiteTypeList",
  components: {
    ChosenSelect,
    Multiselect
  },
  methods: {
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0,2) + Math.floor((Math.random() * 1000000))
      }
      this.listFromFile.push(tag);
      this.siteType.push(tag);
    }
  },
  data: function() {
    return {
      siteType: "",
      listFromFile: []
    };
  },
  updated() {
    console.log(this.siteType);
    this.$store.commit("changeSiteType", this.siteType);
  },
  mounted() {
    let siteSelect = document.getElementById("siteSelect");
    this.listFromFile = Object.keys(siteTypes);
    this.listFromFile.forEach(function(element) {
      console.log(element);
      var option = document.createElement("option");
      option.text = element;
      option.value = element;
      addTag(element);
      siteSelect.appendChild(option);
    });
  }
};
</script>

<style scoped lang="scss">

</style>


