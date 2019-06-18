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
import { getData, getSchema, generateColList } from './WDCMethods.js';
export default {
    name: 'Main',
    props: {
        msg: String
    },
    data: function () {
        return {
            columnList: [],
            sites: "01646500,05437641",
            parameters: "00060,00065"
        }
    },
    created: function () {
        this.initializeWebDataConnector();
    },
    methods: {
        /*
            This function is triggered when the user presses the button to confirm their query. 
            This closes the Web Data Connector interface.
        */
        requestData: function () {
            this.columnList = generateColList(this.sites, this.parameters); 
            tableau.connectionData = { 'columnList': this.columnList, 'siteNums': this.sites, 'paramNums': this.parameters }; // here we send columnList, to be used in defining our schema
            tableau.connectionName = "USGS Instantaneous Values Query"; 
            tableau.submit(); 
        },
        /*
            this function is called when the Main.vue instance is created. It creates the web connector 
            object and assigns to it the functions responsible for contructing the schema and data from query parameters. 
        */
        initializeWebDataConnector: function () {
            let myConnector = tableau.makeConnector();
            myConnector.getSchema = getSchema; 
            myConnector.getData = getData;
            tableau.registerConnector(myConnector);

        }
    }
}
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
