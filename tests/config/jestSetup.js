// import {getData, getSchema} from '../../src/components/WDCMethods.js'

let tableau = {};
let getSchema = {};

let recentRequest = "no requests";

tableau.makeConnector = function(){
    return {getSchema}
}
tableau.registerConnector = function(){}
tableau.connectionData = {};
//let connectionData = {columnList: columnList, siteNums: sites, paramNums: parameters };
tableau.connectionData.paramNums = "";
tableau.connectionData.siteNums = "";


let xmlFunctionHolder = {
    onload: function(){},
    open:function(){},
    send: function(){}
}


let fakeXML = function() {
    console.log("in mock XMLHttpRequest");
    let req = {};
    req.status = 200;
    req.open = xmlFunctionHolder.open;
    req.responseType = "none";
    req.onload = xmlFunctionHolder.onload;
    req.send = xmlFunctionHolder.send;
    return req;
}

//tableau['getSchema'] = function (){}; //wrong
global.xmlFunctionHolder = xmlFunctionHolder;
global.XMLHttpRequest = fakeXML;
global.recentRequest = recentRequest;
global.tableau = tableau;
global.getSchema = getSchema;

