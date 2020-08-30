import test from 'tape'; // assign the tape library to the variable "test"
// import { loc } from "../src/module-store-location.js";
import { storeLoc } from "../src/module-store-location.js";
// import { unitPrice } from "../src/module-unit-price.js";
import { dispPrice } from '../src/module-display-price.js';

test("Store location must be an array of string values, corresponding to Loehmann's Plaza Giant Food location.", function (t) {
  const storeLocRes = [
    'Giant Food',
    '7235 Arlington Blvd',
    'Falls Church, VA 22042'
  ];
  t.deepEqual(storeLocRes, storeLoc); // make this test pass by completing the add function!
  t.end();
});




let i;
const testArr = [
  {
    "flyer_item_id": 511827658,
    "flyer_id": 3636218,
    "flyer_type_id": 6404,
    "merchant_id": 2520,
    "brand": "Perdue",
    "display_name": "Perdue Chicken Short Cuts",
    "name": "Perdue Chicken Short Cuts",
    "description": "Selected Varieties, 6–9 oz. pkg.",
    "current_price": "6.0",
    "pre_price_text": "2/",
    "price_text": "",
    "category_ids": [],
    "category_names": [
      "Meat"
    ],
    "sub_items_skus": [],
    "left": 4781.02,
    "bottom": -739.19,
    "right": 5030.12,
    "top": -483.1,
    "run_item_id": null,
    "discount_percent": null,
    "display_type": 1,
    "iframe_display_width": null,
    "iframe_display_height": null,
    "url": null,
    "in_store_only": false,
    "review": null,
    "video": false,
    "page_destination": null,
    "video_count": false,
    "video_url": null,
    "recipe": false,
    "recipe_title": null,
    "text_areas": [],
    "shopping_cart_urls": [],
    "large_image_url": "https://cdn.flippenterprise.net/page_items/198841955/1598647078/extra_large.jpg",
    "x_large_image_url": "https://cdn.flippenterprise.net/page_pdf_images/10554224/bcd9f6e0-e268-11ea-a7c9-0ec6e2beadde/x_large",
    "dist_coupon_image_url": "https://f.wishabi.net/page_items/198841955/1598647078/extra_large.jpg",
    "sku": null,
    "custom1": null,
    "custom2": null,
    "custom3": "4379071",
    "custom4": null,
    "custom5": null,
    "custom6": null,
    "valid_to": "2020-09-03",
    "valid_from": "2020-08-28",
    "disclaimer_text": null,
    "flyer_type_name_identifier": "weekly",
    "flyer_type_name": "Weekly Circular",
    "flyer_run_id": 544866,
    "sale_story": null,
    "unit_price": 16
  },
  {
    "flyer_item_id": 488324205,
    "flyer_id": 3414280,
    "flyer_type_id": 6404,
    "merchant_id": 2520,
    "brand": "Giant",
    "display_name": "Giant Smoked Bone-In Ham Butt or Shank",
    "name": "Giant Smoked Bone-In Ham Butt or Shank",
    "description": null,
    "current_price": "0.99",
    "pre_price_text": "",
    "price_text": "/lb.",
    "category_ids": [],
    "category_names": [
      "Deli"
    ],
    "left": 33.3,
    "bottom": -858.6,
    "right": 407,
    "top": -444.2,
    "run_item_id": 0,
    "discount_percent": null,
    "display_type": 1,
    "iframe_display_width": null,
    "iframe_display_height": null,
    "url": null,
    "in_store_only": false,
    "review": null,
    "video": false,
    "page_destination": null,
    "video_count": false,
    "video_url": null,
    "recipe": false,
    "recipe_title": null,
    "text_areas": [],
    "shopping_cart_urls": [],
    "large_image_url": "https://cdn.flippenterprise.net/page_items/189183788/1586301622/extra_large.jpg",
    "x_large_image_url": "https://cdn.flippenterprise.net/page_pdf_images/10030428/b7270f84-7464-11ea-91e0-0efae983d694/x_large",
    "dist_coupon_image_url": "https://f.wishabi.net/page_items/189183788/1586301622/extra_large.jpg",
    "sku": null,
    "custom1": null,
    "custom2": null,
    "custom3": "4232325",
    "custom4": null,
    "custom5": null,
    "custom6": null,
    "valid_to": "2020-04-12",
    "valid_from": "2020-04-10",
    "disclaimer_text": "LIMIT 2",
    "flyer_type_name_identifier": "weekly",
    "flyer_type_name": "Weekly Circular",
    "flyer_run_id": 544844,
    "sale_story": "3 DAYS ONLY!",
    "unit_price": "0.99"
  },
  {
    "flyer_item_id": 490258566,
    "flyer_id": 3430521,
    "flyer_type_id": 6404,
    "merchant_id": 2520,
    "brand": "Giant",
    "display_name": "Giant 80% Lean Ground Beef Patties",
    "name": "Giant 80% Lean Ground Beef Patties",
    "description": "Frozen, 20% Fat, 4 lb. pkg.",
    "current_price": "12.99",
    "pre_price_text": "",
    "price_text": "/ea.",
    "category_ids": [],
    "category_names": [
      "Deli"
    ],
    "left": 2340.94,
    "bottom": -767.921,
    "right": 2659.88,
    "top": -611.939,
    "run_item_id": 0,
    "discount_percent": null,
    "display_type": 1,
    "iframe_display_width": null,
    "iframe_display_height": null,
    "url": null,
    "in_store_only": false,
    "review": null,
    "video": false,
    "page_destination": null,
    "video_count": false,
    "video_url": null,
    "recipe": false,
    "recipe_title": null,
    "text_areas": [],
    "shopping_cart_urls": [],
    "large_image_url": "https://cdn.flippenterprise.net/page_items/190109000/1588092236/extra_large.jpg",
    "x_large_image_url": "https://cdn.flippenterprise.net/page_pdf_images/10082211/72601040-8417-11ea-bad4-0e1ba86a8db4/x_large",
    "dist_coupon_image_url": "https://f.wishabi.net/page_items/190109000/1588092236/extra_large.jpg",
    "sku": null,
    "custom1": null,
    "custom2": null,
    "custom3": "4251896",
    "custom4": null,
    "custom5": null,
    "custom6": null,
    "valid_to": "2020-05-07",
    "valid_from": "2020-05-01",
    "disclaimer_text": null,
    "flyer_type_name_identifier": "weekly",
    "flyer_type_name": "Weekly Circular",
    "flyer_run_id": 544847,
    "sale_story": null,
    "unit_price": "not set"
  },
  /* Begin list of objects with no price set (e.g. $1.00 off, buy one get one free, etc. */
  {
    "flyer_item_id": 508152233,
    "flyer_id": 3601356,
    "flyer_type_id": 6404,
    "merchant_id": 2520,
    "brand": "Phillips",
    "display_name": "Phillips Crab Meat",
    "name": "Phillips Crab Meat",
    "description": "8 oz. cont., Refrigerated",
    "current_price": "unknown",
    "pre_price_text": "",
    "price_text": "",
    "category_ids": [],
    "category_names": [
      "Meat"
    ],
    "left": 7677.26,
    "bottom": -1203.18,
    "right": 7842.56,
    "top": -1009.95,
    "run_item_id": 0,
    "discount_percent": null,
    "display_type": 1,
    "iframe_display_width": null,
    "iframe_display_height": null,
    "url": null,
    "in_store_only": false,
    "review": null,
    "video": false,
    "page_destination": null,
    "video_count": false,
    "video_url": null,
    "recipe": false,
    "recipe_title": null,
    "text_areas": [],
    "shopping_cart_urls": [],
    "large_image_url": "https://cdn.flippenterprise.net/page_items/197520474/1597347805/extra_large.jpg",
    "x_large_image_url": "https://cdn.flippenterprise.net/page_pdf_images/10485068/fda7ac9e-d6a6-11ea-9bfc-0e1ba86a8db4/x_large",
    "dist_coupon_image_url": "https://f.wishabi.net/page_items/197520474/1597347805/extra_large.jpg",
    "sku": null,
    "custom1": null,
    "custom2": null,
    "custom3": "4314526",
    "custom4": null,
    "custom5": null,
    "custom6": null,
    "valid_to": "2020-08-20",
    "valid_from": "2020-08-14",
    "disclaimer_text": null,
    "flyer_type_name_identifier": "weekly",
    "flyer_type_name": "Weekly Circular",
    "flyer_run_id": 544862,
    "sale_story": "$3.00 off",
    "unit_price": null
  },
  {
    "flyer_item_id": 508152288,
    "flyer_id": 3601356,
    "flyer_type_id": 6404,
    "merchant_id": 2520,
    "brand": "Sabra",
    "display_name": "Sabra Hummus",
    "name": "Sabra Hummus",
    "description": "All Varieties, 8–10 oz. pkg.",
    "current_price": null,
    "pre_price_text": "",
    "price_text": "",
    "category_ids": [],
    "category_names": [
      "Deli"
    ],
    "left": 6834.49,
    "bottom": -1943.51,
    "right": 7099.89,
    "top": -1447.63,
    "run_item_id": null,
    "discount_percent": null,
    "display_type": 1,
    "iframe_display_width": null,
    "iframe_display_height": null,
    "url": null,
    "in_store_only": false,
    "review": null,
    "video": false,
    "page_destination": null,
    "video_count": false,
    "video_url": null,
    "recipe": false,
    "recipe_title": null,
    "text_areas": [],
    "shopping_cart_urls": [],
    "large_image_url": "https://cdn.flippenterprise.net/page_items/197520475/1597347806/extra_large.jpg",
    "x_large_image_url": "https://cdn.flippenterprise.net/page_pdf_images/10485068/fe2bdb72-d6a6-11ea-9bfc-0e1ba86a8db4/x_large",
    "dist_coupon_image_url": "https://f.wishabi.net/page_items/197520475/1597347806/extra_large.jpg",
    "sku": null,
    "custom1": null,
    "custom2": null,
    "custom3": "4250888",
    "custom4": null,
    "custom5": null,
    "custom6": null,
    "valid_to": "2020-08-20",
    "valid_from": "2020-08-14",
    "disclaimer_text": null,
    "flyer_type_name_identifier": "weekly",
    "flyer_type_name": "Weekly Circular",
    "flyer_run_id": 544862,
    "sale_story": "BUY 2, GET 1 FREE OF EQUAL OR LESSER VALUE",
    "unit_price": 0
  },
  {
    "flyer_item_id": 511827763,
    "flyer_id": 3636218,
    "flyer_type_id": 6404,
    "merchant_id": 2520,
    "brand": "Lloyd's",
    "display_name": "Lloyd's BBQ Shredded Chicken or Pork",
    "name": "Lloyd's BBQ Shredded Chicken or Pork",
    "description": "Selected Varieties, 16 oz. pkg.",
    "current_price": "unknown",
    "pre_price_text": "",
    "price_text": "",
    "category_ids": [],
    "category_names": [
      "Meat"
    ],
    "sub_items_skus": [],
    "left": 5030.12,
    "bottom": -739.19,
    "right": 5279.23,
    "top": -483.1,
    "run_item_id": null,
    "discount_percent": null,
    "display_type": 1,
    "iframe_display_width": null,
    "iframe_display_height": null,
    "url": null,
    "in_store_only": false,
    "review": null,
    "video": false,
    "page_destination": null,
    "video_count": false,
    "video_url": null,
    "recipe": false,
    "recipe_title": null,
    "text_areas": [],
    "shopping_cart_urls": [],
    "large_image_url": "https://cdn.flippenterprise.net/page_items/198841957/1598647080/extra_large.jpg",
    "x_large_image_url": "https://cdn.flippenterprise.net/page_pdf_images/10554224/4521ea88-e63f-11ea-86da-0ec6e2beadde/x_large",
    "dist_coupon_image_url": "https://f.wishabi.net/page_items/198841957/1598647080/extra_large.jpg",
    "sku": null,
    "custom1": null,
    "custom2": null,
    "custom3": "4377904",
    "custom4": null,
    "custom5": null,
    "custom6": null,
    "valid_to": "2020-09-03",
    "valid_from": "2020-08-28",
    "disclaimer_text": null,
    "flyer_type_name_identifier": "weekly",
    "flyer_type_name": "Weekly Circular",
    "flyer_run_id": 544866,
    "sale_story": "BUY 1, GET 1, FREE OF EQUAL OR LESSER VALUE",
    "unit_price": "unknown"
  },
  {
    "flyer_item_id": 511828124,
    "flyer_id": 3636218,
    "flyer_type_id": 6404,
    "merchant_id": 2520,
    "brand": "Chicken of the Sea",
    "display_name": "Chicken of the Sea Crab Meat",
    "name": "Chicken of the Sea Crab Meat",
    "description": "16 oz. cont., Refrigerated",
    "current_price": "unknown",
    "pre_price_text": "",
    "price_text": "",
    "category_ids": [],
    "category_names": [
      "Meat"
    ],
    "sub_items_skus": [],
    "left": 5118.59,
    "bottom": -1215.7,
    "right": 5283.88,
    "top": -996.864,
    "run_item_id": null,
    "discount_percent": null,
    "display_type": 1,
    "iframe_display_width": null,
    "iframe_display_height": null,
    "url": null,
    "in_store_only": false,
    "review": null,
    "video": false,
    "page_destination": null,
    "video_count": false,
    "video_url": null,
    "recipe": false,
    "recipe_title": null,
    "text_areas": [],
    "shopping_cart_urls": [],
    "large_image_url": "https://cdn.flippenterprise.net/page_items/198841964/1598647086/extra_large.jpg",
    "x_large_image_url": "https://cdn.flippenterprise.net/page_pdf_images/10554224/463398c2-e63f-11ea-86da-0ec6e2beadde/x_large",
    "dist_coupon_image_url": "https://f.wishabi.net/page_items/198841964/1598647086/extra_large.jpg",
    "sku": null,
    "custom1": null,
    "custom2": null,
    "custom3": "4193654",
    "custom4": null,
    "custom5": null,
    "custom6": null,
    "valid_to": "2020-09-03",
    "valid_from": "2020-08-28",
    "disclaimer_text": null,
    "flyer_type_name_identifier": "weekly",
    "flyer_type_name": "Weekly Circular",
    "flyer_run_id": 544866,
    "sale_story": "$2.00 off",
    "unit_price": "unknown"
  },

  {
    "flyer_item_id": 511829750,
    "flyer_id": 3636218,
    "flyer_type_id": 6404,
    "merchant_id": 2520,
    "brand": null,
    "display_name": "Jimmy Dean Breakfast Sandwiches, Hash Browns, Frittatas or Delights",
    "name": "Jimmy Dean Breakfast Sandwiches, Hash Browns, Frittatas or Delights",
    "description": "Frozen, Selected Varieties, 12–20.4 oz. pkg.",
    "current_price": "unknown",
    "pre_price_text": "",
    "price_text": "",
    "category_ids": [],
    "category_names": [
      "Deli"
    ],
    "sub_items_skus": [],
    "left": 5824,
    "bottom": -989.341,
    "right": 6075.25,
    "top": -725.689,
    "run_item_id": null,
    "discount_percent": null,
    "display_type": 1,
    "iframe_display_width": null,
    "iframe_display_height": null,
    "url": null,
    "in_store_only": false,
    "review": null,
    "video": false,
    "page_destination": null,
    "video_count": false,
    "video_url": null,
    "recipe": false,
    "recipe_title": null,
    "text_areas": [],
    "shopping_cart_urls": [],
    "large_image_url": "https://cdn.flippenterprise.net/page_items/198841596/1598647075/extra_large.jpg",
    "x_large_image_url": "https://cdn.flippenterprise.net/page_pdf_images/10554226/b30035f8-e268-11ea-9722-0efae983d694/x_large",
    "dist_coupon_image_url": "https://f.wishabi.net/page_items/198841596/1598647075/extra_large.jpg",
    "sku": null,
    "custom1": null,
    "custom2": null,
    "custom3": "4392121",
    "custom4": null,
    "custom5": null,
    "custom6": null,
    "valid_to": "2020-09-03",
    "valid_from": "2020-08-28",
    "disclaimer_text": null,
    "flyer_type_name_identifier": "weekly",
    "flyer_type_name": "Weekly Circular",
    "flyer_run_id": 544866,
    "sale_story": "$1.00 off",
    "unit_price": "unknown"
  }
  /* End list of objects with no price set (e.g. $1.00 off, buy one get one free, etc. */
]







