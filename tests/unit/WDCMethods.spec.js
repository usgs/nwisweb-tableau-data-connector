import {
  formatJSONAsTable,
  generateURL,
  generateSchemaTablesFromData,
  getTimeSeriesByID,
  reformatTimeString,
  sanitizeVariableName,
  generateDateTime,
  generateMultiURL
} from "../../src/WDCMethods.js";
import { locationMode } from "../../src/enums.js";
let moment = require("moment");

let mockCurrentTime = moment().toISOString();

const validDataJSON = {
  value: {
    //barebones mockup of a data json with data series of uniform length
    queryInfo: {
      queryURL: "sampleurl",
      note: [
        {
          value: "2019-07-24T21:03:13.618Z",
          title: "requestDT"
        }
      ]
    },
    timeSeries: [
      {
        name: "USGS:01646500:00060:00000",
        sourceInfo: {
          geoLocation: {
            geogLocation: {
              latitude: "0.000000",
              longitude: "0.000000"
            }
          },
          siteCode: [{ value: "01646500", agencyCode: "USGS" }]
        },
        variable: {
          variableCode: [{ value: "00060" }],
          variableDescription: "flow",
          unit: {
            unitCode: "ft3/s"
          },
          options: {
            option: [{ optionCode: "00000" }]
          }
        },
        values: [
          {
            value: [
              {
                value: "10800",
                qualifiers: ["P", "A"],
                dateTime: "2019-07-05T10:45:00.000-04:00"
              },
              {
                value: "10800",
                qualifiers: ["P"],
                dateTime: "2019-07-05T10:45:00.000-04:00"
              }
            ],
            qualifier: [
              {
                qualifierCode: "P",
                qualifierDescription: "Provisional data subject to revision."
              },
              {
                qualifierCode: "A",
                qualifierDescription: "Approved"
              }
            ],
            method: [
              {
                methodID: "69929",
                methodDescription: "gate 1"
              }
            ]
          }
        ]
      },
      {
        name: "USGS:01647500:00062:00000",
        sourceInfo: {
          geoLocation: {
            geogLocation: {
              latitude: "0.00000",
              longitude: "0.00000"
            }
          },
          siteCode: [{ value: "01646501" }]
        },
        variable: {
          variableCode: [{ value: "00060" }],
          variableDescription: "height",
          unit: {
            unitCode: "ft"
          }
        },
        values: [
          {
            value: [
              {
                value: "343",
                qualifiers: ["P"],
                dateTime: "2019-07-05T10:45:00.000-04:00"
              },
              {
                value: "5465",
                qualifiers: ["P"],
                dateTime: "2019-07-05T10:45:00.000-04:00"
              }
            ],
            qualifier: [
              {
                qualifierCode: "P",
                qualifierDescription: "Provisional data subject to revision."
              },
              {
                qualifierCode: "A",
                qualifierDescription: "Approved"
              }
            ],
            method: [
              {
                methodID: "69929",
                methodDescription: "gate 2"
              }
            ]
          },
          {
            value: [
              {
                value: "56456",
                qualifiers: ["P"],
                dateTime: "2019-07-05T10:45:00.000-04:00"
              },
              {
                value: "5465",
                qualifiers: ["P"],
                dateTime: "2019-07-05T10:45:00.000-04:00"
              }
            ],
            qualifier: [
              {
                qualifierCode: "P",
                qualifierDescription: "Provisional data subject to revision."
              },
              {
                qualifierCode: "A",
                qualifierDescription: "Approved"
              }
            ],
            method: [
              {
                methodID: "69929",
                methodDescription: "gate 3"
              }
            ]
          }
        ]
      }
    ]
  }
};

