/**
 * Return string representing the full price to display, with proper prefix (e.g. $) and suffix (e.g /lb).  Or set price to 'Unknown' if price is not known.
 *
 * @param {object} itemData
 * @param {boolean} isUnit - Flag indicating whether the displayed price is a unit price or not.
 * @returns {string}
 */
export function dispPrice(itemData, isUnit) {
  if (isUnit) {
    if (itemData.unit_price === null || isNaN(itemData.unit_price))
      return "Unknown";
    return "$" + Number(itemData.unit_price).toFixed(2) + "/lb";
  }
  return !itemData.current_price || itemData.current_price === "unknown"
    ? "Unknown"
    : `$${Number(itemData.current_price).toFixed(2)}${
        itemData.price_text ?? ""
      }`;
}
