import {get} from '../utils.js'

const formatJSONAsTable =  (data) => {
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


const generateURL = (connectionData) => {
 //todo standardize this template's format when we add more query info fields
 let paramList = connectionData.paramNums.replace(/\s/g, '').split(','); // split by comma, ignoring whitespace
 let siteList = connectionData.siteNums.replace(/\s/g,'').split(',');
 return  `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${siteList.join()}&period=P1D&parameterCd=${paramList.join()}&siteStatus=all`
}


const  getData =  (table, doneCallback) => {

       let url = generateURL(tableau.connectionData);
       
       get(url).then(function(value){ 
            table.appendRows(formatJSONAsTable(value));
            doneCallback();
        });
    }

const  getSchema = (schemaCallback) => {

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


