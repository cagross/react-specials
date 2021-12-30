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
  const storeCode = "0233";
  const urlAPIFlyer =
    "https://circular.giantfood.com/flyers/giantfood?type=2&show_shopping_list_integration=1&postal_code=22204&use_requested_domain=true&store_code=" +
    storeCode +
    "&is_store_selection=true&auto_flyer=&sort_by=#!/flyers/giantfood-weekly?flyer_run_id=406535";
  return fetch(urlAPIFlyer, {
    headers: { "X-Requested-With": "XMLHttpRequest" },
  })
    .then((response) => {
      return response.text();
    })
    .then((flyerInfo) => {
      console.log("Flyer info obtained.");
      const posFlyerID = flyerInfo.search("current_flyer_id");
      const flyerID = flyerInfo.slice(posFlyerID + 18, posFlyerID + 25);
      const urlAPIData =
        "https://circular.giantfood.com/flyer_data/" +
        flyerID +
        "?locale=en-US";
      return (
        // This fetch() obtains an object containing all weekly specials data from the Giant Food store in-question.
        fetch(urlAPIData, {
          headers: { "X-Requested-With": "XMLHttpRequest" },
        })
          .then((response) => {
            console.log("response 2");
            console.log(response);
            return response.json();
          })
          .then((dataAll) => {
            console.log("All circular data fetched.");
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
              })
              .catch((err) => {
                console.log("Error saving circular data.");
                console.log(err);
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
      console.log("Error fetching.");
      console.log(err);
    });
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
