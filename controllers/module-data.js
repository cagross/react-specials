/**
 * @file
 * @module
 * @author Carl Gross
 */

const { doSave } = require("./module-do-save.js");
const { saveToDb } = require("./module-save-to-db.js");
const fetch = require("node-fetch");
const { unitPrice } = require("./module-unit-price.js");

/**
 * Fetch weekly special data (deli department only) from the Giant Food API.
 * @async
 * @returns {array}
 */
exports.apiData = function () {
  // If this module is being called by the front-end app, it will need to have a valid proxy URL set.  Without it, fetching data will fail (at least it will in Chrome).  See the project's README file for more information on setting up a valid proxy URL.
  let proxyURL = "";
  console.log(000);
  // if (typeof window !== "undefined" && window.location.href) {
  //   console.log(1);
  //   // This conditional should resolve to true if the script is running in a browser, and false if running in Node.
  //   const regex = /:\/\/localhost/g; // This regex matches any string containing ://localhost
  //   if (window.location.href.search(regex) === -1) {
  //     console.log(2);
  //     // If the browser URL does not match the above regex, execute the following code block.
  //     proxyURL = "https://sheltered-lake-52088.herokuapp.com/"; // This proxy URL is valid only for the Specials app deployed to https://gentle-gorge-04163.herokuapp.com/.  If your app is deployed to any other URL (including localhost), you will need to implement your own proxy URL solution.  See the README for more information.
  //   } else {
  //     console.log(3);
  //     console.log(
  //       "Ensure you have a valid CORS proxy solution. If not, data fetching will not be possible.  See project's README file."
  //     );
  //   }
  // if (typeof window !== "undefined" && window.location.href) {
  console.log(1);
  // This conditional should resolve to true if the script is running in a browser, and false if running in Node.
  const regex = /:\/\/localhost/g; // This regex matches any string containing ://localhost
  if (process.env.PORT) {
    console.log(2);
    // If the browser URL does not match the above regex, execute the following code block.
    proxyURL = "https://sheltered-lake-52088.herokuapp.com/"; // This proxy URL is valid only for the Specials app deployed to https://gentle-gorge-04163.herokuapp.com/.  If your app is deployed to any other URL (including localhost), you will need to implement your own proxy URL solution.  See the README for more information.
  } else {
    console.log(3);
    console.log(
      "Ensure you have a valid CORS proxy solution. If not, data fetching will not be possible.  See project's README file."
    );
  }
  // }
  console.log(proxyURL);

  const storeCode = "0233";

  const urlAPIFlyer =
    // "https://circular.giantfood.com/flyers/giantfood?type=2&show_shopping_list_integration=1&postal_code=22204&use_requested_domain=true&store_code=0774&is_store_selection=true&auto_flyer=&sort_by=#!/flyers/giantfood-weekly?flyer_run_id=406535";
    // "https://circular.giantfood.com/flyers/giantfood?type=2&show_shopping_list_integration=1&postal_code=22204&use_requested_domain=true&store_code=0233&is_store_selection=true&auto_flyer=&sort_by=#!/flyers/giantfood-weekly?flyer_run_id=406535";
    "https://circular.giantfood.com/flyers/giantfood?type=2&show_shopping_list_integration=1&postal_code=22204&use_requested_domain=true&store_code=" +
    storeCode +
    "&is_store_selection=true&auto_flyer=&sort_by=#!/flyers/giantfood-weekly?flyer_run_id=406535";

  return (
    // fetch(proxyURL + urlAPIFlyer)
    fetch(proxyURL + urlAPIFlyer, {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    })
      // .then((response) => response.text())
      .then((response) => {
        console.log("response");
        console.log(response);
        return response.text();
      })
      .then((flyerInfo) => {
        console.log("flyerInfo");
        console.log(flyerInfo);
        const posFlyerID = flyerInfo.search("current_flyer_id");
        const flyerID = flyerInfo.slice(posFlyerID + 18, posFlyerID + 25);
        const urlAPIData =
          "https://circular.giantfood.com/flyer_data/" +
          flyerID +
          "?locale=en-US";
        return (
          // fetch(proxyURL + urlAPIData) // This fetch() obtains an object containing all weekly specials data from the Giant Food store in-question.
          fetch(proxyURL + urlAPIData, {
            headers: { "X-Requested-With": "XMLHttpRequest" },
          })
            // .then((response) => response.json())
            .then((response) => {
              console.log("response 2");
              console.log(response);
              return response.json();
            })
            .then((dataAll) => {
              console.log("dataAll");
              console.log(dataAll);
              // Save all data to database.
              doSave
                .doSave(
                  {
                    all_items: {
                      valid_from: dataAll.valid_from,
                      valid_to: dataAll.valid_to,
                    },
                    storeCode: storeCode,
                  },
                  "items"
                )
                .then((result) => {
                  console.log("result");
                  console.log(result);
                  if (result)
                    saveToDb(
                      { storeCode: storeCode, all_items: dataAll },
                      "items"
                    );
                });

              const dataItems = dataAll.items; // Filter all data into only data related to items.
              const filter = 1; // Set this to 1 to filter data into only meat/deli items.  Set this to any other value to apply no filtering (i.e. display all items on page).
              const dataMeatItemsKeys = productFilter(dataItems, filter); // This returns an array of the keys after the desired filter has been applied.
              return dataMeatItemsKeys.map(function (key) {
                // Create a new array containing only filtered items.  In addition, calculate and add a unit price property to the array.
                let item = dataItems[key];
                if (item["current_price"] === null) {
                  //If an item has no price, set its price and unit price as unknown.
                  item["unit_price"] = "unknown";
                  item["current_price"] = item["unit_price"];
                } else {
                  item["unit_price"] = unitPrice(item); //Calculate the unit price of the item and add it to the items array.
                }
                return item;
              });
            })
        );
      })
      .catch((err) => {
        console.log(888);
        console.log(err);
      })
  );
};

/**
 * Filter all data into items from specific departments, e.g. meat, deli, etc.  For now, it filters by only the meat and deli departments.
 * @param {*} dataItems
 * @param {*} filter
 * @returns {array}
 */
function productFilter(dataItems, filter) {
  const arrMeatDeli = ["Meat", "Deli"];

  let dataMeatItems = Object.keys(dataItems).filter((key) => {
    switch (filter) {
      case 1:
        if (arrMeatDeli.includes(dataItems[key]["category_names"][0])) {
          return true;
        }
        break;
      default:
        return true;
    }
  });
  return dataMeatItems;
}