test("Test of display price.", function (t) {
  let displayedPrice;
  for (i = 0; i < testArr.length; i++) {
    displayedPrice = dispPrice(testArr[i]['current_price'], testArr[i]['price_text']);
    if (!testArr[i]['current_price'] || testArr[i]['current_price'] === 'unknown') {
      // console.log(testArr[i]['current_price']);
      t.deepEqual('Unknown', displayedPrice);
    } else {
      console.log(testArr[i]['current_price']);

      t.deepEqual('string', typeof (displayedPrice));
      // t.deepEqual('$', displayedPrice.slice(0, 1));
      // t.deepEqual('$', displayedPrice.slice(0, 1));
      // t.match(displayedPrice, regexp, 'Displayed price is not correct format.')

    }
  }

  // displayedPrice = dispPrice(testArr[2]['current_price'], testArr[2]['price_text']);
  // if (!testArr[2]['current_price'] || testArr[2]['current_price'] === 'unknown') {
  //   t.deepEqual('Unknown', displayedPrice);
  // }
  // if (unitPrice(testItem) > 0) {
  //   unitPriceRes = true;
  // }

  // t.deepEqual(true, unitPriceRes);
  t.end();
});







// import test from 'tape'; // assign the tape library to the variable "test"
// // import { loc } from "../src/module-store-location.js";
// import { storeLoc } from "../src/module-store-location.js";
// import { unitPrice } from "../src/module-unit-price.js";