test("converting a fully-populated data JSON to table", () => {
  const input = validDataJSON;
  const targetResult = [
    {
      flow_01646500_0: "10800",
      dateTime: "2019-07-05 10:45:00.000",
      latitude: "0.000000",
      longitude: "0.000000",
      units: "ft3/s",
      qualifier: "P:Provisional data subject to revision.,A:Approved",
      siteNum: "01646500",
      paramCode: "00060",
      agencyCode: "USGS",
      statCode: "00000",
      methodCode: "69929",
      methodDescription: "gate 1"
    },
    {
      flow_01646500_0: "10800",
      dateTime: "2019-07-05 10:45:00.000",
      latitude: "0.000000",
      longitude: "0.000000",
      units: "ft3/s",
      qualifier: "P:Provisional data subject to revision.",
      siteNum: "01646500",
      paramCode: "00060",
      agencyCode: "USGS",
      statCode: "00000",
      methodCode: "69929",
      methodDescription: "gate 1"
    }
  ];

  expect(formatJSONAsTable(mockCurrentTime, input, "flow_01646500_0")).toEqual(
    targetResult
  );
});

test("formatJSONasTable correctly constructs metadata table", () => {
  const input = validDataJSON;
  const targetResult = [
    {
      DOINumber: "http://dx.doi.org/10.5066/F7P55KJN",
      queryTime: "2019-07-24T21:03:13.618Z",
      queryURL: "sampleurl"
    }
  ];

  expect(formatJSONAsTable(mockCurrentTime, input, "metadata")).toEqual(
    targetResult
  );
});

test("formatJSONasTable correctly constructs metadata table when time is not supplied", () => {
  const input = {
    value: {
      queryInfo: {
        queryURL: "sampleurl",
        note: [
          {
            value: "not time",
            title: "not time"
          }
        ]
      }
    }
  };
  const targetResult = [
    {
      DOINumber: "http://dx.doi.org/10.5066/F7P55KJN",
      queryTime: mockCurrentTime,
      queryURL: "sampleurl"
    }
  ];

  expect(formatJSONAsTable(mockCurrentTime, input, "metadata")).toEqual(
    targetResult
  );
});

test("correctly generate a URL given a list of sites and parameters with various whitespace", () => {
  const connectionData = {
    agencyCodeActive: false,
    durationCodeActive: false,
    modifiedSinceCodeActive: false,
    siteTypeListActive: false,
    siteStatus: "all",
    watershedUpperAreaBoundsActive: false,
    watershedLowerAreaBoundsActive: false,
    upperAltitudeBoundActive: false,
    lowerAltitudeBoundActive: false,
    temporalRangeActive: false,
    siteNums: "01646500 ,   05437641",
    paramNums: [],
    state: "Rhode Island",
    locationMode: locationMode.SITE
  };
  expect(generateURL(connectionData, false)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01646500,05437641&siteStatus=all"
  );
});

test("correctly generate a URL given a state", () => {
  const connectionData = {
    agencyCodeActive: false,
    siteTypeListActive: false,
    siteStatus: "all",
    watershedUpperAreaBoundsActive: false,
    watershedLowerAreaBoundsActive: false,
    upperAltitudeBoundActive: false,
    lowerAltitudeBoundActive: true,
    modifiedSinceCodeActive: false,
    temporalRangeActive: false,
    durationCodeActive: false,
    paramNums: ["00060", "00065"],
    state: "ri",
    locationMode: locationMode.STATE,
    altitudeBounds: {
      upperAltitudeBound: "",
      lowerAltitudeBound: "-0.000045345     "
    }
  };
  expect(generateURL(connectionData, false)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&stateCd=ri&parameterCd=00060,00065&altMin=-0.000045345&siteStatus=all"
  );
});

test("correctly generate a URL given a coordinate bounding box", () => {
  const connectionData = {
    paramNums: ["00060", "00065"],
    agencyCodeActive: false,
    siteStatus: "inactive",
    siteTypeListActive: false,
    watershedUpperAreaBoundsActive: false,
    watershedLowerAreaBoundsActive: false,
    upperAltitudeBoundActive: true,
    lowerAltitudeBoundActive: false,
    temporalRangeActive: false,
    modifiedSinceCodeActive: false,
    durationCodeActive: false,
    boundaryCoords: {
      north: "2.000000  ",
      south: "1.000000  ",
      east: "  2.000000",
      west: "  1.000000"
    },
    altitudeBounds: {
      upperAltitudeBound: "23432.4234324",
      lowerAltitudeBound: ""
    },
    locationMode: locationMode.COORDS
  };
  expect(generateURL(connectionData, false)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&bBox=1.000000,1.000000,2.000000,2.000000&parameterCd=00060,00065&altMax=23432.4234324&siteStatus=inactive"
  );
});

