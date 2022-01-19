/**
 * @file
 * @module
 * @author Carl Gross
 */
import fetch from "node-fetch";

/**
 * node-fetch wrapper.
 * @async
 * @returns {any}
 */
export const spFetch = {
  spFetch: async (url, options) => {
    return await fetch(url, options);
  },
};
