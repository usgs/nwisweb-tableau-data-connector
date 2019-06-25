<template>
  <div>
    <head>
      <title>USGS NWIS Tableau Data Connector</title>
      <meta http-equiv="Cache-Control" content="no-store" />
    </head>

    <body>
      <HeaderUSWDSBanner></HeaderUSWDSBanner>
      <HeaderUSGS></HeaderUSGS>
      <HeaderUSWDSSelections
        titleForSelectionHeader="NWISWeb Tableau Web Data Connector"
      ></HeaderUSWDSSelections>

      <div class="container container-table">
        <div class="row vertical-center-row">
          <div
            class="text-center col-md-4 col-md-offset-4"
            style="text-align:center"
          >
            <br />
            <label> Site or Sites </label>
            <input
              class="usa-input"
              style="width: 300px; margin: auto;"
              v-model="sites"
              :disabled="disabled"
            />
            <br />
            <label> Parameter Codes</label>
            <input
              class="usa-input"
              v-model="parameters"
              style="width: 300px; margin: auto;"
            />
            <br />
            <AutoCompleteDropDown></AutoCompleteDropDown>
            <LocationQueryType></LocationQueryType>
            <SiteTypeList></SiteTypeList>

            <br />
            <button
              type="button"
              v-on:click="requestData"
              id="submitButton"
              class="usa-button"
              style="margin: 10px;"
            >
              Request Data
            </button>
          </div>
        </div>
        <FooterUSGS></FooterUSGS>
      </div>
    </body>
  </div>
</template>

<script>
import { getData, getSchema, generateColList } from "./WDCMethods.js";
import HeaderUSWDSBanner from "../components/HeaderUSWDSBanner";
import HeaderUSWDSSelections from "../components/HeaderUSWDSSelections";
import HeaderUSGS from "../components/HeaderUSGS";
import FooterUSGS from "../components/FooterUSGS";
import AutoCompleteDropDown from "../components/AutoCompleteDropDown";
import LocationQueryType from "../components/LocationQueryType";
import { states, siteTypes } from "./params.js";
import { locationMode } from "../enums.js";
import SiteTypeList from "../components/SiteTypeList";
import ChosenSelect from "../components/ChosenSelect";

/*global  tableau:true*/

export default {
  name: "Main",
  props: {
    msg: String
  },
  components: {
    HeaderUSWDSBanner,
    HeaderUSGS,
    HeaderUSWDSSelections,
    FooterUSGS,
    AutoCompleteDropDown,
    LocationQueryType,
    SiteTypeList,
    ChosenSelect
  },
  data: function() {
    return {
      columnList: [],
      sites: "01646500,05437641",
      parameters: "00060,00065",
      activeLocationMode: locationMode.SITE
    };
  },
  created: function() {
    this.initializeWebDataConnector();
  },
  methods: {
    /*
            This function is triggered when the user presses the button to confirm their query. 
            This closes the Web Data Connector interface.
        */
    requestData: function() {
      this.columnList = generateColList(this.sites, this.parameters);
      tableau.connectionData = {
        columnList: this.columnList,
        siteNums: this.sites,
        paramNums: this.parameters,
        state: states[this.$store.getters.USStateName],
        locationMode: this.activeLocationMode,
        cached: false
      };
      tableau.connectionName = "USGS Instantaneous Values Query";
      tableau.submit();
    },
    /*
            this function is called when the Main.vue instance is created. It creates the web connector 
            object and assigns to it the functions responsible for contructing the schema and data from query parameters. 
        */
    initializeWebDataConnector: function() {
      let myConnector = tableau.makeConnector();
      myConnector.getSchema = getSchema;
      myConnector.getData = getData;
      tableau.registerConnector(myConnector);
    }
  },
  mounted: function() {
    let store = this.$store;
    store.subscribe((mutation) /*, state*/ => {
      if (mutation.type == "changeLocationMode") {
        this.activeLocationMode = store.getters.locationMode;
        if (store.getters.locationMode != locationMode.SITE) {
          this.sites = "";
        }
      }
    });
  },
  computed: {
    disabled() {
      return this.activeLocationMode != locationMode.SITE;
    }
  }
};
</script>
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
