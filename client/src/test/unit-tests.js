/**
 * Defines unit tests. Uses the Tape test runner.
 * @file
 * @author Carl Gross
 */

import test from "tape";
import sinon from "sinon";
import { dispPrice } from "../module-display-price.js";
import { filter } from "../module-filter.js";
import { unitPrice } from "../../../controllers/module-unit-price.js";
import { doSave } from "../../../controllers/module-do-save.js";
import { saveToDb } from "../../../controllers/module-save-to-db.js";
import { register_post } from "../../../controllers/registerController.js";
import * as createModel from "../../../models/createModel.js";
import { sendMail } from "../../../controllers/module-send-mail.js";
import { notificationModule } from "../../notification_system/notification_system.js";
import { loginController } from "../../../controllers/loginController.js";
import { items_post } from "../../../controllers/itemsController.js";
import { dataAll } from "../../../controllers/module-data-all.js";
import { spFetch } from "../../../controllers/module-fetch.js";
import { emailSubject } from "../../../controllers/module-email-subject.js";

import passport from "passport";

test("Test of items module.", async function (t) {
  const testZip = "22042";
  const testRadius = 2;
  const sampleReq = { body: { zip: testZip, radius: testRadius } };
  const sampleRes = { send: () => {} };
  const dataAllStub = sinon.stub(dataAll, "dataAll").resolves({ myProp: 555 }); //Ensure at least one property exists in return object.

  await items_post[2](sampleReq, sampleRes);

  const actual = dataAllStub.getCall(0).calledWithExactly(testZip, testRadius);
  const expected = true;
  t.equals(actual, expected, "dataAll always called with correct parameters.");

  dataAllStub.restore();

  t.end();
});

test("Tests of items controller.", async function (t) {
  t.comment("Case: zero stores match search request.");
  let actual, expected;
  const sampleReq = { body: { zip: "22042", radius: 1 } };
  const sampleRes = { send: () => {} };
  const sampleResponse = {}; //Any object without a 'stores' property.
  const itemsHandler = items_post[2];

  const spFetchStub = sinon.stub(spFetch, "spFetch");
  spFetchStub.onCall(0).returns({ sampleResponse });

  const sendStub = sinon.stub(sampleRes, "send");

  await itemsHandler(sampleReq, sampleRes);

  actual = sendStub.calledOnceWithExactly({ noStores: true });
  expected = true;
  t.equals(actual, expected, "res.send called once with correct params.");

  spFetchStub.restore();

  t.end();
});

test("Test of register module.", async function (t) {
  let actual, expected;
  let doSaveStub, saveToDbStub;

  const registerHandler = register_post[6];

  doSaveStub = sinon.stub(doSave, "doSave").resolves(null);

  saveToDbStub = sinon.stub(saveToDb, "saveToDb").resolves(true);

  const sampleReq = {
    body: {
      email: "email@example.com",
      password: "samplepassword",
      meatPref: "poultry",
      price: 4.99,
      firstName: "Graham",
      lastName: "McAllister",
    },
    headers: {
      host: "localhost:5555",
      origin: "http://localhost:5555",
      referer: "http://localhost:5555/register",
      "sec-ch-ua-platform": "Windows",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
    },
  };
  const sampleRes = { json: () => {} };

  await registerHandler(sampleReq, sampleRes);

  actual = saveToDbStub.calledWith(
    sinon.match
      .has("email", sampleReq.body.email)
      .and(sinon.match.has("password", sinon.match.string))
      .and(sinon.match.has("meat", sampleReq.body.meatPref))
      .and(sinon.match.has("th_price", sampleReq.body.price))
      .and(
        sinon.match.has(
          "name",
          `${sampleReq.body.firstName} ${sampleReq.body.lastName}`
        )
      )
      .and(sinon.match.has("host", sampleReq.headers.host))
      .and(sinon.match.has("origin", sampleReq.headers.origin))
      .and(sinon.match.has("referer", sampleReq.headers.referer))
      .and(sinon.match.has("platform", sampleReq.headers["sec-ch-ua-platform"]))
      .and(sinon.match.has("dateCreated", sinon.match.date))
      .and(sinon.match.has("userAgent", sampleReq.headers["user-agent"]))
  );
  expected = true;
  t.equals(actual, expected, "saveToDb called once with correct parameters.");

  doSaveStub.restore();
  saveToDbStub.restore();

  t.end();
});