test("correctly generate a URL given a hydrological Unit Code", () => {
  const connectionData = {
    paramNums: ["00060", "00065"],
    hydroCode: "   02070010",
    agencyCodeActive: false,
    watershedUpperAreaBoundsActive: false,
    watershedLowerAreaBoundsActive: false,
    altitudeBounds: {
      upperAltitudeBound: "56456456456.4564564564564   ",
      lowerAltitudeBound: "-867867867.834532453452345  "
    },
    upperAltitudeBoundActive: true,
    lowerAltitudeBoundActive: true,
    siteStatus: "all",
    modifiedSinceCodeActive: false,
    siteTypeListActive: false,
    temporalRangeActive: false,
    durationCodeActive: true,
    durationCode: "P117D",
    locationMode: locationMode.HYDRO
  };
  expect(generateURL(connectionData, false)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&huc=02070010&parameterCd=00060,00065&period=P117D&altMin=-867867867.834532453452345&altMax=56456456456.4564564564564&siteStatus=all"
  );
});

test("correctly generate a URL given a list of counties and drainage area params", () => {
  const connectionData = {
    paramNums: ["00060", "00065"],
    siteStatus: "active",
    countyCode: [11111, 22222],
    agencyCodeActive: false,
    watershedUpperAreaBoundsActive: true,
    watershedLowerAreaBoundsActive: true,
    upperAltitudeBoundActive: false,
    lowerAltitudeBoundActive: false,
    watershedAreaBounds: {
      upperAreaBound: "   1000",
      lowerAreaBound: "0  "
    },
    siteTypeListActive: false,
    temporalRangeActive: false,
    durationCodeActive: false,
    modifiedSinceCodeActive: false,
    locationMode: locationMode.COUNTY
  };
  expect(generateURL(connectionData, false)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&countyCd=11111,22222&parameterCd=00060,00065&drainAreaMin=0&drainAreaMax=1000&siteStatus=active"
  );
});

test("correctly generate a URL given a hydrological Unit Code , using  siteType, duration, modifiedSince, and Agency parameters", () => {
  const connectionData = {
    paramNums: ["00060", "00065"],
    hydroCode: "02070010  ",
    siteStatus: "all",
    agencyCodeActive: true,
    siteTypeListActive: true,
    watershedUpperAreaBoundsActive: false,
    watershedLowerAreaBoundsActive: false,
    durationCodeActive: true,
    modifiedSinceCodeActive: true,
    modifiedSinceCode: "P999W3435345DT435453453453453454M4S",
    durationCode: "P121DT96M5S",
    temporalRangeActive: false,
    agencyCode: "agencyA",
    siteTypeList: ["siteA", "siteB"],
    locationMode: locationMode.HYDRO
  };
  expect(generateURL(connectionData, false)).toEqual(
    "https://nwis.waterservices.usgs.gov/nwis/iv/?format=json&huc=02070010&parameterCd=00060,00065&siteType=siteA,siteB&agencyCd=agencyA&period=P121DT96M5S&modifiedSince=P999W3435345DT435453453453453454M4S&siteStatus=all"
  );
});

test("correctly generate a URL given a national aquifer code", () => {
  const connectionData = {
    paramNums: ["00060", "00065"],
    hydroCode: "02070010",
    locationMode: locationMode.HYDRO,
    siteStatus: "all",
    natAquiferActive: true,
    natAquifer: "N600NECRSN"
  };
  expect(generateURL(connectionData, false)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&huc=02070010&parameterCd=00060,00065&aquiferCd=N600NECRSN&siteStatus=all"
  );
});

