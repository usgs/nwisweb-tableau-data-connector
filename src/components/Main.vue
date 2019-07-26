<template>
  <div>
    <head>
      <title>USGS NWIS Tableau Data Connector</title>
      <meta http-equiv="Cache-Control" content="no-store" />
    </head>

    <body>
      <div class="row">
        <div class="leftcolumn">
          <div class="text-center input-column">
            <br />
            <SiteSelect> </SiteSelect>
            <StateSelect></StateSelect>
            <CoordinatesInput></CoordinatesInput>
            <HUCInput></HUCInput>
            <CountySelect></CountySelect>
            <div style="float:left;">
              <fieldset class="optional">
                <legend>Optional Parameters</legend>
                <div>
                  <ParamSelect></ParamSelect>
                  <br />
                </div>
                <SiteTypeList></SiteTypeList>
                <TemporalRange></TemporalRange>
                <AgencySelect></AgencySelect>
                <br />
                <siteStatusSelect></siteStatusSelect>
                <AquiferInputs></AquiferInputs>
                <br />
                <GroundWaterSiteAttr></GroundWaterSiteAttr>
                <WatershedInput></WatershedInput>
                <AltitudeInput></AltitudeInput>
              </fieldset>
            </div>
          </div>
        </div>
        <div class="rightcolumn">
          <LocationQueryType></LocationQueryType>
        </div>
      </div>
      <div>
        <br />
        <button
          type="button"
          v-on:click="requestData"
          id="submitButton"
          class="usa-button request-data"
        >
          Request Data
        </button>
      </div>
    </body>
  </div>
</template>

<script>
import { getData, getSchema } from "../WDCMethods.js";
import { validateFormInputs } from "../inputValidation.js";
import StateSelect from "../components/StateSelect";
import CountySelect from "../components/CountySelect";
import LocationQueryType from "../components/LocationQueryType";
import { locationMode } from "../enums.js";
import SiteTypeList from "../components/SiteTypeList";
import CoordinatesInput from "../components/CoordinatesInput";
import HUCInput from "../components/HUCInput";
import SiteSelect from "../components/SiteSelect";
import ParamSelect from "../components/ParamSelect";
import SiteStatusSelect from "../components/SiteStatusSelect";
import AgencySelect from "../components/AgencySelect";
import AquiferInputs from "../components/AquiferInputs";
import AltitudeInput from "../components/AltitudeInput";
import GroundWaterSiteAttr from "../components/GroundWaterSiteAttr";
import { mapState } from "vuex";
import { notify } from "../notifications.js";
import WatershedInput from "../components/WatershedInput";
import TemporalRange from "../components/TemporalRange";
const moment = require("moment");

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
    AquiferInputs,
    WatershedInput,
    AltitudeInput,
    SiteSelect,
    GroundWaterSiteAttr,
    TemporalRange,
    SiteStatusSelect
  },
  data: function() {
    return {
      columnList: [],
      sites: "",
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

      let connectionData = {
        columnList: this.columnList,
        siteNums: this.$store.getters.sites,
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
        agencyCode: this.$store.getters.agencyCode,
        natAquiferActive: this.$store.getters.natAquiferActive,
        natAquifer: this.$store.getters.natAquifer,
        locAquiferActive: this.$store.getters.locAquiferActive,
        locAquifer: this.$store.getters.locAquifer,
        wellMinActive: this.$store.getters.wellMinActive,
        wellMaxActive: this.$store.getters.wellMaxActive,
        holeMinActive: this.$store.getters.holeMinActive,
        holeMaxActive: this.$store.getters.holeMaxActive,
        GWSiteAttrDepths: this.$store.getters.GWSiteAttrDepths,
        siteStatus: this.$store.getters.siteStatus,
        watershedAreaBounds: this.$store.getters.watershedAreaBounds,
        watershedUpperAreaBoundsActive: this.$store.getters
          .watershedUpperAreaBoundsActive,
        watershedLowerAreaBoundsActive: this.$store.getters
          .watershedLowerAreaBoundsActive,
        altitudeBounds: this.$store.getters.altitudeBounds,
        upperAltitudeBoundActive: this.$store.getters.upperAltitudeBoundActive,
        lowerAltitudeBoundActive: this.$store.getters.lowerAltitudeBoundActive,
        durationCodeActive: this.$store.getters.durationCodeActive,
        durationCode: this.$store.getters.durationCode,
        modifiedSinceCodeActive: this.$store.getters.modifiedSinceCodeActive,
        modifiedSinceCode: this.$store.getters.modifiedSinceCode,
        temporalRangeActive: this.$store.getters.temporalRangeActive,
        temporalRangeData: this.$store.getters.temporalRangeData,
        currentDateTime: moment()
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
<style lang="scss" scoped>
.leftcolumn {
  float: left;
  padding: 10px;
  width: 38%;
  margin-left: 10%;
  margin-right: 2%;
}
.rightcolumn {
  float: right;
  padding: 10px;
  width: 38%;
  margin-left: 2%;
  margin-right: 10%;
}
.row {
  display: table;
  width: 100%;
  margin: auto;
  clear: both;
}
</style>
