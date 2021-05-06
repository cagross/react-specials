/**
 * Return a string representing a number displaying two decimal places.
 *
 * @param {string} unform_price
 */
function formPrice(unform_price) {
  return Number(unform_price).toFixed(2);
}

/**
 * Return string representing the full price to display, with proper prefix (e.g. $) and suffix (e.g /lb).  Or set price to 'Unknown' if price is not known.
 *
 * @param {string | number} unform_price - The price of the item, as a string or number.
 * @param {string} price_suffix - The text suffix to display on the price, if any (e.g. /lb, each).
 */
export function dispPrice(unform_price, price_suffix) {
  let price, prefix, suffix;
  if (price_suffix === null || price_suffix === undefined) price_suffix = "";
  if (!unform_price || unform_price === "unknown") {
    prefix = "";
    price = "Unknown";
    suffix = "";
  } else {
    prefix = "$";
    price = formPrice(unform_price);
    suffix = price_suffix;
  }
  return prefix + price + suffix;
}
