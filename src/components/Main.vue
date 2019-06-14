<template>
    <div>

        <head>
            <title>USGS NWIS Tableau Data Connector</title>
            <meta http-equiv="Cache-Control" content="no-store" />

        </head>

        <body>
            <div class="container container-table">
                <div class="row vertical-center-row">
                    <div class="text-center col-md-4 col-md-offset-4">
                        <br>
                        <label> Site or Sites </label>
                        <input v-model="sites" placeholder="edit me">
                        <br>
                        <label> Parameter Codes</label>
                        <input v-model="parameters" placeholder="edit me">
                        <br>
                        <button type="button" v-on:click="requestData" id="submitButton" class="btn btn-success"
                            style="margin: 10px;">Request Data</button>
                    </div>
                </div>
            </div>
        </body>

    </div>
</template>

<script>
import { getData, getSchema } from './WDCMethods.js';
export default {
    name: 'Main',
    props: {
        msg: String
    },
    data: function () {
        return {
            columnList: [],
            sites: "01646500",
            parameters: "00060,00065"
        }
    },
    created: function () {
        this.initializeWebDataConnector();
    },
    methods: {
        requestData: function () {
            //construct columnList
            let paramList = this.parameters.replace(/\s/g, '').split(',');
            let self = this;
            self.columnList = [];
            paramList.forEach(function (param) { // right now we are assuming there is only one site in the query
                self.columnList.push(self.sites + '_' + param);
            });
            tableau.connectionData = { columnList: self.columnList, siteNums: self.sites, paramNums: self.parameters }; // here we send columnList, to be used in defining our schema
            tableau.connectionName = "USGS Instantaneous Values Query"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        },
        initializeWebDataConnector: function () {
            let myConnector = tableau.makeConnector();

            // Define the schema
            myConnector.getSchema = getSchema;

            // Download the data
            myConnector.getData = getData;
            tableau.registerConnector(myConnector);

        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
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
