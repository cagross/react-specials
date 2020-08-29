// Function to format price.
function formPrice(unform_price) {
  return Number(unform_price).toFixed(2);
}

// Assemble full price, with proper prefix/suffix.  Or set price to 'Unkown' if it is not known.
export function dispPrice(unform_price, price_suffix) {
  let price, prefix, suffix;
  if (!unform_price || unform_price === 'unknown') {
    prefix = '';
    price = 'Unknown';
    suffix = '';
  } else {
    prefix = '$';
    price = formPrice(unform_price);
    suffix = price_suffix;
  }
  return prefix + price + suffix;
}