test("Tests of do-save module.", async function (t) {
  let actual, expected;
  let findOneStub, createModelStub;

  t.comment("Case: data does not already exist in database..");

  findOneStub = sinon.stub().resolves(null);
  createModelStub = sinon.stub(createModel.default, "createModel").resolves({
    findOne: findOneStub,
  });

  actual = await doSave.doSave({}, "items");
  expected = true;
  t.equals(actual, expected, "Returns true.");

  createModelStub.restore();
  findOneStub.reset();

  t.comment("Case: data already exists in database..");

  findOneStub = sinon.stub().resolves({});
  createModelStub = sinon.stub(createModel.default, "createModel").resolves({
    findOne: findOneStub,
  });

  actual = await doSave.doSave({}, "items");
  expected = false;
  t.equals(actual, expected, "Returns false.");

  createModelStub.restore();
  findOneStub.reset();

  t.end();
});

test("Tests of login module.", async function (t) {
  let actual, expected;
  let authenticateStub;
  const sampleObj = { myProp: 555 };
  const loginStub = sinon.stub();
  const resStatusStub = sinon.stub().returns({ json: () => {} });

  const resMock = {
      json: sinon.spy(),
      send: sinon.spy(),
      status: resStatusStub,
    },
    reqMock = {
      login: loginStub,
    },
    nextMock = sinon.stub();
  const loginPost = loginController.loginPost;

  authenticateStub = sinon.stub(passport, "authenticate").returns(() => {});

  t.comment("Case: user successfully found in database.");

  loginPost(reqMock, resMock, nextMock);

  actual = authenticateStub.calledWith("local", sinon.match.any);
  expected = true;
  t.equals(actual, expected, "passport.authenticate called once.");

  authenticateStub.resetHistory();
  loginStub.resetHistory();

  authenticateStub.yields(false, sampleObj, undefined);

  loginPost(reqMock, resMock, nextMock);

  actual = loginStub.calledOnceWith(sinon.match(sampleObj));
  expected = true;
  t.equals(actual, expected, "req.login called once with correct params.");

  authenticateStub.resetHistory();
  loginStub.resetHistory();

  t.comment("Case: user not found in database.");

  authenticateStub.yields(false, false, undefined);

  loginPost(reqMock, resMock, nextMock);

  actual = loginStub.notCalled;
  expected = true;
  t.equals(actual, expected, "req.login not called.");

  actual = resStatusStub.calledOnce;

  expected = true;
  t.equals(actual, expected, "res.status called once.");

  authenticateStub.reset();
  loginStub.reset();

  t.end();
});

