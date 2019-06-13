let tableau = {};
let getSchema = {}

tableau.makeConnector = function(){
    return {getSchema}
}
tableau.registerConnector = function(){}
//let connectionData = {columnList: columnList, siteNums: sites, paramNums: parameters };
//tableau[makeConnector]//, connectionData] = function (){};

//tableau['getSchema'] = function (){}; //wrong

global.tableau = tableau;
global.getSchema = getSchema;
