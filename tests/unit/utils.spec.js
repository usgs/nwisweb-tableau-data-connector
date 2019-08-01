/* 
  This file contains tests for functions inside the util.js file.
*/

import { get, multiGet, combineJSONList } from "../../src/utils.js";

/*global  xmlFunctionHolder:true*/

// a URL that returns nothing
let fake_url = "https://fake.service.com/request";

describe("Test for get() in utils.js", () => {
  /*
    This test will check that the URL used by get() matches fake_url
  */
  it("The url passed to get() is the same url used to make the request", () => {
    get(fake_url);
    // global.recentRequest is in jestSetup.js.  It is set to the most recently requested URL.
    expect(global.recentRequest).toEqual(fake_url);
  });

  /*
    This test will confirm that get() is calling open() in order 
    to make an HTTPrequest
  */
  it("Get is calling open to make a request", () => {
    //xmlFunctionHolder is initialized globally in jestSetup.js
    const spy = jest.spyOn(xmlFunctionHolder, "open");
    get(fake_url);
    expect(spy).toHaveBeenCalled();
  });

  /*
    This test will check that data.params is defined when it is 
    passed from testXML() in jestSetup.js
  */
  it("The response of the promise is defined", () => {
    //.then will run in place of the .then in getData() in WDCMethods.js
    return get(fake_url).then(data => expect(data.params).toBeDefined());
  });

  /*
    This test will check that data.params is correctly passed from 
    the contents of req.response in testXML() in jestSetup.js
  */
  it("The response of the promise is correct", () => {
    //.then will run in place of the .then in getData() in WDCMethods.js
    return get(fake_url).then(data => expect(data.params).toEqual("00060"));
  });
});

test("multiget rejects if one of its promises rejects", async () => {
  let toggle = false;
  let getFunc = () => {
    toggle = !toggle;
    if (toggle) {
      return new Promise((undefined, reject) => {
        reject("error");
      });
    } else {
      return new Promise(resolve => {
        resolve("success");
      });
    }
  };
  await expect(
    multiGet(["fakeurl1", "fakeurl2"], "json", getFunc)
  ).rejects.toMatch("error");
});

test("multiget resolves if all of its promises resolve", async () => {
  let getFunc = () => {
    return new Promise(resolve => {
      resolve("success");
    });
  };

  await expect(
    multiGet(["fakeurl1", "fakeurl2"], "json", getFunc)
  ).resolves.toEqual(["success", "success"]);
});

test("combineJSON correctly combines 3 data JSON", () => {
  let input = [
    {
      value: {
        queryInfo: {
          queryURL: "fakeurl1"
        },
        timeSeries: [
          "t1", // note that these are objects in the real data JSON,
          "t2", //  these strings are provided as a placeholder to improve readability
          "t3"
        ]
      }
    },
    {
      value: {
        queryInfo: {
          queryURL: "fakeurl2"
        },
        timeSeries: ["t4", "t5", "t6"]
      }
    },
    {
      value: {
        queryInfo: {
          queryURL: "fakeurl3"
        },
        timeSeries: ["t7", "t8", "t9"]
      }
    }
  ];

  let targetResult = {
    value: {
      queryInfo: {
        queryURL: ["fakeurl1", "fakeurl2", "fakeurl3"],
        multi: true
      },
      timeSeries: ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"]
    }
  };
  expect(combineJSONList(input)).toEqual(targetResult);
});
