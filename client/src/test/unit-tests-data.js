/**
 * Defines unit tests of data modules. Uses the Tape test runner.
 * @file
 * @author Carl Gross
 */

import test from "tape"; // assign the tape library to the variable "test"
import sinon from "sinon";
import { spFetch } from "../../../controllers/module-fetch.js";
import { doSave } from "../../../controllers/module-do-save.js";
import { saveToDb } from "../../../controllers/module-save-to-db.js";
import { apiModule } from "../../../controllers/module-data.js";
import { dataAll } from "../../../controllers/module-data-all.js";
import { storeData } from "../../../controllers/module-store-data.js";
import * as createModel from "../../../models/createModel.js";

test("Test of store data module.", async function (t) {
  let actual, expected;

  const sampleStoreNo1 = "0233";
  const sampleStoreNo2 = "0765";

  const sampleAddress1 = "7235 Arlington Blvd.";
  const sampleCity1 = "Falls Church";
  const sampleState1 = "VA";
  const sampleZip1 = "22042";

  const sampleAddress2 = "1230 W. Broad St.";
  const sampleCity2 = "Falls Church";
  const sampleState2 = "VA";
  const sampleZip2 = "22046";

  const sampleStoreData = {
    stores: [
      {
        storeNo: sampleStoreNo1,
        address1: sampleAddress1,
        city: sampleCity1,
        state: sampleState1,
        zip: sampleZip1,
      },
      {
        storeNo: sampleStoreNo2,
        address1: sampleAddress2,
        city: sampleCity2,
        state: sampleState2,
        zip: sampleZip2,
      },
    ],
  };

  let spFetchStub;

  t.comment("Case: Giant Food store search API returns valid data.");

  spFetchStub = sinon.stub(spFetch, "spFetch");
  spFetchStub.onCall(0).returns(sampleStoreData);

  actual = await storeData.storeData("22042", 2);
  expected = {};
  expected[sampleStoreNo1] = [
    "Giant Food",
    sampleAddress1,
    `${sampleCity1}, ${sampleState1} ${sampleZip1}`,
  ];
  expected[sampleStoreNo2] = [
    "Giant Food",
    sampleAddress2,
    `${sampleCity2}, ${sampleState2} ${sampleZip2}`,
  ];
  t.deepEquals(actual, expected, "Returns correct  data.");
  spFetchStub.restore();

  t.comment("Case: Giant Food store search API returns invalid data.");
  spFetchStub = sinon.stub(spFetch, "spFetch");
  spFetchStub.onCall(0).returns({ status: 403 });

  const sampleAltStoreData = {
    results: [
      {
        locations: [
          {
            latLng: { lng: 1, lat: 2 },
          },
        ],
      },
    ],
  };
  const findStub = sinon.stub().resolves(sampleStoreData.stores);
  const createModelStub = sinon
    .stub(createModel.default, "createModel")
    .resolves({
      find: findStub,
    });

  spFetchStub.onCall(1).returns(sampleAltStoreData);

  actual = await storeData.storeData("22042", 2);
  expected = {};
  expected[sampleStoreNo1] = [
    "Giant Food",
    sampleAddress1,
    `${sampleCity1}, ${sampleState1} ${sampleZip1}`,
  ];
  expected[sampleStoreNo2] = [
    "Giant Food",
    sampleAddress2,
    `${sampleCity2}, ${sampleState2} ${sampleZip2}`,
  ];
  t.deepEquals(actual, expected, "Returns correct  data.");

  spFetchStub.restore();
  createModelStub.restore();

  t.end();
});

