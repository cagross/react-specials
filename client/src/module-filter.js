/**
 * Module responsible for filtering circular items based on user meat preference.
 * @file
 * @module
 * @author Carl Gross
 */

import { terms } from "./module-terms.js";

/**
 * Accepts an object representing a circular item. Then checks if it matches any of the user's meat preferences. If so, return the object.
 * @param {object} item - Represents a single circular item.
 * @param {array} keywords - Contains keywords to search for in item text(s).
 * @returns {string|undefined}
 */
function matchTerm(item, keywords) {
  const itemName = item["display_name"].toLowerCase();
  for (let i = 0; i < keywords.length; i++) {
    const pos = itemName.search(keywords[i]);
    if (pos >= 0) return item;
  }
}

/**
 * Accepts an object of grocery store circular items from all categories, and a meat preference, and returns an array of items filtered by meat preference.
 * @param {string} meat - Meat preference to use during filter.
 * @param {array} circularItems - Contains all circular items.
 * @returns {array}
 */
export function filter(meat, circularItems) {
  console.log("Begin circular filtering.");
  if (!meat || meat === "all") return circularItems;
  const searchTerms = terms();
  let keywords;

  // Determine which terms should be used to filter products, baed on the user's selected meat.
  if (meat === "poultry") keywords = searchTerms["poultry"];
  if (meat === "beef") keywords = searchTerms["beef"];
  if (meat === "pork") keywords = searchTerms["pork"];

  return circularItems.filter((item) => {
    return matchTerm(item, keywords);
  });
}
