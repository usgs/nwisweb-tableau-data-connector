<template>
  <div>
 <head>
    <title>USGS NWIS Tableau Data Connector</title>
    <meta http-equiv="Cache-Control" content="no-store" />
    
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
   
</head>

<body>
    <div class="container container-table">
        <div class="row vertical-center-row">
            <div class="text-center col-md-4 col-md-offset-4">
                <button type = "button" v-on:click = "requestData" id = "submitButton" class = "btn btn-success" style = "margin: 10px;">Request Data</button>
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
  data: function() {
      return {
          columnList: []
      }
  },
  created: function () {
     this.initializeWebDataConnector();
  },
  methods: {   
        requestData: function(){
          tableau.connectionData = this.columnList; // here we send columnList, to be used in defining our schema
          tableau.connectionName = "USGS Instantaneous Values Query"; // This will be the data source name in Tableau
          tableau.submit(); // This sends the connector object to Tableau
        },
       initializeWebDataConnector: function(){


    // mock ups of user inputs

    let sites = '01646500'
    let parameters = '00060,00065'

     //construct columnList
        let paramList = parameters.replace(/\s/g, '').split(',');
        let self = this;
        self.columnList = [];
        paramList.forEach(function (param){ // right now we are assuming there is only one site in the query
            self.columnList.push(sites + '_' + param);
        });




         let myConnector = tableau.makeConnector();



    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        /*
        let cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "mag",
            alias: "magnitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "title",
            alias: "title",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "test",
            alias: "test",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "location",
            dataType: tableau.dataTypeEnum.geometry
        }];
        */

        let cols = [];
        /*
        cols.push({
                id: 'id',
                dataType: tableau.dataTypeEnum.string
        });
        */
        tableau.connectionData.forEach(function (column){ // we add all the columns to the schema
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

        //alert(JSON.stringify(tableSchema));

        schemaCallback([tableSchema]);
    };




    // Download the data
    myConnector.getData = function(table, doneCallback) {
    // adapted from https://github.com/usgs/waterdataui/blob/master/assets/src/scripts/ajax.js
    let get = function (url) {
    // Return a new promise.
    return new Promise(function(resolve, reject) {
        // Do the usual XHR stuff
        let req = new XMLHttpRequest();
        req.responseType = 'json';

        req.open('GET', url);

        req.onload = function() {
            // This is called even on 404 etc
            // so check the status
            if (req.status == 200) {
                 let data = req.response;
                 let tableData = [];

                  console.log(JSON.stringify(data));
                 let dataLength = data.value.timeSeries[0].values[0].value.length;

                    for(let i = 0; i < dataLength; i++)
                    {
                        let newEntry = {};
                        //newEntry['id'] = String(i);
                        for(let c = 0; c < tableau.connectionData.length; c++)
                        {
                            
                           newEntry[tableau.connectionData[c]] = data.value.timeSeries[c].values[0].value[i].value;
                              
                        }
                        tableData.push(newEntry);
                    }
                    console.log(JSON.stringify(tableData))

                /*

                // Iterate over the JSON object
                for (let i = 0, len = feat.length; i < len; i++) {
                    tableData.push({
                        "id": feat[i].id,
                        "mag": feat[i].properties.mag,
                        "title": feat[i].properties.title,
                        "location": feat[i].geometry
                    });
                }

                */



            table.appendRows(tableData);
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
        req.onerror = function() {
            reject(Error('Network Error'));
        };

        // Make the request
        req.send();
    });
};


    let url =  `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${sites}&period=P1D&parameterCd=${parameters}&siteStatus=all`

   //let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"




    get(url);};

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
