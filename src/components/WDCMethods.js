

function formatJSONAsTable (data){
    let tableData = [];
    let timeSeries = data.value.timeSeries;
    let dataIndices = Array.from(timeSeries[0].values[0].value.keys());
    let paramIndices = Array.from(timeSeries.keys());

    dataIndices.forEach(i => {
        let newEntry = {};
        paramIndices.forEach(c => {
            try{
                let name = timeSeries[c].name;
                let nameTokens = name.split(':');
                let site = nameTokens[1];
                let paramType = nameTokens[2];
                newEntry[site + '_' + paramType] = data.value.timeSeries[c].values[0].value[i].value;
            }catch(err)
            {
                //ignore index(out of range for this parameter for this site)
            }
        });
        tableData.push(newEntry); 
    });
    return tableData;
}


function generateURL(connectionData){
 //todo standardize this template's format when we add more query info fields
 let paramList = connectionData.paramNums.replace(/\s/g, '').split(','); // split by comma, ignoring whitespace
 let siteList = connectionData.siteNums.replace(/\s/g,'').split(',');
 return  `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${siteList.join()}&period=P1D&parameterCd=${paramList.join()}&siteStatus=all`
}


function getData (table, doneCallback) {
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
      


       let url = generateURL(tableau.connectionData);
       
       get(url).then(function(value){ 
                        table.appendRows(formatJSONAsTable(value));
        });
    }

function getSchema(schemaCallback) {

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
}

export{getData, getSchema, formatJSONAsTable, generateURL};


