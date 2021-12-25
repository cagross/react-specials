/**
 * Return the unit price for each item.
 *
 * @param {array} item
 */
// export function unitPrice(item) {
exports.unitPrice = function (item) {
  const priceText = item["price_text"] || "";
  const pos_lb = priceText.search("lb"); // Search the 'price text' of each item for 'lb.'

  let partial, weight, uprice;
  if (pos_lb >= 0) {
    // If 'lb' occurs in the 'price text' of an item, then its 'current price' is already its unit price, so set it accordingly.
    uprice = item["current_price"];
  } else {
    // If 'lb' does not occur in the 'price text' of an item, continue to determine the unit price using other methods.
    const patt_ea = /\/ea/;
    const has_ea = patt_ea.test(priceText); // Check if the string 'ea' exists in the 'price text.'
    // If 'ea' occurs in the 'price text,' or the 'price text' is blank, then assume the price is per package, and run the following code which searches through the item 'description' to determine the weight of the package.
    if (has_ea || priceText === "") {
      if (item["description"] != null) {
        let divisor = 1;
        // Calculate any additional divisor specified by item (e.g. '2 items for $3.00').  Set it to  the first number that is present before the final '/' in item["pre_price_text"].
        if (item["pre_price_text"]) {
          const pos_slash = item["pre_price_text"].lastIndexOf("/");
          partial = item["pre_price_text"].slice(0, pos_slash);
          divisor = partial.match(/\d+/g)[0];
        }

        const pos_oz = item["description"].search(/oz\./i); // Search for the string 'oz' in the item 'description.'  Return the index in the string.
        if (pos_oz >= 0) {
          // If the string 'oz' appears in the item 'description,' run the following code to extract the weight of the item, in pounds.
          partial = item["description"].substring(0, pos_oz);
          weight = partial.match(/[0-9]+/) / 16; // Total weight in pounds.
        }
        const pos_lb = item["description"].search(/lb\./i); // Search for the string 'lb' in the item 'description.'  Return the index in the string.
        if (pos_lb >= 0) {
          // If the string 'lb' appears in the item 'description,' run the following code to extract the weight of the item, in pounds.
          partial = item["description"].substring(0, pos_lb);
          weight = partial.match(/[0-9]+/); // Total weight in pounds.
        }
        uprice = item["current_price"] / weight / divisor; // Calculate the per pound unit price of the item, using the total price and weight in pounds.
      }
    }
  }
  return uprice;
};