test("correctly generate a URL given multiple poorly formatted national aquifer code", () => {
  const connectionData = {
    paramNums: ["00060", "00065"],
    hydroCode: "02070010",
    locationMode: locationMode.HYDRO,
    siteStatus: "all",
    natAquiferActive: true,
    natAquifer: "N600NECRSN, S100C NRLVL ,  S100PGTSND"
  };
  expect(generateURL(connectionData, false)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&huc=02070010&parameterCd=00060,00065&aquiferCd=N600NECRSN,S100CNRLVL,S100PGTSND&siteStatus=all"
  );
});

test("correctly generate a URL given a local aquifer code", () => {
  const connectionData = {
    paramNums: ["00060", "00065"],
    hydroCode: "02070010",
    locationMode: locationMode.HYDRO,
    siteStatus: "all",
    locAquiferActive: true,
    locAquifer: ["AL:124MDBC"]
  };
  expect(generateURL(connectionData, false)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&huc=02070010&parameterCd=00060,00065&localAquiferCd=AL:124MDBC&siteStatus=all"
  );
});

test("correctly generate a URL given multiple poorly formatted local aquifer code", () => {
  const connectionData = {
    paramNums: ["00060", "00065"],
    hydroCode: "02070010",
    locationMode: locationMode.HYDRO,
    siteStatus: "all",
    locAquiferActive: true,
    locAquifer: ["01:124MDBC, WI:10 0SDGV , AL:120UTRTR, 96:112EVRS"]
  };
  expect(generateURL(connectionData, false)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&huc=02070010&parameterCd=00060,00065&localAquiferCd=01:124MDBC,WI:100SDGV,AL:120UTRTR,96:112EVRS&siteStatus=all"
  );
});

test("correctly generate a URL given a hydrological Unit Code, with modifiedSince, and temporal range parameters", () => {
  const connectionData = {
    paramNums: ["00060", "00065"],
    hydroCode: "02070010",
    agencyCodeActive: false,
    siteTypeListActive: false,
    siteStatus: "all",
    durationCodeActive: false,
    modifiedSinceCodeActive: true,
    modifiedSinceCode: "P999W3435345DT435453453453453454M4S",
    temporalRangeActive: true,
    locationMode: locationMode.HYDRO,
    temporalRangeData: {
      startDateTime: "2019-07-08T14:59:00.000Z",
      endDateTime: "2019-07-08T14:59:00.000Z",
      timeZone: "-0430"
    },
    currentDateTime: moment("2019-08-08T14:59:00.000Z")
  };
  expect(generateURL(connectionData, false)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&huc=02070010&parameterCd=00060,00065&modifiedSince=P999W3435345DT435453453453453454M4S&startDT=2019-07-08T14:59-0430&endDT=2019-07-08T14:59-0430&siteStatus=all"
  );
});

test("correctly generate a URL given a hydrological Unit Code, with modifiedSince, and temporal range parameters and a time period of over 120 days", () => {
  const connectionData = {
    paramNums: ["00060", "00065"],
    hydroCode: "02070010",
    agencyCodeActive: false,
    siteTypeListActive: false,
    siteStatus: "all",
    durationCodeActive: false,
    modifiedSinceCodeActive: true,
    modifiedSinceCode: "P999W3435345DT435453453453453454M4S",
    temporalRangeActive: true,
    locationMode: locationMode.HYDRO,
    temporalRangeData: {
      startDateTime: "2018-07-08T14:59:00.000Z",
      endDateTime: "2018-07-09T14:59:00.000Z",
      timeZone: "-0430"
    },
    currentDateTime: moment("2019-08-04T14:59:00.000Z")
  };
  expect(generateURL(connectionData, false)).toEqual(
    "https://nwis.waterservices.usgs.gov/nwis/iv/?format=json&huc=02070010&parameterCd=00060,00065&modifiedSince=P999W3435345DT435453453453453454M4S&startDT=2018-07-08T14:59-0430&endDT=2018-07-09T14:59-0430&siteStatus=all"
  );
});

