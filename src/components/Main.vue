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
            <br />
            <div>
              <label> Parameter Codes</label>
              <input
                class="usa-input"
                v-model="parameters"
                style="width: 300px; margin: auto;"
              />
              <br />
            </div>
            <div v-show="!disabled">
              <label> Site or Sites </label>
              <input
                class="usa-input"
                style="width: 300px; margin: auto;"
                v-model="sites"
                :disabled="disabled"
              />
            </div>

            <AutoCompleteDropDown></AutoCompleteDropDown>
            <CoordinatesInput></CoordinatesInput>
            <HUCInput></HUCInput>
            <CountySelect></CountySelect>
            <LocationQueryType></LocationQueryType>
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
import CountySelect from "../components/CountySelect";
import LocationQueryType from "../components/LocationQueryType";
import CoordinatesInput from "../components/CoordinatesInput";
import HUCInput from "../components/HUCInput";
import { locationMode } from "../enums.js";

import { mapState } from "vuex";

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
    CoordinatesInput,
    HUCInput,
    CountySelect
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
            This function is triggered when the user presses the button to confirm their query. 
            This closes the Web Data Connector interface.
        */
    requestData: function() {
      if (!this.loadedStateData) {
        alert(
          "The page is still loading: please retry this action in a moment!"
        );
        return;
      }

      if (!this.validateFormInputs()) {
        return;
      }

      this.columnList = generateColList(this.sites, this.parameters);
      tableau.connectionData = {
        columnList: this.columnList,
        siteNums: this.sites,
        paramNums: this.parameters,
        state: this.stateData[this.$store.getters.USStateName],
        locationMode: this.activeLocationMode,
        boundaryCoords: this.$store.getters.coordinates,
        hydroCode: this.$store.getters.hydroCode,
        cached: false
      };

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
    },
    /*
      function which validates user form inputs and updates vuex values to a query ready format. 
      This function should be run and observed to return true before anything in the body of requestData 
      is run. 
    */
    validateFormInputs: function() {
      let stateStatus = this.validateStateInputs(
        this.$store.getters.USStateName
      );
      if (!(stateStatus === true)) {
        alert(stateStatus);
        return false;
      }
      let coordStatus = this.validateCoordinateInputs(
        this.$store.getters.coordinates
      );
      if (!(coordStatus === true)) {
        alert(coordStatus);
        return false;
      }

      let siteListStatus = this.validateSiteInputs(this.sites);
      if (!(siteListStatus === true)) {
        alert(siteListStatus);
        return false;
      }

      this.$store.commit(
        "changeCoordinates",
        this.roundCoordinateInputs(this.$store.getters.coordinates)
      );
      return true;
    },
    /*
      Ensures the user has selected a valid state or territory in their query. Always
      returns true if the current vuex locationMode setting is not STATE.

    */
    validateStateInputs: function(input) {
      if (this.$store.getters.locationMode != locationMode.STATE) return true;
      if (!(input in this.stateData)) return "invalid state selected";
      return true;
    },
    /*
      ensures that the user has entered valid coordinates. Always returns true if the 
      current locationMode setting is not COORDS.
    */
    validateCoordinateInputs: function(coordinates) {
      if (this.$store.getters.locationMode != locationMode.COORDS) return true;
      if (isNaN(coordinates.north) || coordinates.north == "")
        return "non-numeric northern boundary coordinate";
      if (isNaN(coordinates.south) || coordinates.south == "")
        return "non-numeric southern boundary coordinate";
      if (isNaN(coordinates.east) || coordinates.east == "")
        return "non-numeric eastern boundary coordinate";
      if (isNaN(coordinates.west) || coordinates.west == "")
        return "non-numeric western boundary coordinate";
      if (parseInt(coordinates.north) > 90 || parseInt(coordinates.north) < -90)
        return "out of bounds northern boundary coordinate(-90 - 90)";
      if (parseInt(coordinates.south) > 90 || parseInt(coordinates.south) < -90)
        return "out of bounds southern boundary coordinate(-90 - 90)";
      if (parseInt(coordinates.east) > 180 || parseInt(coordinates.east) < -180)
        return "out of bounds eastern boundary coordinate(-180 - 180)";
      if (parseInt(coordinates.west) > 180 || parseInt(coordinates.west) < -180)
        return "out of bounds western boundary coordinate(-180 - 180)";
      if (parseInt(coordinates.south) >= parseInt(coordinates.north))
        return "southern boundary coordinate is north of northern boundary coordinate";
      if (parseInt(coordinates.west) >= parseInt(coordinates.east))
        return "western boundary coordinate is east of eastern boundary coordinate";

      return true;
    },
    /*
      rounds coordinate inputs to 6 decimal places. Called in validateFormInputs()
    */
    roundCoordinateInputs: function(coordinates) {
      coordinates.north = parseInt(coordinates.north).toFixed(6);
      coordinates.south = parseInt(coordinates.south).toFixed(6);
      coordinates.east = parseInt(coordinates.east).toFixed(6);
      coordinates.west = parseInt(coordinates.west).toFixed(6);
      return coordinates;
    },
    /*
    validates the input format of the list of site codes
    */
    validateSiteInputs: function(sites) {
      if (this.$store.getters.locationMode != locationMode.SITE) return true;
      let regex = /^((\d{8}),)*(\d{8})$/; // 1 or more comma-separated 8 digit numbers
      if (!sites.replace(/\s/g, "").match(regex)) {
        return "site list in invalid format";
      }
      return true;
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.fetchData();
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
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
