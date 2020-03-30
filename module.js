import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import fetch from 'node-fetch';

// export function hello() {
// 	return "Hello from module.";
// }



export function hello() {

	// fetch('http://example.com/movies.json')
	// .then((response) => {
	// 	return response.json();
	// });
	
	

// var testVar = 123;

		/* Begin code to fetch all weekly special data from the Giant Food API. */
		// const proxyURL = "https://cors-anywhere.herokuapp.com/";
		const proxyURL = '';

		const urlAPIFlyer =
			"https://circular.giantfood.com/flyers/giantfood?type=2&show_shopping_list_integration=1&postal_code=22204&use_requested_domain=true&store_code=0774&is_store_selection=true&auto_flyer=&sort_by=#!/flyers/giantfood-weekly?flyer_run_id=406535"


		fetch(proxyURL + urlAPIFlyer) // e.g. https://cors-anywhere.herokuapp.com/https://example.com  Method to avoid/disable CORS errors in Chrome during local development.
		// return fetch(proxyURL + urlAPIFlyer) // e.g. https://cors-anywhere.herokuapp.com/https://example.com  Method to avoid/disable CORS errors in Chrome during local development.

		// .then(response => response.text())
		.then(flyerInfo => {
			// console.log(flyerInfo);
			console.log(555);
			return "Hello from module.";

		});


		// return "Hello from module.";


	// 	// Use this first fetch() to obtain just the flyer ID, which we will in-turn use with a second fetch() to obtain the actual weekly specials data.
	// 	fetch(proxyURL + urlAPIFlyer) // e.g. https://cors-anywhere.herokuapp.com/https://example.com  Method to avoid/disable CORS errors in Chrome during local development.
		
	// 	.then(response => response.text())
	// 	.then(flyerInfo => {
	// 		const posFlyerID = flyerInfo.search("current_flyer_id");
	// 		const flyerID = flyerInfo.slice(posFlyerID + 18, posFlyerID + 25);
	// 		const urlAPIData = "https://circular.giantfood.com/flyer_data/" + flyerID + "?locale=en-US";

	// 		fetch(proxyURL + urlAPIData)// This fetch() obtains an object containing all weekly specials data from the Giant Food store in-question.

	// 		.then(response => response.json())

	// 		.then(dataAll => {
	// 				// console.log(dataAll);
				
	// 				const dataItems = dataAll.items;// Filter all data into only data related to items.
	// 				var dataMeatItems;

	// 				const filter = 1;// Set this to 1 to filter data into only meat/deli items.  Set this to any other value to apply no filtering (i.e. display all items on page).
	// 				const dataMeatItemsKeys = productFilter(dataItems, filter);// This returns an array of the keys after the desired filter has been applied.
					
	// 				dataMeatItems = dataMeatItemsKeys.map(function (key) {// Create a new array containing only filtered items.  In addition, calculate and add a unit price property to the array.
			
	// 					let item = dataItems[key];

	// 					if (item['current_price'] === null) {//If an item has no price, set its price and unit price as unknown.
	// 						item['unit_price'] = 'unknown';
	// 						item['current_price'] = item['unit_price'];
	// 					} else {
	// 						unitPrice(item);//Calculate the unit price of the item and add it to the items array.
	// 					}

	// 					return item;
	// 				});
					

	// 				// console.log('fetched');
	// 				// test();
	// 				// return dataMeatItems;
	// 				// return "Hello from module.";

	// 		// 		setData(dataMeatItems);//Assign this array (the array containing all desired items and information) to the value of the 'data' variable.
	// 		})
	// 		.catch(() => console.log("Message from Carl's code:  can’t access " + urlAPIData + " response. Possibly blocked by browser."));
	// 		// let testVar = 555;
	// 		// return testVar;
	// 	});
	// 	/* End code to fetch API data. */

	// 	function test() {
	// 		console.log('testy');
	// 	}

	// // return "Hello from module.";
	// // return testy;

		
// Function to filter all data into items from specific departments, e.g. meat, deli, etc.
function productFilter(dataItems, filter) {
	let myArray;

	let dataMeatItems = Object.keys(dataItems).filter(key => {
		switch (filter) {
			case 1:
				myArray = ['Meat', 'Deli'];
				if (myArray.includes(dataItems[key]["category_names"][0])) {
					return true;
				}
				break;
			default:
				return true;
			}
	});
	return dataMeatItems;
}

// Function to calculate the unit price of an item, and insert it into the main product array.
function unitPrice(item) {
	/* Begin code to calculate unit price for each item and add it as a new element in the array. */
		const pos_lb = item['price_text'].search("lb");// Search the 'price text' of each item for 'lb.'

		if (pos_lb >= 0) {// If 'lb' occurs in the 'price text' of an item, then its 'current price' is already its unit price, so set it accordingly.
			item['unit_price'] = item['current_price'];
		} else {// If 'lb' does not occur in the 'price text' of an item, continue to determine the unit price using other methods.
			item['unit_price'] = 55.55;
			const patt_ea = /\/ea/;
			const has_ea = patt_ea.test(item['price_text']);// Check if the string 'ea' exists in the 'price text.'
			// If 'ea' occurs in the 'price text,' or the 'price text' is blank, then assume the price is per package, and run the following code which searches through the item 'description' to determine the weight of the package.
			if (has_ea || item['price_text'] === "") {

				if (item['description'] != null) {
					const pos_oz = item['description'].search(/oz\./i);// Search for the string 'oz' in the item 'description.'  Return the index in the string.

					if (pos_oz >= 0) {// If the string 'oz' appears in the item 'description,' run the following code to extract the weight of the item, in pounds.
						const partial_oz = item['description'].substring(0, pos_oz);
						const weight_oz = partial_oz.match(/[0-9]+/);
						item['unit_price'] = 16*item['current_price']/weight_oz;// Calculate the per pound unit price of the item, using the total price and weight in ounces.
					}
				}
			}
		}
	/* End code to calculate unit price for each item and add it as a new element in the array. */
}
	
	
	// return "Hello from module.";
	// return dataMeatItems;
	// console.log(dataMeatItems);


}