test("correctly generate a URL given Ground Water Site Attribute Depths", () => {
  let connectionData = {
    paramNums: ["00060", "00065"],
    countyCode: [11111, 22222],
    siteStatus: "all",
    wellMinActive: true,
    wellMaxActive: true,
    holeMinActive: true,
    holeMaxActive: true,
    GWSiteAttrDepths: {
      wellMin: "10",
      wellMax: "100",
      holeMin: "10",
      holeMax: "100"
    },
    locationMode: locationMode.COUNTY
  };
  expect(generateURL(connectionData, false)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&countyCd=11111,22222&parameterCd=00060,00065&siteStatus=all&wellDepthMin=10&wellDepthMax=100&holeDepthMin=10&holeDepthMax=100"
  );
  connectionData = {
    paramNums: ["00060", "00065"],
    countyCode: [11111, 22222],
    siteStatus: "all",
    wellMinActive: true,
    holeMaxActive: true,
    GWSiteAttrDepths: {
      wellMin: "10",
      wellMax: "",
      holeMin: "",
      holeMax: "100"
    },
    locationMode: locationMode.COUNTY
  };
  expect(generateURL(connectionData, false)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&countyCd=11111,22222&parameterCd=00060,00065&siteStatus=all&wellDepthMin=10&holeDepthMax=100"
  );
});

test("error on call to formatJSONAsTable with non-existent table name", () => {
  const input = validDataJSON;

  expect(() => {
    formatJSONAsTable(input, "fake_name");
  }).toThrow();
});

test("getTimeSeriesByID  correctly gets a time series by ID", () => {
  let timeSeries = validDataJSON.value.timeSeries;

  let tableName = "flow_01646500";
  let targetResult = validDataJSON.value.timeSeries[0];

  expect(getTimeSeriesByID(timeSeries, tableName)).toEqual(targetResult);
});

test("generateSchemaTablesFromData generate the correct schema tables given a data json", () => {
  // todo this will need to be updated as we develop the schema more

  let result = [];
  let targetResult = [
    {
      id: "metadata",
      alias: "metadata",
      columns: [
        { id: "queryURL", alias: "queryURL", dataType: "__STRING" },
        { id: "DOINumber", alias: "DOINumber", dataType: "__STRING" },
        { id: "queryTime", alias: "queryTime", dataType: "__STRING" }
      ]
    },

    {
      id: "flow_01646500_0",
      alias: "flow_01646500_0",
      columns: [
        { id: "dateTime", alias: "dateTime", dataType: "__TIME" },
        { id: "latitude", alias: "latitude", dataType: "__FLOAT" },
        { id: "longitude", alias: "longitude", dataType: "__FLOAT" },
        { id: "units", alias: "units", dataType: "__STRING" },
        { id: "qualifier", alias: "qualifier", dataType: "__STRING" },
        { id: "siteNum", alias: "siteNum", dataType: "__STRING" },
        { id: "paramCode", alias: "paramCode", dataType: "__STRING" },
        { id: "agencyCode", alias: "agencyCode", dataType: "__STRING" },
        { id: "statCode", alias: "statCode", dataType: "__STRING" },
        { id: "methodCode", alias: "methodCode", dataType: "__STRING" },
        {
          id: "methodDescription",
          alias: "methodDescription",
          dataType: "__STRING"
        },
        {
          id: "flow_01646500_0",
          alias: "flow_01646500_0",
          dataType: "__FLOAT"
        }
      ]
    },
    {
      id: "height_01646501_0",
      alias: "height_01646501_0",
      columns: [
        { id: "dateTime", alias: "dateTime", dataType: "__TIME" },
        { id: "latitude", alias: "latitude", dataType: "__FLOAT" },
        { id: "longitude", alias: "longitude", dataType: "__FLOAT" },
        { id: "units", alias: "units", dataType: "__STRING" },
        { id: "qualifier", alias: "qualifier", dataType: "__STRING" },
        { id: "siteNum", alias: "siteNum", dataType: "__STRING" },
        { id: "paramCode", alias: "paramCode", dataType: "__STRING" },
        { id: "agencyCode", alias: "agencyCode", dataType: "__STRING" },
        { id: "statCode", alias: "statCode", dataType: "__STRING" },
        { id: "methodCode", alias: "methodCode", dataType: "__STRING" },
        {
          id: "methodDescription",
          alias: "methodDescription",
          dataType: "__STRING"
        },
        {
          id: "height_01646501_0",
          alias: "height_01646501_0",
          dataType: "__FLOAT"
        }
      ]
    },
    {
      id: "height_01646501_1",
      alias: "height_01646501_1",
      columns: [
        { id: "dateTime", alias: "dateTime", dataType: "__TIME" },
        { id: "latitude", alias: "latitude", dataType: "__FLOAT" },
        { id: "longitude", alias: "longitude", dataType: "__FLOAT" },
        { id: "units", alias: "units", dataType: "__STRING" },
        { id: "qualifier", alias: "qualifier", dataType: "__STRING" },
        { id: "siteNum", alias: "siteNum", dataType: "__STRING" },
        { id: "paramCode", alias: "paramCode", dataType: "__STRING" },
        { id: "agencyCode", alias: "agencyCode", dataType: "__STRING" },
        { id: "statCode", alias: "statCode", dataType: "__STRING" },
        { id: "methodCode", alias: "methodCode", dataType: "__STRING" },
        {
          id: "methodDescription",
          alias: "methodDescription",
          dataType: "__STRING"
        },
        {
          id: "height_01646501_1",
          alias: "height_01646501_1",
          dataType: "__FLOAT"
        }
      ]
    }
  ];
  let input = validDataJSON;
  result = generateSchemaTablesFromData(input);
  expect(result).toEqual(targetResult);
});

