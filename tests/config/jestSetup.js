import { resolve } from "dns";

// import {getData, getSchema} from '../../src/components/WDCMethods.js'

let tableau = {};
let getSchema = {};

let recentRequest = "no requests";

let fake_JSON = {"params":"00060"};

tableau.makeConnector = function(){
    return {getSchema}
}
tableau.registerConnector = function(){};
tableau.connectionData ={columnList: [], siteNums: '', paramNums: '' };
tableau.dataTypeEnum = {};
tableau.dataTypeEnum.string = '__STRING' // this is a mockup of the enum, so that when testing getSchema, our mock tableau can still provide some value 
tableau.connectionData.paramNums = ""; // in the place of the real tableau enum
tableau.connectionData.siteNums = "";


let xmlFunctionHolder = {
    onload: function(){resolve({})},
    open:function(command, url){global.recentRequest = url},
    send: function(){this.onload()}
}


let fakeXML = function() {
    console.log("in mock XMLHttpRequest");
    let req = {};
    req.status = 200;
    req.open = xmlFunctionHolder.open;
    req.responseType = "none";
    req.onload = xmlFunctionHolder.onload;
    req.send = xmlFunctionHolder.send;
    req.response = {"params":"00060"};
    return req;
}

global.xmlFunctionHolder = xmlFunctionHolder;
global.XMLHttpRequest = fakeXML;
global.recentRequest = recentRequest;
global.tableau = tableau;
global.getSchema = getSchema;

