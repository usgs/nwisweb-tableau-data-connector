

import {formatJSONAsTable, generateURL, generateColList} from '../../src/components/WDCMethods.js'


test('converting a fully-populated data JSON to table', () => {

const input = {value:{ //barebones mockup of a data json 
    timeSeries:[
      {
        name: "USGS:01646500:00060:00000",
        values:[
          {
            value:[
              {
                  value: "10800"
              },
              {
                value: "10800"
              }
            ]
          }
        ]
      },
      {
        name: "USGS:01647500:00062:00000",
        values:[
          {
            value:[
              {
                  value: "343"
              },
              {
                value: "5465"
              }
            ]
          }
        ]
      }
    ]
  }
};
const  targetResult = [{"01646500_00060":"10800","01647500_00062":"343"},{"01646500_00060":"10800","01647500_00062":"5465"}];

expect(formatJSONAsTable(input)).toEqual(targetResult);


});

test('correctly generate a URL given a list of sites and parameters with various whitespace', ()=>{
const connectionData = {siteNums: "01646500 ,   05437641", paramNums: "00060   ,00065"};
expect(generateURL(connectionData)).toEqual("https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01646500,05437641&period=P1D&parameterCd=00060,00065&siteStatus=all");
});


test('correctly generates the column schema from sites and parameters' ,()=>{
const sites = "01646500,05437641";
const params =  "00060,00065";
const targetResult = ["01646500_00060","01646500_00065","05437641_00060","05437641_00065"];
expect(generateColList(sites,params)).toEqual(targetResult);


});