test("reformatTimeString correctly reformats timestring recieved from query into tableau compliant format", () => {
  let input = "2019-07-05T10:45:00.000-04:00";
  let expected = "2019-07-05 10:45:00.000";
  expect(reformatTimeString(input)).toEqual(expected);
});

test("sanitizeVariableName correctly santitizes variable name", () => {
  let input = "a b";
  let expected = "a_b";
  expect(sanitizeVariableName(input)).toEqual(expected);
  input = "!@#$% ^&*(_";
  expected = "__";
  expect(sanitizeVariableName(input)).toEqual(expected);
  input = "a b  c   d    ";
  expected = "a_b__c___d____";
  expect(sanitizeVariableName(input)).toEqual(expected);
  input = "a b  c   d    ";
  expected = "a_b__c___d____";
  expect(sanitizeVariableName(input)).toEqual(expected);
  input =
    "埨ᳫ聘퐮ꄎ㮥鉺綯᜽⬝\n븵䦜鲹㳰竊뱒沓畀ꥍ墡ᝋຨ኿淭⠜㙗৅�填즪皝�땬쩾嵥̮䂌闂榿ᕰ浻죙쓖ꦴ묇⤞꟤ᕌ⤺暞䴟㕡�ᇥ⨕䙴ᣔ拟旃寨获⢋饞뺽幹킎턊㢀㉁⏎藮꓾둵य▎�蕻줗요뱠‮Ꮉ鏨靨蘇㕦聃歚鋉㛤졔慰䠣뿽鏧楫餤飅杖�果곛⻱ﾐ᭵烪敍ⶼ曺�㴫ꎡ䌘ᨙ烽獨湬㹦輂헕㴼Ტ咨ﰂ꤂趇韙ט턐蚈惯ा毴诧叔ꖞ滶翉��枷䄘葆묃䳫뀙鑏᳃Ოᝪ位᎙ﯾ㤉凂民牯洌�빟釉쬜ᰉ苞䦱䳏䮍릭셦䶸灬瑞ꂌ᫪뷑쇆ゆ㌛챚䞫࣠뷒渤䚗䦧⒢᪂꒓䀣㐘ꮍ냘綔ꡖꙉ΃偡뽑뭖뿵ᅋ紥㽠倢貐ጹ⺲暺푚艠੨䄊覑甎垒Ⳏ㛧㟬蔹ৠ牿鄆裋麽鮶궄䉠嘿ꍔ߄鯅巤ꛜ졲�⸸䶰쭵ḵ灵볖뷚⟤ඔ丁墜뷟缫믆禙婪�灠ྮ㐦痻ዼ娈붇鱰햒퀞充뜧蓮㒁곶蟰⽕혺종ꓮ玀ꥌ資槞ॐৄ徒�慢ჴ縀砃ห뼸줆喢밼硏⺎罦玘凊揮寉�츁鈣⚃唅냛⚼�ᗀ濗侴퓭渱먯晘鋡⼪〉︅嵜₂맛揽⟳辩햠�镞ൿᔅబ೾鉚䋆儗쁽⾤誗抇奁렎厇Ȁ㾉尋�ࣞ↊춵瑗髃䛦駙䩥鶌䧸䔶橵㲯㱂易誉鴉樂ձ﷧噄య핍笍녜ᓼ잊ዏ뱊殏鲨�韊呿睘鐽㖕ꓬ崿虞禲댫硱齂䵙烣뷎᭙扩앯⛻흱涹�治팕鯩ီ殿卨⾋弳⓫恗㉷㠎뼄旟脔⟽Ｙ瑝饜㰛죛띑羅나w뢽蠇땞哃ᘏᛤᄔ捻�츅髋�⯆唢἟뤺愲᤹媻熙༆ꕁꅁ";
  expected = "_w";
  expect(sanitizeVariableName(input)).toEqual(expected);
});

