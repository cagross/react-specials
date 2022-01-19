/**
 * Module to filter items based on user preference.
 * @file
 * @module
 * @author Carl Gross
 */

import { terms } from "./module-terms.js";

/**
 * Accepts an object representing an item. Then checks if it matches any of the user's meat preferences. If so, return the object.
 * @param {object} item - Object representing a single item in the circular.
 * @returns {string|undefined}
 */
function matchTerm(item, keywords) {
  const itemName = item["display_name"].toLowerCase();
  for (let i = 0; i < keywords.length; i++) {
    const pos = itemName.search(keywords[i]);
    if (pos >= 0) {
      return item;
    }
  }
}

/**
 * Accepts an object of grocery store items from all categories, and returns an array of items filtered by keyword.
 * @param {object} circularInfo
 * @returns {array}
 */
export function filter(circularInfo) {
  const items = circularInfo.data;
  const searchTerms = terms();
  let keywords;

  // Determine which terms should be used to filter products, baed on the user's selected meat.
  if (circularInfo.currMeat === "poultry") {
    keywords = searchTerms["poultry"];
  } else if (circularInfo.currMeat === "beef") {
    keywords = searchTerms["beef"];
  } else if (circularInfo.currMeat === "pork") {
    keywords = searchTerms["pork"];
  }

  return items.filter((item) => {
    return circularInfo.currMeat === "all" || circularInfo.currMeat === ""
      ? true
      : matchTerm(item, keywords);
  });
}