test("Tests of notification system module.", async function (t) {
  let actual, expected;

  t.comment("Test of method: main.");

  let sampleResponse1;
  let fVal1;

  let spFetchStub;

  const notificationSystem = notificationModule.main;

  const sampleUsers = [
    {
      meat: "beef",
      name: "Graham McAllister",
      email: "email@example.com",
      th_price: 1.99,
    },
    {
      meat: "all",
      name: "Arnold Leland",
      email: "email@domain.com",
      th_price: 4.99,
    },
  ];
  const sampleItem = {
    price_text: "/lb",
    valid_from: "Today",
    valid_to: "Tomorrow",
    category_names: ["Meat"],
  };
  const sampleItems = [
    {
      ...sampleItem,
      ...{
        display_name: "Ribeye steak",
      },
    },
    {
      ...sampleItem,
      ...{
        display_name: "Chicken breast",
      },
    },
  ];

  const sendMailStub = sinon.stub(sendMail, "sendMail");
  const createModelStub = sinon
    .stub(createModel.default, "createModel")
    .resolves({
      find: () => sampleUsers,
      findOne: async () => {
        return true;
      },
    });
  let testItems,
    testOutput = [];

  t.comment("Case: two users with no matches found.");

  testItems = [...sampleItems];
  testItems[0].current_price = "10.00";
  testItems[0].unit_price = "8.00";
  testItems[1].current_price = "6.00";
  testItems[1].unit_price = "5.00";

  sampleResponse1 = {
    items: testItems,
  };

  fVal1 = { ...sampleResponse1 };

  spFetchStub = sinon.stub(spFetch, "spFetch");
  spFetchStub.onCall(0).returns("current_flyer_id--0123456");
  spFetchStub.onCall(1).returns(fVal1);

  testOutput[0] =
    "Hi Graham McAllister,<br><br>Based on your selection criteria, here are this week's matches.<br><br>Your selection criteria is:  <br><i><bold>Meat Preference:  beef<br>Threshold Price:  1.99</bold></i><br><br>The specials are available at this store:<br><i><bold>Giant Food<br>7235 Arlington Blvd.<br>Falls Church, VA 22042<br></bold></i><br><br><table><tr><td>Item Name</td><td>Item Price</td><td>Item Unit Price</td></tr></table>";

  testOutput[1] =
    "Hi Arnold Leland,<br><br>Based on your selection criteria, here are this week's matches.<br><br>Your selection criteria is:  <br><i><bold>Meat Preference:  all<br>Threshold Price:  4.99</bold></i><br><br>The specials are available at this store:<br><i><bold>Giant Food<br>7235 Arlington Blvd.<br>Falls Church, VA 22042<br></bold></i><br><br><table><tr><td>Item Name</td><td>Item Price</td><td>Item Unit Price</td></tr></table>";

  await notificationSystem();

  actual = sendMailStub.calledTwice;
  expected = true;
  t.equals(actual, expected, "sendMail called twice.");

  actual = sendMailStub
    .getCall(0)
    .calledWithExactly(
      `Grocery Specials For ${sampleItem.valid_from} - ${sampleItem.valid_to}`,
      testOutput[0],
      testOutput[0],
      sampleUsers[0].email
    );
  expected = true;
  t.equals(
    actual,
    expected,
    "First call to sendMail passed expected parameters."
  );

  actual = sendMailStub
    .getCall(1)
    .calledWithExactly(
      `Grocery Specials For ${sampleItem.valid_from} - ${sampleItem.valid_to}`,
      testOutput[1],
      testOutput[1],
      sampleUsers[1].email
    );
  expected = true;
  t.equals(
    actual,
    expected,
    "Second call to sendMail passed expected parameters."
  );

  sendMailStub.resetHistory();
  spFetchStub.restore();

  t.comment("Case: two users with matches found.");

  testItems = [...sampleItems];
  testItems[0].current_price = "1.00";
  testItems[0].unit_price = "1.00";
  testItems[1].current_price = "3.99";
  testItems[1].unit_price = "3.99";

  sampleResponse1 = {
    items: testItems,
  };

  fVal1 = { ...sampleResponse1 };

  spFetchStub = sinon.stub(spFetch, "spFetch");
  spFetchStub.onCall(0).returns("current_flyer_id--0123456");
  spFetchStub.onCall(1).returns(fVal1);

  testOutput[0] =
    "Hi Graham McAllister,<br><br>Based on your selection criteria, here are this week's matches.<br><br>Your selection criteria is:  <br><i><bold>Meat Preference:  beef<br>Threshold Price:  1.99</bold></i><br><br>The specials are available at this store:<br><i><bold>Giant Food<br>7235 Arlington Blvd.<br>Falls Church, VA 22042<br></bold></i><br><br><table><tr><td>Item Name</td><td>Item Price</td><td>Item Unit Price</td></tr><tr><td>Ribeye steak</td><td>$1.00/lb</td><td>$1.00/lb</td></tr></table>";

  testOutput[1] =
    "Hi Arnold Leland,<br><br>Based on your selection criteria, here are this week's matches.<br><br>Your selection criteria is:  <br><i><bold>Meat Preference:  all<br>Threshold Price:  4.99</bold></i><br><br>The specials are available at this store:<br><i><bold>Giant Food<br>7235 Arlington Blvd.<br>Falls Church, VA 22042<br></bold></i><br><br><table><tr><td>Item Name</td><td>Item Price</td><td>Item Unit Price</td></tr><tr><td>Ribeye steak</td><td>$1.00/lb</td><td>$1.00/lb</td></tr><tr><td>Chicken breast</td><td>$3.99/lb</td><td>$3.99/lb</td></tr></table>";

  await notificationSystem();

  actual = sendMailStub.calledTwice;
  expected = true;
  t.equals(actual, expected, "sendMail called twice.");

  actual = sendMailStub
    .getCall(0)
    .calledWithExactly(
      `Grocery Specials For ${sampleItem.valid_from} - ${sampleItem.valid_to}`,
      testOutput[0],
      testOutput[0],
      sampleUsers[0].email
    );
  expected = true;
  t.equals(
    actual,
    expected,
    "First call to sendMail passed expected parameters."
  );

  actual = sendMailStub
    .getCall(1)
    .calledWithExactly(
      `Grocery Specials For ${sampleItem.valid_from} - ${sampleItem.valid_to}`,
      testOutput[1],
      testOutput[1],
      sampleUsers[1].email
    );
  expected = true;
  t.equals(
    actual,
    expected,
    "Second call to sendMail passed expected parameters."
  );

  sendMailStub.restore();
  createModelStub.restore();
  spFetchStub.restore();

  t.end();
});

