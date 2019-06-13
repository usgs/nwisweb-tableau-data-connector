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
            myConnector.getSchema = function (schemaCallback) {

                let cols = [];
                tableau.connectionData.columnList.forEach(function (column) { // we add all the columns to the schema
                    cols.push({
                        id: column,
                        alias: column,
                        dataType: tableau.dataTypeEnum.string
                    });
                });


                let tableSchema = {
                    id: "WaterData",
                    alias: "useful information will be put here", //todo, add useful information
                    columns: cols
                };
                schemaCallback([tableSchema]);
            };




            // Download the data
            myConnector.getData = function (table, doneCallback) {
                // adapted from https://github.com/usgs/waterdataui/blob/master/assets/src/scripts/ajax.js
                let get = function (url) {
                    // Return a new promise.
                    return new Promise(function (resolve, reject) {
                        // Do the usual XHR stuff
                        let req = new XMLHttpRequest();
                        req.responseType = 'json';

                        req.open('GET', url);

                        req.onload = function () {
                            // This is called even on 404 etc
                            // so check the status
                            if (req.status == 200) {
                                doneCallback();
                                // Resolve the promise with the response text
                                resolve(req.response);
                            } else {
                                // Otherwise reject with the status text
                                // which will hopefully be a meaningful error
                                if (window.ga) {
                                    window.ga('send', 'event', 'serviceFailure', req.status, url);
                                }
                                reject(Error(`Failed with status ${req.status}: ${req.statusText}`));
                            }
                        };

                        // Handle network errors
                        req.onerror = function () {
                            reject(Error('Network Error'));
                        };

                        // Make the request
                        req.send();
                    });
                };
              


                //todo standardize this template's format when we add more query info fields
                let paramList = tableau.connectionData.paramNums.replace(/\s/g, '').split(',');
                let url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${tableau.connectionData.siteNums}&period=P1D&parameterCd=${paramList.join()}&siteStatus=all`
                get(url).then(function(value){
                                let data = value;
                                let tableData = [];
                                let dataLength = data.value.timeSeries[0].values[0].value.length;

                                for (let i = 0; i < dataLength; i++) { // todo update format
                                    let newEntry = {};
                                    for (let c = 0; c < tableau.connectionData.columnList.length; c++) {

                                        newEntry[tableau.connectionData.columnList[c]] = data.value.timeSeries[c].values[0].value[i].value;

                                    }
                                    tableData.push(newEntry);
                                }

                                table.appendRows(tableData);
                });
            };
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
