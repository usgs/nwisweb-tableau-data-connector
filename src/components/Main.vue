<template>
  <div>
    <head>
      <title>USGS NWIS Tableau Data Connector</title>
      <meta http-equiv="Cache-Control" content="no-store" />
    </head>

    <body>
      <div class="container container-table">
        <div class="row vertical-center-row">
          <div
            class="text-center col-md-4 col-md-offset-4"
            style="text-align:center"
          >
            <br />
            <div>
              <ParamSelect></ParamSelect>
              <br />
            </div>
            <div v-show="!disabled">
              <span>
                <label class="use-input" style="display: inline-block;"
                  >Site or Sites</label
                >
                <ToolTip
                  hint="This field takes comma-separated 8-15 digit site codes. Open this link in a new tab to use the NWISWeb location finder, remember to limit your search to time-series sites."
                  url="http://maps.waterdata.usgs.gov/mapper/"
                ></ToolTip>
              </span>
              <input
                class="usa-input"
                style="width: 300px; margin: auto;"
                v-model="sites"
                :disabled="disabled"
              />
            </div>

            <StateSelect></StateSelect>
            <CoordinatesInput></CoordinatesInput>
            <HUCInput></HUCInput>
            <CountySelect></CountySelect>
            <LocationQueryType></LocationQueryType>
            <SiteTypeList></SiteTypeList>
            <AgencySelect></AgencySelect>
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
      </div>
    </body>
  </div>
</template>

<script>
import { getData, getSchema, generateColList } from "../WDCMethods.js";
import { validateFormInputs } from "../inputValidation.js";
import StateSelect from "../components/StateSelect";
import CountySelect from "../components/CountySelect";
import LocationQueryType from "../components/LocationQueryType";
import { locationMode } from "../enums.js";
import SiteTypeList from "../components/SiteTypeList";
import CoordinatesInput from "../components/CoordinatesInput";
import HUCInput from "../components/HUCInput";
import ParamSelect from "../components/ParamSelect";
import AgencySelect from "../components/AgencySelect";
import { mapState } from "vuex";
import { notify } from "../notifications.js";
import ToolTip from "../components/ToolTip";

/*global  tableau:true*/

export default {
  name: "Main",
  props: {
    msg: String
  },
  components: {
    StateSelect,
    LocationQueryType,
    SiteTypeList,
    CoordinatesInput,
    HUCInput,
    ParamSelect,
    CountySelect,
    AgencySelect,
    ToolTip
  },
  data: function() {
    return {
      columnList: [],
      sites: "01646500,05437641",
      parameters: "00060,00065",
      activeLocationMode: locationMode.SITE,
      paramData: {},
      stateData: {},
      loadedParamData: false,
      loadedStateData: false
    };
  },
  created: function() {
    this.initializeWebDataConnector();
  },
  methods: {
    /*
      Warns users on standalone browsers that they need Tableau to proceed with data collection.
    */
    browserWarning: function() {
      if (tableau.platformVersion == undefined) {
        notify(
          "The NWIS Tableau Web Data Connector must be accessed from Tableau desktop or Tableau server!"
        );
      }
    },
    /*
            This function is triggered when the user presses the button to confirm their query. 
            This closes the Web Data Connector interface.
        */
    requestData: function() {
      this.browserWarning();
      if (!this.loadedStateData) {
        notify(
          "The page is still loading: please retry this action in a moment!"
        );
        return;
      }

      if (!validateFormInputs(this)) {
        return;
      }

      this.columnList = generateColList(
        this.sites,
        this.$store.getters.paramCodes
      );
      let connectionData = {
        columnList: this.columnList,
        siteNums: this.sites,
        paramNums: this.$store.getters.paramCodes,
        state: this.stateData[this.$store.getters.USStateName],
        locationMode: this.activeLocationMode,
        boundaryCoords: this.$store.getters.coordinates,
        hydroCode: this.$store.getters.hydroCode,
        countyCode: this.$store.getters.countyCode,
        cached: false,
        siteTypeListActive: this.$store.getters.siteTypeListActive,
        siteTypeList: this.$store.getters.siteType,
        agencyCodeActive: this.$store.getters.agencyActive,
        agencyCode: this.$store.getters.agencyCode
      };
      if (typeof tableau.connectionData === "string") {
        tableau.connectionData = JSON.stringify(connectionData);
      } else {
        tableau.connectionData = connectionData;
      }

      tableau.connectionName = "USGS Instantaneous Values Query";
      tableau.submit();
    },
    /*
      dynamically imports parameter data 
    */
    fetchData: async function() {
      this.stateData = await import("../fetchedValues/states.json");
      this.loadedStateData = true;
      this.paramData = await import("../fetchedValues/paramTypes.json");
      this.loadedParamData = true;
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
    this.$nextTick(function() {
      this.fetchData();
      this.browserWarning();
    });
  },
  watch: {
    locationMode(newValue) {
      this.activeLocationMode = newValue;
      if (newValue != locationMode.SITE) {
        this.sites = "";
      }
    }
  },
  computed: {
    ...mapState(["locationMode"]),
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
  margin: auto;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
