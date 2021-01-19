import fetch from 'node-fetch';
import { unitPrice } from "../src/module-unit-price.js";

export function apiData() {

		/* Begin code to fetch all weekly special data from the Giant Food API. */

		// If this module is being called by the front-end app, it will need to have a valid proxy URL set.  Without it, fetching data will fail (at least it will in Chrome).  See the project's README file for more information on setting up a valid proxy URL.
    let proxyURL = ''
    if (typeof window !== 'undefined') {
      console.log(555);
      console.log(window.location.href);
      if (window.location.href) {// If an environmental variable named CORS_PROXYURL exists, 
        console.log(666);
        console.log(window.location.href);
        if (window.location.href === 'http://localhost:3000/') {// If an environmental variable named CORS_PROXYURL exists, set its value as the proxy URL.
          proxyURL = ''
          console.log(777);
          console.log(proxyURL);
          console.log("Ensure you have a valid CORS proxy solution. See project's README file.");
        } else {
          console.log(888);
          proxyURL = 'https://sheltered-lake-52088.herokuapp.com/';// This proxy URL is valid only for the Specials app deployed to https://gentle-gorge-04163.herokuapp.com/.  If your app is deployed locally
        }
      }
    }
    console.log(999);
    console.log(proxyURL);
    		
// Check if the back-end app is in use by checking for the window object.  If it does not exist, then the module is being called by the back-end app, and the proxy URL does not need to be set.
		if (typeof window === 'undefined') {
			proxyURL = '';
		}
		
		const urlAPIFlyer =
			// "https://circular.giantfood.com/flyers/giantfood?type=2&show_shopping_list_integration=1&postal_code=22204&use_requested_domain=true&store_code=0774&is_store_selection=true&auto_flyer=&sort_by=#!/flyers/giantfood-weekly?flyer_run_id=406535";
			"https://circular.giantfood.com/flyers/giantfood?type=2&show_shopping_list_integration=1&postal_code=22204&use_requested_domain=true&store_code=0233&is_store_selection=true&auto_flyer=&sort_by=#!/flyers/giantfood-weekly?flyer_run_id=406535";

			return fetch(proxyURL + urlAPIFlyer) // e.g. https://cors-anywhere.herokuapp.com/https://example.com  Method to avoid/disable CORS errors in Chrome during local development.
			.then(response => response.text())
			// .then(response => response.json())
			.then(flyerInfo => {
				const posFlyerID = flyerInfo.search("current_flyer_id");
				const flyerID = flyerInfo.slice(posFlyerID + 18, posFlyerID + 25);
				const urlAPIData = "https://circular.giantfood.com/flyer_data/" + flyerID + "?locale=en-US";
				fetch(proxyURL + urlAPIData)// This fetch() obtains an object containing all weekly specials data from the Giant Food store in-question.
				return fetch(proxyURL + urlAPIData)// This fetch() obtains an object containing all weekly specials data from the Giant Food store in-question.

				.then(response => response.json())
				.then(dataAll => {
					// console.log(dataAll);
					// return 555;
					// console.log('testy');
					const dataItems = dataAll.items;// Filter all data into only data related to items.
					var dataMeatItems;

					const filter = 1;// Set this to 1 to filter data into only meat/deli items.  Set this to any other value to apply no filtering (i.e. display all items on page).
					const dataMeatItemsKeys = productFilter(dataItems, filter);// This returns an array of the keys after the desired filter has been applied.
					
					// dataMeatItems = dataMeatItemsKeys.map(function (key) {// Create a new array containing only filtered items.  In addition, calculate and add a unit price property to the array.
					return dataMeatItems = dataMeatItemsKeys.map(function (key) {// Create a new array containing only filtered items.  In addition, calculate and add a unit price property to the array.
			
						let item = dataItems[key];
						// console.log(item);

						if (item['current_price'] === null) {//If an item has no price, set its price and unit price as unknown.
							item['unit_price'] = 'unknown';
							item['current_price'] = item['unit_price'];
						} else {
							// unitPrice(item);//Calculate the unit price of the item and add it to the items array.
							item['unit_price'] = unitPrice(item);//Calculate the unit price of the item and add it to the items array.

						}

						return item;
					});
				})
			});
}
		
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