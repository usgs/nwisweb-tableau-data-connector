import {
  formatJSONAsTable,
  generateURL,
  generateColList,
  generateSchemaTablesFromData,
  getTimeSeriesByID,
  reformatTimeString,
  sanitizeVariableName
} from "../../src/WDCMethods.js";
import { locationMode } from "../../src/enums.js";

const validDataJSON = {
  value: {
    //barebones mockup of a data json with data series of uniform length
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
          siteCode: [{ value: "01646500" }]
        },
        variable: {
          variableDescription: "flow",
          unit: {
            unitCode: "ft3/s"
          }
        },
        values: [
          {
            value: [
              {
                value: "10800",
                qualifiers: ["P","A"],
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
      flow_01646500: "10800",
      dateTime: "2019-07-05 10:45:00.000",
      latitude: "0.000000",
      longitude: "0.000000",
      units: "ft3/s",
      qualifier: "P:Provisional data subject to revision.,A:Approved"
    },
    {
      flow_01646500: "10800",
      dateTime: "2019-07-05 10:45:00.000",
      latitude: "0.000000",
      longitude: "0.000000",
      units: "ft3/s",
      qualifier: "P:Provisional data subject to revision."
    }
  ];

  expect(formatJSONAsTable(input, "flow_01646500")).toEqual(targetResult);
});

test("correctly generate a URL given a list of sites and parameters with various whitespace", () => {
  const connectionData = {
    siteNums: "01646500 ,   05437641",
    paramNums: ["00060", "00065"],
    state: "Rhode Island",
    locationMode: locationMode.SITE
  };
  expect(generateURL(connectionData)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01646500,05437641&period=P1D&parameterCd=00060,00065&siteStatus=all"
  );
});

test("correctly generate a URL given a state", () => {
  const connectionData = {
    paramNums: ["00060", "00065"],
    state: "ri",
    locationMode: locationMode.STATE
  };
  expect(generateURL(connectionData)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&stateCd=ri&period=P1D&parameterCd=00060,00065&siteStatus=all"
  );
});

test("correctly generate a URL given a coordinate bounding box", () => {
  const connectionData = {
    paramNums: ["00060", "00065"],
    boundaryCoords: {
      north: "2.000000",
      south: "1.000000",
      east: "2.000000",
      west: "1.000000"
    },
    locationMode: locationMode.COORDS
  };
  expect(generateURL(connectionData)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&bBox=1.000000,1.000000,2.000000,2.000000&period=P1D&parameterCd=00060,00065&siteStatus=all"
  );
});

test("correctly generate a URL given a hydrological Unit Code", () => {
  const connectionData = {
    paramNums: ["00060", "00065"],
    hydroCode: "02070010",
    locationMode: locationMode.HYDRO
  };
  expect(generateURL(connectionData)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&huc=02070010&period=P1D&parameterCd=00060,00065&siteStatus=all"
  );
});

test("correctly generate a URL given a list of counties", () => {
  const connectionData = {
    paramNums: ["00060", "00065"],
    countyCode: [11111, 22222],
    locationMode: locationMode.COUNTY
  };
  expect(generateURL(connectionData)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&countyCd=11111,22222&period=P1D&parameterCd=00060,00065&siteStatus=all"
  );
});

test("correctly generates the column schema from sites and parameters", () => {
  const sites = "01646500,05437641";
  const params = ["00060", "00065"];

  const targetResult = [
    "01646500_00060",
    "01646500_00065",
    "05437641_00060",
    "05437641_00065"
  ];
  expect(generateColList(sites, params)).toEqual(targetResult);
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
      id: "flow_01646500",
      alias: "flow_01646500",
      columns: [
        { id: "dateTime", alias: "dateTime", dataType: "__TIME" },
        { id: "latitude", alias: "latitude", dataType: "__FLOAT" },
        { id: "longitude", alias: "longitude", dataType: "__FLOAT" },
        { id: "units", alias: "units", dataType: "__STRING" },
        { id: "qualifier", alias: "qualifier", dataType: "__STRING" },
        { id: "flow_01646500", alias: "flow_01646500", dataType: "__STRING" }
      ]
    },
    {
      id: "height_01646501",
      alias: "height_01646501",
      columns: [
        { id: "dateTime", alias: "dateTime", dataType: "__TIME" },
        { id: "latitude", alias: "latitude", dataType: "__FLOAT" },
        { id: "longitude", alias: "longitude", dataType: "__FLOAT" },
        { id: "units", alias: "units", dataType: "__STRING" },
        { id: "qualifier", alias: "qualifier", dataType: "__STRING" },
        {
          id: "height_01646501",
          alias: "height_01646501",
          dataType: "__STRING"
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
