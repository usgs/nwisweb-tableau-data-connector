// import {getData, getSchema} from '../../src/components/WDCMethods.js'

let tableau = {};
let getSchema = {};

tableau.makeConnector = function(){
    return {getSchema}
}
tableau.registerConnector = function(){}
tableau.connectionData = {};
//let connectionData = {columnList: columnList, siteNums: sites, paramNums: parameters };
tableau.connectionData.paramNums = "";
tableau.connectionData.siteNums = "";

//tableau['getSchema'] = function (){}; //wrong

global.tableau = tableau;
global.getSchema = getSchema;

