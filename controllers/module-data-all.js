/**
 * @file
 * @module
 * @author Carl Gross
 */

import { apiModule } from "./module-data.js";
import { storeData } from "./module-store-data.js";

export const dataAll = {
  /**
   * @async
   * Uses zip/radius search parameters to find circular items from all stores found within the zip/radius search. Limits stores to three max.
   * @param {string} zip - US zip code.  Center of store search.
   * @param {number} radius - Radius of store search in miles.
   * @returns
   */
  dataAll: async (zip, radius) => {
    const storeCodeLoc = await storeData.storeData(zip, radius);
    if (storeCodeLoc.error) return storeCodeLoc;

    let storeDataAll = {};

    //Limit store search to three stores max.
    const max = Math.min(Object.keys(storeCodeLoc)?.length || 0, 2);
    for (let i = 0; i <= max; i++) {
      if (Object.keys(storeCodeLoc)[i])
        storeDataAll[Object.keys(storeCodeLoc)[i]] =
          storeCodeLoc[Object.keys(storeCodeLoc)[i]];
    }

    for (const property in storeDataAll) {
      console.log(`${property}: ${storeDataAll[property]}`);
      storeDataAll[property] = {
        storeLocation: storeDataAll[property],
        items: await apiModule.apiData(property),
      };
    }

    return storeDataAll;
  },
};