test("generateDate time correctly generates datetimes with timezones when given datetime and timezone", () => {
  expect(generateDateTime("-0300", "2019-07-09T14:42:00.000Z", false)).toEqual(
    "2019-07-09T14:42:00.000-0300"
  );
  expect(generateDateTime("-0300", "2019-07-09T14:42:00.000Z", true)).toEqual(
    "2019-07-09T14:42-0300"
  );
});

test("generateMultiURL correctly generates multiple URLS with at most 100 parameters per URL", () => {
  const connectionData = {
    paramNums: Array.from({ length: 250 }, (element, index) => index), // 1, 2, 3, ... 249
    hydroCode: "02070010",
    agencyCodeActive: false,
    siteTypeListActive: false,
    siteStatus: "all",
    durationCodeActive: false,
    modifiedSinceCodeActive: false,
    temporalRangeActive: false,
    locationMode: locationMode.HYDRO,
    currentDateTime: moment("2019-08-04T14:59:00.000Z")
  };

  let partition1 = connectionData.paramNums.slice(0, 100);
  let partition2 = connectionData.paramNums.slice(100, 200);
  let partition3 = connectionData.paramNums.slice(200, 250);

  let targetResult = [
    `https://waterservices.usgs.gov/nwis/iv/?format=json&huc=02070010&parameterCd=${partition1.join(
      ","
    )}&siteStatus=all`,
    `https://waterservices.usgs.gov/nwis/iv/?format=json&huc=02070010&parameterCd=${partition2.join(
      ","
    )}&siteStatus=all`,
    `https://waterservices.usgs.gov/nwis/iv/?format=json&huc=02070010&parameterCd=${partition3.join(
      ","
    )}&siteStatus=all`
  ];

  expect(generateMultiURL(connectionData)).toEqual(targetResult);
});

test("generateMultiURL correctly generates a single URL when appropriate", () => {
  const connectionData = {
    paramNums: Array.from({ length: 23 }, (element, index) => index), // 1, 2, 3, ... 249
    hydroCode: "02070010",
    agencyCodeActive: false,
    siteTypeListActive: false,
    siteStatus: "all",
    durationCodeActive: false,
    modifiedSinceCodeActive: false,
    temporalRangeActive: false,
    locationMode: locationMode.HYDRO,
    currentDateTime: moment("2019-08-04T14:59:00.000Z")
  };

  let targetResult = [
    `https://waterservices.usgs.gov/nwis/iv/?format=json&huc=02070010&parameterCd=${connectionData.paramNums.join(
      ","
    )}&siteStatus=all`
  ];

  expect(generateMultiURL(connectionData)).toEqual(targetResult);
});
