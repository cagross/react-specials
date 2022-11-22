/**
 * @file
 * @module
 * @author Carl Gross
 */

import { spFetch } from "./module-fetch.js";

export const storeData = {
  /**
   * Fetch store data and return store code and location for all Giant Food stores within given zip/radius search parameters.
   * @param {string} zip - US zip code.  Center of store search.
   * @param {number} radius - Radius of store search in miles.
   * @returns {array} - Contains store code and location of each store found in search.
   */
  storeData: async (zip, radius) => {
    const fetchParams = {
      headers: {
        "accept-language": "en-GB,en;q=0.9,th-TH;q=0.8,th;q=0.7,en-US;q=0.6",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36",
      },
    };
    let fetchResult;

    // Temporarily hardcode store data for specific search parameters.
    // fetchResult =
    //   zip === "22042" && radius === "2"
    //     ? {
    //         stores: [
    //           {
    //             storeNo: "0233",
    //             address1: "7235 Arlington Blvd.",
    //             city: "Falls Church",
    //             state: "VA",
    //             zip: "22042",
    //           },
    //           {
    //             storeNo: "0765",
    //             address1: "1230 W. Broad St.",
    //             city: "Falls Church",
    //             state: "VA",
    //             zip: "22046",
    //           },
    //         ],
    //       }
    //     : await spFetch.spFetch(
    //         `https://giantfood.com/apis/store-locator/locator/v1/stores/GNTL?storeType=GROCERY&q=${zip}&maxDistance=${radius}&details=true`,
    //         {
    //           fetchParams: fetchParams,
    //           dataType: "json",
    //         }
    //       );

    fetchResult = await spFetch.spFetch(
      `https://giantfood.com/apis/store-locator/locator/v1/stores/GNTL?storeType=GROCERY&q=${zip}&maxDistance=${radius}&details=true`,
      {
        fetchParams: fetchParams,
        dataType: "json",
      }
    );

    if (fetchResult.error) return fetchResult;
    let storeNoAndAdd = {};

    // Reduces the return value to an object--each property describing a different store. e.g.
    // {0233: ['Giant Food', '7235 Arlington Blvd.', 'Falls Church, VA 22042'], 0765: ['Giant Food', '1230 W. Broad St.', 'Falls Church, VA 22046']}
    if (fetchResult.stores) {
      storeNoAndAdd = fetchResult.stores.reduce((acc, elem) => {
        acc[elem["storeNo"]] = [
          "Giant Food",
          elem["address1"],
          `${elem["city"]}, ${elem["state"]} ${elem["zip"]}`,
        ];
        return acc;
      }, {});
    }

    return storeNoAndAdd;
  },
};
