/**
 * @file
 * @module
 * @author Carl Gross
 */

import { doSave } from "./module-do-save.js";
import { saveToDb } from "./module-save-to-db.js";
import fetch from "node-fetch";
import { unitPrice } from "./module-unit-price.js";
import { spFetch } from "./module-fetch.js";

export const apiModule = {
  /**
   * Fetch weekly special data (deli department only) from the Giant Food API.
   * @async
   * @returns {array}
   */
  apiData: async () => {
    const fetchParams = {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    };
    const storeCode = "0233";
    const urlAPIFlyer =
      "https://circular.giantfood.com/flyers/giantfood?type=2&show_shopping_list_integration=1&postal_code=22204&use_requested_domain=true&store_code=" +
      storeCode +
      "&is_store_selection=true&auto_flyer=&sort_by=#!/flyers/giantfood-weekly?flyer_run_id=406535";
    const flyerResponse = await spFetch.spFetch(urlAPIFlyer, fetchParams);
    const flyerInfo = await flyerResponse.text();
    console.log("Flyer info obtained.");
    const posFlyerID = flyerInfo.search("current_flyer_id");
    const flyerID = flyerInfo.slice(posFlyerID + 18, posFlyerID + 25);
    const urlAPIData =
      "https://circular.giantfood.com/flyer_data/" + flyerID + "?locale=en-US";
    const circularResponse = await spFetch.spFetch(urlAPIData, fetchParams);
    const dataAll = await circularResponse.json();
    console.log("All circular data fetched.");
    //Save circular to database.
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
      .then((doSaveResult) => {
        if (doSaveResult)
          saveToDb.saveToDb(
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
  },
};

/**
 * Filter all data into items from specific departments, e.g. meat, deli, etc.  For now, it filters by only the meat and deli departments.
 * @param {*} dataItems
 * @param {*} filter
 * @returns {array}
 */
function productFilter(dataItems, filter) {
  const arrMeatDeli = ["Meat", "Deli"];

  return Object.keys(dataItems).filter((key) => {
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
}