test("Test of data all module.", async function (t) {
  let actual, expected;
  const item1 = {
    category_names: ["Meat"],
    current_price: "1.99",
    price_text: "/lb",
  };
  const item2 = {
    category_names: ["Meat"],
    current_price: "2.99",
    price_text: "/lb",
  };
  const sampleResponse1 = {
    items: [{ ...item1 }],
  };
  const sampleResponse2 = {
    items: [{ ...item2 }],
  };
  const sampleStores = {
    stores: [
      {
        storeNo: "0233",
        address1: "7235 Arlington Blvd.",
        address2: "Loehmann's Plaza",
        city: "Falls Church",
        state: "VA",
        zip: "22042",
      },
      {
        storeNo: "0765",
        address1: "1230 W. Broad St.",
        address2: "Falls Plaza",
        city: "Falls Church",
        state: "VA",
        zip: "22046",
      },
    ],
  };

  let fVal1, fVal2, storeRet;

  let doSaveStub, spFetchStub;

  t.comment("Case: two stores match search request.");

  doSaveStub = sinon.stub(doSave, "doSave").resolves(false);
  spFetchStub = sinon.stub(spFetch, "spFetch");

  fVal1 = { ...sampleResponse1 };
  fVal2 = { ...sampleResponse2 };

  storeRet = { ...sampleStores };

  spFetchStub.onCall(0).returns(storeRet);
  spFetchStub.onCall(1).returns("current_flyer_id--0123456");
  spFetchStub.onCall(2).returns(fVal1);
  spFetchStub.onCall(3).returns("current_flyer_id--6543210");
  spFetchStub.onCall(4).returns(fVal2);

  actual = await dataAll.dataAll("22042", "2");
  expected = {
    "0233": {
      storeLocation: [
        "Giant Food",
        "7235 Arlington Blvd.",
        "Falls Church, VA 22042",
      ],
      items: [{ ...item1, unit_price: "1.99" }],
    },
    "0765": {
      storeLocation: [
        "Giant Food",
        "1230 W. Broad St.",
        "Falls Church, VA 22046",
      ],
      items: [{ ...item2, unit_price: "2.99" }],
    },
  };
  t.deepEquals(actual, expected, "Returns correct value.");

  actual = spFetchStub
    .getCall(0)
    .calledWithExactly(
      `https://giantfood.com/apis/store-locator/locator/v1/stores/GNTL?storeType=GROCERY&q=22042&maxDistance=2&details=true`,
      {
        fetchParams: {
          headers: {
            "accept-language":
              "en-GB,en;q=0.9,th-TH;q=0.8,th;q=0.7,en-US;q=0.6",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36",
          },
        },
        dataType: "json",
      }
    );
  expected = true;
  t.deepEquals(
    actual,
    expected,
    "spFetch called with once with correct params (store search API)."
  );

  actual = spFetchStub.calledWithExactly(
    "https://circular.giantfood.com/flyers/giantfood?type=2&show_shopping_list_integration=1&postal_code=22204&use_requested_domain=true&store_code=0233&is_store_selection=true&auto_flyer=&sort_by=#!/flyers/giantfood-weekly?flyer_run_id=406535",
    {
      fetchParams: {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      },
      dataType: "text",
    }
  );
  expected = true;
  t.equals(
    actual,
    expected,
    "spFetch called once with correct params (0233 text call)."
  );

  actual = spFetchStub.calledWithExactly(
    "https://circular.giantfood.com/flyer_data/0123456?locale=en-US",
    {
      fetchParams: {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      },
      dataType: "json",
    }
  );
  expected = true;
  t.equals(
    actual,
    expected,
    "spFetch called once with correct params (0233 json call)."
  );

  actual = spFetchStub.calledWithExactly(
    "https://circular.giantfood.com/flyers/giantfood?type=2&show_shopping_list_integration=1&postal_code=22204&use_requested_domain=true&store_code=0765&is_store_selection=true&auto_flyer=&sort_by=#!/flyers/giantfood-weekly?flyer_run_id=406535",
    {
      fetchParams: {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      },
      dataType: "text",
    }
  );
  expected = true;
  t.equals(
    actual,
    expected,
    "spFetch called once with correct params (0765 text call)."
  );

  actual = spFetchStub.calledWithExactly(
    "https://circular.giantfood.com/flyer_data/6543210?locale=en-US",
    {
      fetchParams: {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      },
      dataType: "json",
    }
  );
  expected = true;
  t.equals(
    actual,
    expected,
    "spFetch called once with correct params (0765 json call)."
  );

  doSaveStub.restore();
  spFetchStub.restore();

  t.comment("Case: four stores match search request.");

  const emptyItems = { items: [] };
  const maxNumStores = 3;
  fVal1 = { ...sampleResponse1 };
  fVal2 = { ...sampleResponse2 };

  //Ensure each has a unique storeNo.
  storeRet = { ...sampleStores };
  storeRet.stores.push({
    storeNo: "0234",
    address1: "7235 Arlington Blvd.",
    address2: "Loehmann's Plaza",
    city: "Falls Church",
    state: "VA",
    zip: "22042",
  });
  storeRet.stores.push({
    storeNo: "0766",
    address1: "1230 W. Broad St.",
    address2: "Falls Plaza",
    city: "Falls Church",
    state: "VA",
    zip: "22046",
  });

  doSaveStub = sinon.stub(doSave, "doSave").resolves(false);
  spFetchStub = sinon.stub(spFetch, "spFetch");

  spFetchStub.onCall(0).returns(storeRet);
  spFetchStub.onCall(1).returns("sampletext");
  spFetchStub.onCall(2).returns(emptyItems);
  spFetchStub.onCall(3).returns("sampletext");
  spFetchStub.onCall(4).returns(emptyItems);
  spFetchStub.onCall(5).returns("sampletext");
  spFetchStub.onCall(6).returns(emptyItems);

  const myResult = await dataAll.dataAll("22042", "10");
  actual = Object.keys(myResult).length;
  expected = maxNumStores;
  t.deepEquals(actual, expected, "Store data capped at three stores.");

  doSaveStub.restore();
  spFetchStub.restore();

  t.comment("Case: zero stores match search request.");

  storeRet = {}; //Zero stores returned from search.

  doSaveStub = sinon.stub(doSave, "doSave").resolves(false);
  spFetchStub = sinon.stub(spFetch, "spFetch");

  spFetchStub.onCall(0).returns(storeRet);

  actual = await dataAll.dataAll("90210", 1);
  expected = {};
  t.deepEquals(actual, expected, "Returns correct value.");

  doSaveStub.restore();
  spFetchStub.restore();

  t.end();
});

test("Test of data module.", async function (t) {
  t.comment("Case: circular data does not already exist in database.");
  let actual, expected;
  let doSaveStub, saveToDbStub;
  const sampleResponse = { items: {} };

  saveToDbStub = sinon.stub(saveToDb, "saveToDb");
  doSaveStub = sinon.stub(doSave, "doSave").resolves(true);

  //Stub call to fetch so it returns the expected values on each call.
  const spFetchStub = sinon.stub(spFetch, "spFetch");
  spFetchStub.onFirstCall().returns("current_flyer_id");
  spFetchStub.onSecondCall().returns(sampleResponse);

  await apiModule.apiData("0233");

  actual = saveToDbStub.calledOnceWithExactly(
    { storeCode: "0233", all_items: sampleResponse },
    "items"
  );
  expected = true;
  t.equals(actual, expected, "saveToDb called once with correct parameters.");

  doSaveStub.restore();
  saveToDbStub.restore();

  t.end();
});
