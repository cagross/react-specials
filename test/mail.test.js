import test from 'tape'; // assign the tape library to the variable "test"
// import { loc } from "../src/module-store-location.js";
import { storeLoc } from "../src/module-store-location.js";
import { unitPrice } from "../src/module-unit-price.js";

test("Store location must be an array of string values, corresponding to Loehmann's Plaza Giant Food location.", function (t) {
  const storeLocRes = [
    'Giant Food',
    '7235 Arlington Blvd',
    'Falls Church, VA 22042'
  ];
  t.deepEqual(storeLocRes, storeLoc); // make this test pass by completing the add function!
  t.end();
});

// test("Test of unit price.", function (t) {
// 	const testItem = {
// 		"flyer_item_id": 488324205,
// 		"flyer_id": 3414280,
// 		"flyer_type_id": 6404,
// 		"merchant_id": 2520,
// 		"brand": "Giant",
// 		"display_name": "Giant Smoked Bone-In Ham Butt or Shank",
// 		"name": "Giant Smoked Bone-In Ham Butt or Shank",
// 		"description": null,
// 		"current_price": "0.99",
// 		"pre_price_text": "",
// 		"price_text": "/lb.",
// 		"category_ids": [],
// 		"category_names": [
// 		  "Deli"
// 		],
// 		"left": 33.3,
// 		"bottom": -858.6,
// 		"right": 407,
// 		"top": -444.2,
// 		"run_item_id": 0,
// 		"discount_percent": null,
// 		"display_type": 1,
// 		"iframe_display_width": null,
// 		"iframe_display_height": null,
// 		"url": null,
// 		"in_store_only": false,
// 		"review": null,
// 		"video": false,
// 		"page_destination": null,
// 		"video_count": false,
// 		"video_url": null,
// 		"recipe": false,
// 		"recipe_title": null,
// 		"text_areas": [],
// 		"shopping_cart_urls": [],
// 		"large_image_url": "https://cdn.flippenterprise.net/page_items/189183788/1586301622/extra_large.jpg",
// 		"x_large_image_url": "https://cdn.flippenterprise.net/page_pdf_images/10030428/b7270f84-7464-11ea-91e0-0efae983d694/x_large",
// 		"dist_coupon_image_url": "https://f.wishabi.net/page_items/189183788/1586301622/extra_large.jpg",
// 		"sku": null,
// 		"custom1": null,
// 		"custom2": null,
// 		"custom3": "4232325",
// 		"custom4": null,
// 		"custom5": null,
// 		"custom6": null,
// 		"valid_to": "2020-04-12",
// 		"valid_from": "2020-04-10",
// 		"disclaimer_text": "LIMIT 2",
// 		"flyer_type_name_identifier": "weekly",
// 		"flyer_type_name": "Weekly Circular",
// 		"flyer_run_id": 544844,
// 		"sale_story": "3 DAYS ONLY!",
// 		"unit_price": "0.99"
// 	};
// 	// console.log(testItem);
// 	// console.log(unitPrice(testItem));
// 	let unitPriceRes;
// 	if (unitPrice(testItem) > 0) {
// 		unitPriceRes = true;
// 	  }

// 	t.deepEqual(true, unitPriceRes); // make this test pass by completing the add function!
// 	t.end();
// });