test("Test of save to database.", async function (t) {
  const sampleTbleName = "items";
  const circInfo = {
    storeCode: "0444",
    all_items: {
      valid_from: new Date(),
      valid_to: new Date(),
    },
  };
  let actual, expected;
  let doSaveStub;
  let saveCallCount = 0;
  class myModelStub {
    constructor() {
      this.storeCode = circInfo.storeCode;
      this.items = {
        valid_from: circInfo.valid_from,
        valid_to: circInfo.valid_to,
      };
      this.save = myMock;
    }
  }
  function myMock() {
    saveCallCount += 1;
    return this;
  }
  const createModelStub = sinon
    .stub(createModel.default, "createModel")
    .returns(myModelStub);
  doSaveStub = sinon.stub(doSave, "doSave").returns(true);

  const saveResult = await saveToDb.saveToDb(circInfo, sampleTbleName);

  actual = saveResult;
  expected = true;
  t.equals(actual, expected, "Returns true.");

  actual = createModelStub.calledOnce;
  expected = true;
  t.equals(actual, expected, "createModel called once.");

  actual = saveCallCount;
  expected = 1;
  t.equals(actual, expected, "save method called once.");

  doSaveStub.restore();
  saveCallCount = 0;
  createModelStub.restore();

  t.end();
});

// Item with 'lb' in price description.
const testObj1 = {
  display_name: "Philly Gourmet Beef Patties",
  description: "Frozen, 4 lb. pkg.",
  current_price: "12.99",
  pre_price_text: "",
  price_text: "/ea.",
  valid_to: "2020-09-24",
  valid_from: "2020-09-18",
  disclaimer_text: null,
};
const testObj2 = {
  display_name: "Chicken Breast",
  description: "",
  current_price: "1.99",
  pre_price_text: "",
  price_text: "/lb.",
  valid_to: "2020-09-24",
  valid_from: "2020-09-18",
  disclaimer_text: null,
};
let i;
// Array of test objects that will be passed to unit tests.
const testArr = [
  {
    display_name: "Perdue Chicken Short Cuts",
    description: "Selected Varieties, 6–9 oz. pkg.",
    current_price: "6.0",
    pre_price_text: "2/",
    price_text: "",
    valid_to: "2020-09-03",
    valid_from: "2020-08-28",
    disclaimer_text: null,
    unit_price: 16,
  },
  {
    display_name: "Giant Smoked Bone-In Ham Butt or Shank",
    name: "Giant Smoked Bone-In Ham Butt or Shank",
    description: null,
    current_price: "0.99",
    pre_price_text: "",
    price_text: "/lb.",
    valid_to: "2020-04-12",
    valid_from: "2020-04-10",
    disclaimer_text: "LIMIT 2",
    unit_price: "0.99",
  },
  {
    display_name: "Giant 80% Lean Ground Beef Patties",
    name: "Giant 80% Lean Ground Beef Patties",
    description: "Frozen, 20% Fat, 4 lb. pkg.",
    current_price: "12.99",
    pre_price_text: "",
    price_text: "/ea.",
    valid_to: "2020-05-07",
    valid_from: "2020-05-01",
    disclaimer_text: null,
    unit_price: "not set",
  },
  {
    display_name: "Phillips Crab Meat",
    name: "Phillips Crab Meat",
    description: "8 oz. cont., Refrigerated",
    current_price: "unknown",
    pre_price_text: "",
    price_text: "",
    valid_to: "2020-08-20",
    valid_from: "2020-08-14",
    disclaimer_text: null,
  },
  {
    display_name: "Sabra Hummus",
    name: "Sabra Hummus",
    description: "All Varieties, 8–10 oz. pkg.",
    current_price: null,
    pre_price_text: "",
    price_text: "",
    url: null,
    valid_to: "2020-08-20",
    valid_from: "2020-08-14",
    disclaimer_text: null,
    unit_price: 0,
  },
  {
    display_name: "Lloyd's BBQ Shredded Chicken or Pork",
    name: "Lloyd's BBQ Shredded Chicken or Pork",
    description: "Selected Varieties, 16 oz. pkg.",
    current_price: "unknown",
    pre_price_text: "",
    price_text: "",
    url: null,
    valid_to: "2020-09-03",
    valid_from: "2020-08-28",
    disclaimer_text: null,
    unit_price: "unknown",
  },
  {
    display_name: "Chicken of the Sea Crab Meat",
    name: "Chicken of the Sea Crab Meat",
    description: "16 oz. cont., Refrigerated",
    current_price: "unknown",
    pre_price_text: "",
    price_text: "",
    valid_to: "2020-09-03",
    valid_from: "2020-08-28",
    disclaimer_text: null,
    unit_price: "unknown",
  },

  {
    display_name:
      "Jimmy Dean Breakfast Sandwiches, Hash Browns, Frittatas or Delights",
    name: "Jimmy Dean Breakfast Sandwiches, Hash Browns, Frittatas or Delights",
    description: "Frozen, Selected Varieties, 12–20.4 oz. pkg.",
    current_price: "unknown",
    pre_price_text: "",
    price_text: "",
    valid_to: "2020-09-03",
    valid_from: "2020-08-28",
    disclaimer_text: null,
    unit_price: "unknown",
  },
  testObj1,
  {
    display_name: "Oscar Mayer Deli Fresh Lunch Meat",
    name: "Oscar Mayer Deli Fresh Lunch Meat",
    description: "Selected Varieties, 16 oz. pkg.",
    current_price: "10.0",
    pre_price_text: "2/",
    price_text: null,
    tag_ids: [],
    valid_to: "2020-12-25",
    valid_from: "2020-12-18",
    disclaimer_text: null,
    unit_price: 10,
  },
];

