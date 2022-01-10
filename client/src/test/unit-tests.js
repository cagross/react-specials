import test from "tape"; // assign the tape library to the variable "test"
import sinon from "sinon";
import { storeLoc } from "../module-store-location.js";
import { dispPrice } from "../module-display-price.js";
import { unitPrice } from "../../../controllers/module-unit-price.js";
import { doSave } from "../../../controllers/module-do-save.js";
import { saveToDb } from "../../../controllers/module-save-to-db.js";
import * as createModel from "../../../models/createModel.js";
import { sendMail } from "../../../controllers/module-send-mail.js";
import { notificationModule } from "../../notification_system/notification_system.js";
import { apiModule } from "../../../controllers/module-data.js";
import { loginController } from "../../../controllers/loginController.js";

import passport from "passport";

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
  const resMock = {
      json: sinon.spy(),
      send: sinon.spy(),
    },
    reqMock = {
      login: loginStub,
    },
    nextMock = sinon.stub();
  const loginPost = loginController.loginPost;

  authenticateStub = sinon.stub(passport, "authenticate").returns(() => {});

  t.comment("Case: user successfully found in database..");

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

  authenticateStub.reset();
  loginStub.reset();

  t.end();
});

test("Tests of notification system module.", async function (t) {
  let actual, expected;
  const notificationSystem = notificationModule.main;

  const sampleUsers = [
    {
      meat: "beef",
      name: "Carl Gmail",
      email: "cagross@gmail.com",
      th_price: 1.99,
    },
    {
      meat: "all",
      name: "Carl Yahoo",
      email: "cag8f@yahoo.com",
      th_price: 4.99,
    },
  ];
  const sampleItem = {
    price_text: "/lb",
    valid_from: "Today",
    valid_to: "Tomorrow",
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
    });
  let apiDataStub;
  let testItems,
    testOutput = [];

  t.comment("Case: two users with no matches found.");

  testItems = [...sampleItems];
  testItems[0].current_price = "10.00";
  testItems[0].unit_price = "8.00";
  testItems[1].current_price = "6.00";
  testItems[1].unit_price = "5.00";
  apiDataStub = sinon.stub(apiModule, "apiData").resolves(testItems);

  await notificationSystem();

  actual = sendMailStub.notCalled;
  expected = true;
  t.equals(actual, expected, "sendMail not called.");

  sendMailStub.resetHistory();
  createModelStub.resetHistory();
  apiDataStub.restore();

  t.comment("Case: two users with matches found.");

  testItems = [...sampleItems];
  testItems[0].current_price = "1.00";
  testItems[0].unit_price = "1.00";
  testItems[1].current_price = "3.99";
  testItems[1].unit_price = "3.99";
  apiDataStub = sinon.stub(apiModule, "apiData").resolves(testItems);

  testOutput[0] =
    "Hi Carl Gmail,<br><br>Based on your selection criteria, we've found some matches this week.<br><br>Your selection criteria is:  <br><i><bold>Meat Preference:  beef<br>Threshold Price:  1.99</bold></i><br><br>The specials are available at this store:<br><i><bold>Giant Food<br>7235 Arlington Blvd<br>Falls Church, VA 22042<br></bold></i><br><br><table><tr><td>Item Name</td><td>Item Price</td><td>Item Unit Price</td></tr><tr><td>Ribeye steak</td><td>1.00/lb</td><td>1.00/lb</td></tr></table>";

  testOutput[1] =
    "Hi Carl Yahoo,<br><br>Based on your selection criteria, we've found some matches this week.<br><br>Your selection criteria is:  <br><i><bold>Meat Preference:  all<br>Threshold Price:  4.99</bold></i><br><br>The specials are available at this store:<br><i><bold>Giant Food<br>7235 Arlington Blvd<br>Falls Church, VA 22042<br></bold></i><br><br><table><tr><td>Item Name</td><td>Item Price</td><td>Item Unit Price</td></tr><tr><td>Ribeye steak</td><td>1.00/lb</td><td>1.00/lb</td></tr><tr><td>Chicken breast</td><td>3.99/lb</td><td>3.99/lb</td></tr></table>";

  await notificationSystem();

  actual = sendMailStub.calledTwice;
  expected = true;
  t.equals(actual, expected, "sendMail called twice.");

  actual = sendMailStub
    .getCall(0)
    .calledWithExactly(
      `Grocery Specials For + ${sampleItem.valid_from} - ${sampleItem.valid_to}`,
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
      `Grocery Specials For + ${sampleItem.valid_from} - ${sampleItem.valid_to}`,
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
  apiDataStub.restore();

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
  let doSaveStub = sinon.stub(doSave, "doSave").returns(true);

  await saveToDb(circInfo, sampleTbleName);

  actual = createModelStub.calledOnce;
  expected = true;
  t.equals(actual, expected, "createModel called once.");

  doSaveStub.resetHistory();
  saveCallCount = 0;

  let result = await saveToDb(circInfo, sampleTbleName);
  actual = result;
  expected = true;
  t.equals(actual, expected, "Returns true.");

  actual = saveCallCount;
  expected = 1;
  t.equals(actual, expected, "save method called once.");

  doSaveStub.restore();
  saveCallCount = 0;
  createModelStub.restore();

  t.end();
});

// This is a trivial test for now.
test("Test of store location function.", function (t) {
  const storeLocRes = [
    "Giant Food",
    "7235 Arlington Blvd",
    "Falls Church, VA 22042",
  ];
  t.deepEqual(storeLocRes, storeLoc, "Store address."); // make this test pass by completing the add function!
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

  t.end();
});
