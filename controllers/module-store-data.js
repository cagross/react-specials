/**
 * @file
 * @module
 * @author Carl Gross
 */

import { spFetch } from "./module-fetch.js";
import createModel from "../models/createModel.js";

export const storeData = {
  /**
   * Fetch store data and return store code and location for all Giant Food stores within given zip/radius search parameters.
   * @param {string} zip - US zip code.  Center of store search.
   * @param {number} radius - Radius of store search in miles.
   * @returns {Promise<object>} - Contains store code and location of each store found in search.
   */
  storeData: async (zip, radius) => {
    let fetchParams;
    let fetchResult;

    fetchParams = {
      headers: {
        "accept-language": "en-GB,en;q=0.9,th-TH;q=0.8,th;q=0.7,en-US;q=0.6",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36",
      },
    };

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
        fetchParams,
        dataType: "json",
      }
    );

    if (fetchResult.status === 403) {
      console.log(
        "Fetching store data from Giant API failed. Fetching data from alternative source."
      );

      fetchParams = {};
      const geocodeUrl = `http://www.mapquestapi.com/geocoding/v1/address?key=SYVPumfPbXJiRSimr0Eu9jCJKCGifOgP&location=${zip}`;
      const geocodeResponse = await spFetch.spFetch(geocodeUrl, {
        fetchParams,
        dataType: "json",
      });
      if (!geocodeResponse?.results) return fetchResult;
      const zipCoords = geocodeResponse.results[0].locations[0].latLng;

      const myModel = await createModel.createModel("stores", [
        "storeNo",
        "address1",
        "city",
        "state",
        "zip",
      ]);

      const searchResults = await myModel.find({
        loc: {
          $geoWithin: {
            $centerSphere: [[zipCoords.lng, zipCoords.lat], radius / 3963.2],
          },
        },
      });
      fetchResult = {
        stores: searchResults.map((x) => {
          return {
            storeNo: x.storeNo,
            address1: x.address1,
            city: x.city,
            state: x.state,
            zip: x.zip,
          };
        }),
      };
    }

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