test("Tests of filter module.", function (t) {
  let actual, expected;
  const sampleItems = [{ ...testObj1 }, { ...testObj2 }];
  actual = filter("beef", sampleItems);
  expected = [{ ...testObj1 }];
  t.deepEquals(actual, expected, "Returns expected result.");

  t.end();
});

test("Test of display price function.", function (t) {
  let displayedPrice;
  for (i = 0; i < testArr.length; i++) {
    displayedPrice = dispPrice(
      testArr[i]["current_price"],
      testArr[i]["price_text"]
    );
    if (
      !testArr[i]["current_price"] ||
      testArr[i]["current_price"] === "unknown"
    ) {
      t.deepEqual(
        "Unknown",
        displayedPrice,
        "Displayed price must be: 'Unknown'"
      );
    } else {
      t.deepEqual(
        "string",
        typeof displayedPrice,
        "Displayed price must be a string."
      );
      t.match(
        displayedPrice,
        /^(\$\d+\.\d{2})((\/\w+\.)?)$/,
        "Displayed price is correct format."
      ); // RegEx matches strings of format $3.99 or $3.99/lb.  See here for more info: regexr.com/5ll4e).
    }
  }
  t.end();
});

test("Tests of unit price function.", function (t) {
  let testUnitPrice;
  let testItem;

  testItem = {
    display_name: "Perdue Chicken Short Cuts",
    name: "Perdue Chicken Short Cuts",
    description: "Selected Varieties, 6–9 oz. pkg.",
    current_price: "6.0",
    pre_price_text: "2/",
    valid_to: "2020-09-03",
    valid_from: "2020-08-28",
    disclaimer_text: null,
  };
  testUnitPrice = unitPrice(testItem);
  t.equal(
    testUnitPrice,
    8,
    "Unit price returns correct value (item with an additional divisor (e.g. '2 for $3.00')."
  );

  testItem = testObj1;
  testUnitPrice = unitPrice(testItem);
  t.equal(
    testUnitPrice,
    3.2475,
    "Unit price returns correct value (item with 'lb' in price description.)."
  );

  testItem = {
    current_price: "10",
    price_text: "/lb",
    description: "Organic apples",
    pre_price_text: "",
  };
  testUnitPrice = unitPrice(testItem);

  t.equal(
    testUnitPrice,
    "10",
    "Should return correct value when description does not contain 'lb' or 'oz' but price_text contains 'lb.'"
  );
  t.end();
});

test("Tests of emailSubject function.", (t) => {
  const actual = emailSubject("2021-06-01", "2021-06-07");
  const expected = "Grocery Specials For 2021-06-01 - 2021-06-07";
  t.equal(actual, expected, "Returns expected result.");
  t.end();
});
