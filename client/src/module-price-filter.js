/**
 * @file
 * @module
 * @author Carl Gross
 */

/**
 * Filter an array of items based on threshhold price.
 * @param {array} items
 * @param {number} thPrice
 * @returns
 */
export function priceFilter(items, thPrice) {
  return items.filter((item) => item.unit_price <= thPrice);
}
