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

test("Test of store data module.", async function (t) {
  let actual, expected;
  actual = await storeData.storeData("22042", 2);

  // See module-store-data for this hardcoded data.
  expected = {
    "0233": ["Giant Food", "7235 Arlington Blvd.", "Falls Church, VA 22042"],
    "0765": ["Giant Food", "1230 W. Broad St.", "Falls Church, VA 22046"],
  };

  t.deepEquals(actual, expected, "Returns hardcoded data.");

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

  spFetchStub.onCall(0).returns("current_flyer_id--0123456");
  spFetchStub.onCall(1).returns(fVal1);
  spFetchStub.onCall(2).returns("current_flyer_id--6543210");
  spFetchStub.onCall(3).returns(fVal2);

  actual = await dataAll.dataAll("22042", 2);
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

  const myResult = await dataAll.dataAll("22042", 10);
  actual = Object.keys(myResult).length;
  expected = maxNumStores;
  t.deepEquals(actual, expected, "Store data capped at three stores.");

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
