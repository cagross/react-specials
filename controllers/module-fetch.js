/**
 * @file
 * @module
 * @author Carl Gross
 */
import fetch from "node-fetch";

export const spFetch = {
  /**
   * node-fetch wrapper.
   * @async
   * @param {*} url
   * @param {*} options
   * @param {string} options.fetchParams - Fetch parameters.
   * @returns
   */
  spFetch: async (url, options) => {
    // if (options.dataType === "text")
    return fetch(url, options.fetchParams)
      .then((result) => {
        if (options.dataType === "text") return result.text();
        if (options.dataType === "json") {
          if (result.status === 204) return { error: 204 }; //Cases in which invalid zip codes are supplied will return result.status 204 and myRes will be undefined.
          return result.json();
        }
        return;
      })
      .catch((err) => {
        console.log("Error fetching.");
        console.log(err);
        return err;
      });
  },
};
