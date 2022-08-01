/**
 * @file
 * @module
 * @author Carl Gross
 */

import { doSave } from "./module-do-save.js";
import { saveToDb } from "./module-save-to-db.js";
import { unitPrice } from "./module-unit-price.js";
import { spFetch } from "./module-fetch.js";

/**
 * Accept all circular items and filter by  specific departments, e.g. meat, deli, etc.  For now, it filters by only the meat/deli department.
 * @param {object} dataItems - Object containing all circular data.
 * @param {number} filterCode - Code representing what department to use when filtering.
 * @returns {array} - Array of filtered circular items.
 */
function productFilter(dataItems, filterCode) {
  const arrMeatDeli = ["Meat", "Deli"];
  return Object.keys(dataItems).filter((key) => {
    switch (filterCode) {
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

export const apiModule = {
  /**
   * @async
   * Fetch all weekly circular data from one Giant Food Store and return only those from the deli department.
   * Also save circular data to database.
   * @param {string} storeCode - Store code of one particular Giant food store.
   * @returns {array} - Array of deli department circular items.
   */
  apiData: async (storeCode) => {
    const fetchParams = {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    };

    const urlAPIFlyer =
      "https://circular.giantfood.com/flyers/giantfood?type=2&show_shopping_list_integration=1&postal_code=22204&use_requested_domain=true&store_code=" +
      storeCode +
      "&is_store_selection=true&auto_flyer=&sort_by=#!/flyers/giantfood-weekly?flyer_run_id=406535";
    const flyerInfo = await spFetch.spFetch(urlAPIFlyer, {
      fetchParams: fetchParams,
      dataType: "text",
    });

    console.log("Flyer info obtained.");
    const posFlyerID = flyerInfo.search("current_flyer_id");
    const flyerID = flyerInfo.slice(posFlyerID + 18, posFlyerID + 25);
    const urlAPIData =
      "https://circular.giantfood.com/flyer_data/" + flyerID + "?locale=en-US";
    const dataAll = await spFetch.spFetch(urlAPIData, {
      fetchParams: fetchParams,
      dataType: "json",
    });

    //Save circular to database.
    doSave
      .doSave(
        {
          all_items: {
            valid_from: dataAll.valid_from,
            valid_to: dataAll.valid_to,
          },
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

    return productFilter(dataItems, 1).map(function (key) {
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
