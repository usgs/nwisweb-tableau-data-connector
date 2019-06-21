import {
  formatJSONAsTable,
  generateURL,
  generateColList,
  getLongestTimesSeriesindices,
  generateSchemaColsFromData
} from "../../src/components/WDCMethods.js";

/*global  tableau:true*/

test("converting a fully-populated data JSON to table", () => {
  const input = {
    value: {
      //barebones mockup of a data json with data series of uniform length
      timeSeries: [
        {
          name: "USGS:01646500:00060:00000",
          values: [
            {
              value: [
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
          values: [
            {
              value: [
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
  const targetResult = [
    { "01646500_00060": "10800", "01647500_00062": "343" },
    { "01646500_00060": "10800", "01647500_00062": "5465" }
  ];

  expect(formatJSONAsTable(input)).toEqual(targetResult);
});


//todo this test needs to be updated and possibly expanded
/*
test("correctly generate a URL given a list of sites and parameters with various whitespace", () => {
  const connectionData = {
    siteNums: "01646500 ,   05437641",
    paramNums: "00060   ,00065"
  };
  expect(generateURL(connectionData)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01646500,05437641&period=P1D&parameterCd=00060,00065&siteStatus=all"
  );
});
*/

test("correctly generates the column schema from sites and parameters", () => {
  const sites = "01646500,05437641";
  const params = "00060,00065";
  const targetResult = [
    "01646500_00060",
    "01646500_00065",
    "05437641_00060",
    "05437641_00065"
  ];
  expect(generateColList(sites, params)).toEqual(targetResult);
});

test("correctly returning an array of the indices of the longest time series", () => {
  const timeSeries = [
    {
      name: "USGS:01646500:00060:00000",
      values: [
        {
          value: [
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
      values: [
        {
          value: [
            {
              value: "343"
            },
            {
              value: "543"
            },
            {
              value: "343"
            }
          ]
        }
      ]
    }
  ];
  const targetResult = [0, 1, 2];
  expect(getLongestTimesSeriesindices(timeSeries)).toEqual(targetResult);
});

test("converting a non fully-populated data JSON to table", () => {
  const input = {
    value: {
      //barebones mockup of a data json with data series of non uniform length
      timeSeries: [
        {
          name: "USGS:01646500:00060:00000",
          values: [
            {
              value: [
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
          values: [
            {
              value: [
                {
                  value: "343"
                }
              ]
            }
          ]
        }
      ]
    }
  };
  const targetResult = [
    { "01646500_00060": "10800", "01647500_00062": "343" },
    { "01646500_00060": "10800" }
  ];

  expect(formatJSONAsTable(input)).toEqual(targetResult);
});

test("getLongestTimeSeriesIndices correctly throws error when given an empty list", () => {
  expect(() => {
    getLongestTimesSeriesindices([]);
  }).toThrow();
});

test("generateSchemaColsFromData generate the correct schema columns given a data json", () => {
  // todo this will need to be updated as we develop the schema more

  let result = [];
  let targetResult = [
    {
      id: "dateTime",
      alias: "dateTime",
      dataType: tableau.dataTypeEnum.string
    },
    { id: "1_2", alias: "1_2", dataType: tableau.dataTypeEnum.string },
    { id: "2_3", alias: "2_3", dataType: tableau.dataTypeEnum.string },
    { id: "3_4", alias: "3_4", dataType: tableau.dataTypeEnum.string }
  ];
  let input = {
    value: {
      timeSeries: [
        { name: "USGS:1:2" },
        { name: "USGS:2:3" },
        { name: "USGS:3:4" }
      ]
    }
  };
  result = generateSchemaColsFromData(input);
  expect(result).toEqual(targetResult);
});
