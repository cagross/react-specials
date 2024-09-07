/**
 * @file
 * @module
 * @author Carl Gross
 */

export const spFetch = {
  /**
   * Native fetch wrapper.
   * @async
   * @param {*} url
   * @param {*} options
   * @param {string} options.fetchParams - Fetch parameters.
   * @returns
   */
  spFetch: async (url, options) => {
    return fetch(url, options.fetchParams)
      .then((result) => {
        if (result.status === 403) return { status: 403 }; // Cases in which Giant Food API rejects request due to originating from outside the US will result in fetch returning result.status 403.
        if (options.dataType === "text") return result.text();
        if (options.dataType === "json") return result.json();

        return;
      })
      .catch((err) => {
        console.log("Error fetching.");
        console.log(err);
        return err;
      });
  },
};
