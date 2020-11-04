/**
 * Return the unit price for each item.
 * 
 * @param {array} item 
 */
export function unitPrice(item) {
  const pos_lb = item['price_text'].search("lb");// Search the 'price text' of each item for 'lb.'
  let uprice;
  if (pos_lb >= 0) {// If 'lb' occurs in the 'price text' of an item, then its 'current price' is already its unit price, so set it accordingly.
    uprice = item['current_price'];
  } else {// If 'lb' does not occur in the 'price text' of an item, continue to determine the unit price using other methods.
    const patt_ea = /\/ea/;
    const has_ea = patt_ea.test(item['price_text']);// Check if the string 'ea' exists in the 'price text.'
    // If 'ea' occurs in the 'price text,' or the 'price text' is blank, then assume the price is per package, and run the following code which searches through the item 'description' to determine the weight of the package.
    if (has_ea || item['price_text'] === "") {

      if (item['description'] != null) {
        const pos_oz = item['description'].search(/oz\./i);// Search for the string 'oz' in the item 'description.'  Return the index in the string.

        if (pos_oz >= 0) {// If the string 'oz' appears in the item 'description,' run the following code to extract the weight of the item, in pounds.
          const partial_oz = item['description'].substring(0, pos_oz);
          const weight_oz = partial_oz.match(/[0-9]+/);
          uprice = 16 * item['current_price'] / weight_oz;// Calculate the per pound unit price of the item, using the total price and weight in ounces.
         }
      }
    }
  }
  return uprice;
 }