// let i;
// let testArr = [];
// let unitPriceRes;


// test("Store location must be an array of string values, corresponding to Loehmann's Plaza Giant Food location.", function (t) {
//   const storeLocRes = [
//     'Giant Food',
//     '7235 Arlington Blvd',
//     'Falls Church, VA 22042'
//   ];
//   t.deepEqual(storeLocRes, storeLoc); // make this test pass by completing the add function!
//   t.end();
// });

// test("Test of unit price.", function (t) {

//   // let unitPriceRes;
//   for (i = 0; i < testArr.length; i++) {
//     unitPriceRes = false;
//     // if (typeof (unitPrice(testArr[i])) === 'number' && unitPrice(testArr[i]) > 0) {
//     if (unitPrice(testArr[i]) > 0) {
//       unitPriceRes = true;
//     }
//     t.deepEqual(true, unitPriceRes); // make this test pass by completing the add function!
//   }
//   t.end();
// });

// test("Test of unknown unit price.", function (t) {

//   for (i = 0; i < testArr.length; i++) {
//     unitPriceRes = false;
//     // if (typeof (unitPrice(testArr[i])) === 'number' && unitPrice(testArr[i]) > 0) {
//     // if (unitPrice(testArr[i]) > 0) {
//     // if (typeof (unitPrice(testArr[i]) === 'string') && unitPrice(testArr[i]) > 0) {
//     console.log(i);
//     console.log(unitPrice(testArr[i]));
//     console.log(typeof (unitPrice(testArr[i])));

//     // if (typeof (unitPrice(testArr[i])) === 'number') {
//     if (typeof (unitPrice(testArr[i])) === 'string') {



//       unitPriceRes = true;
//     }
//     t.deepEqual(true, unitPriceRes); // make this test pass by completing the add function!
//   }
//   t.end();
// });





