import {
  formatJSONAsTable,
  generateURL,
  generateColList,
  generateSchemaTablesFromData,
  getTimeSeriesByID
} from "../../src/components/WDCMethods.js";
import { locationMode } from "../../src/enums.js";

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
                  value: "10800",
                  dateTime: "0:00"
                },
                {
                  value: "10800",
                  dateTime: "0:00"
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
                  value: "343",
                  dateTime: "0:00"
                },
                {
                  value: "5465",
                  dateTime: "0:00"
                }
              ]
            }
          ]
        }
      ]
    }
  };
  const targetResult = [
    { "01646500_00060": "10800", dateTime: "0:00" },
    { "01646500_00060": "10800", dateTime: "0:00" }
  ];

  expect(formatJSONAsTable(input, "01646500_00060")).toEqual(targetResult);
});

//todo this test needs to be updated and possibly expanded

test("correctly generate a URL given a list of sites and parameters with various whitespace", () => {
  const connectionData = {
    siteNums: "01646500 ,   05437641",
    paramNums: "00060   ,00065",
    state: "Rhode Island",
    locationMode: locationMode.SITE
  };
  expect(generateURL(connectionData)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01646500,05437641&period=P1D&parameterCd=00060,00065&siteStatus=all"
  );
});

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
                  value: "10800",
                  dateTime: "0:00"
                },
                {
                  value: "10800",
                  dateTime: "0:00"
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
                  value: "343",
                  dateTime: "0:00"
                },
                {
                  value: "5465",
                  dateTime: "0:00"
                }
              ]
            }
          ]
        }
      ]
    }
  };
  //const targetResult = [
  //  { "01646500_00060": "10800", "01647500_00062": "343" },
  // { "01646500_00060": "10800" }
  // ];

  expect(() => {
    formatJSONAsTable(input, "fake_name");
  }).toThrow();
});

test("getTimeSeriesByID  correctly gets a time series by ID", () => {
  let timeSeries = [
    {
      name: "USGS:01646500:00060:00000",
      values: [
        {
          value: [
            {
              value: "10800",
              dateTime: "0:00"
            },
            {
              value: "10800",
              dateTime: "0:00"
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
              value: "343",
              dateTime: "0:00"
            },
            {
              value: "5465",
              dateTime: "0:00"
            }
          ]
        }
      ]
    }
  ];

  let tableName = "01647500_00062";
  let targetResult = {
    name: "USGS:01647500:00062:00000",
    values: [
      {
        value: [
          {
            value: "343",
            dateTime: "0:00"
          },
          {
            value: "5465",
            dateTime: "0:00"
          }
        ]
      }
    ]
  };

  expect(getTimeSeriesByID(timeSeries, tableName)).toEqual(targetResult);
});

test("generateSchemaTablesFromData generate the correct schema tables given a data json", () => {
  // todo this will need to be updated as we develop the schema more

  let result = [];
  let targetResult = [
    {
      id: "01646500_00060",
      alias: "useful information will be put here",
      columns: [
        { id: "dateTime", alias: "dateTime", dataType: "__STRING" },
        { id: "01646500_00060", alias: "01646500_00060", dataType: "__STRING" }
      ]
    },
    {
      id: "01646500_00065",
      alias: "useful information will be put here",
      columns: [
        { id: "dateTime", alias: "dateTime", dataType: "__STRING" },
        { id: "01646500_00065", alias: "01646500_00065", dataType: "__STRING" }
      ]
    },
    {
      id: "05437641_00065",
      alias: "useful information will be put here",
      columns: [
        { id: "dateTime", alias: "dateTime", dataType: "__STRING" },
        { id: "05437641_00065", alias: "05437641_00065", dataType: "__STRING" }
      ]
    }
  ];
  let input = {
    value: {
      timeSeries: [
        { name: "USGS:01646500:00060" },
        { name: "USGS:01646500:00065" },
        { name: "USGS:05437641:00065" }
      ]
    }
  };
  result = generateSchemaTablesFromData(input);
  expect(result).toEqual(targetResult);
});
