import { resolve } from "dns";



// global field for mock XMLHttpRequests
let recentRequest = "no requests";
global.recentRequest = recentRequest;


//mock of tableau module
let tableau = {};
tableau.makeConnector = function(){
    return {getSchema}
}
tableau.registerConnector = function(){};
tableau.connectionData ={columnList: [], siteNums: '', paramNums: '' };
tableau.dataTypeEnum = {};
tableau.dataTypeEnum.string = '__STRING' // this is a mockup of the enum, so that when testing getSchema, our mock tableau can still provide some value 
tableau.connectionData.paramNums = ""; // in the place of the real tableau enum
tableau.connectionData.siteNums = "";
global.tableau = tableau;


//holder object for mockXMLHttpRequest member functions
let xmlFunctionHolder = {
    onload: function(){resolve({})},
    open:function(command, url){global.recentRequest = url},
    send: function(){this.onload()}
}
global.xmlFunctionHolder = xmlFunctionHolder;


//mock of XMLHttpRequest Object
let mockXMLHttpRequest = function() {
    let req = {};
    req.status = 200;
    req.open = xmlFunctionHolder.open;
    req.responseType = "none";
    req.onload = xmlFunctionHolder.onload;
    req.send = xmlFunctionHolder.send;
    req.response = {"params":"00060"};
    return req;
}
global.XMLHttpRequest = mockXMLHttpRequest;





