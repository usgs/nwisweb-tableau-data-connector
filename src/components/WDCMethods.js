import {get} from '../utils.js'


const getLongestTimesSeriesindices = (timeSeries) => {
    if (timeSeries.length == 0)
    {
        throw new Error("no time series data");
    }
    let result = [];
    let length = -1;
    timeSeries.forEach(dataSeries => {
        if(dataSeries.values[0].value.length > length)
        {
            length = dataSeries.values[0].value.length;
            result = Array.from(dataSeries.values[0].value.keys());
        }
    }); 
    return result;
}

const formatJSONAsTable =  (data) => {
    let tableData = [];
    let timeSeries = data.value.timeSeries;
    let dataIndices = getLongestTimesSeriesindices(timeSeries)
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


const generateColList = (sites, params) => {
    let paramList = params.replace(/\s/g, '').split(',');
    let siteList = sites.replace(/\s/g, '').split(',');
    let columnList = [];
    siteList.forEach(function (site){
        paramList.forEach(function (param) { // we are creating a column for each property of each site
            columnList.push(site + '_' + param);
         });
    });
    return columnList;
}


export{getData, getSchema, formatJSONAsTable, generateURL, generateColList, getLongestTimesSeriesindices};


