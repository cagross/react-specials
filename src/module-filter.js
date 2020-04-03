//Define all possible search terms here--terms which are indicative of a poultry, beef, or pork item.  These terms are requried to determine which meat category each items belongs.  This is very incomplete and inexact, as determining accurate and complete search terms is difficult.  Also, this data should eventually be moved to a database.



import { terms } from './module-terms.js';




// const filterObject = (obj, filter, filterValue) => 
// Object.keys(obj).reduce((acc, val) => 
// (obj[val][filter] === filterValue ? {...acc,[val]: obj[val]} : acc 
// ), {});
















// export function filter(meat) {
export function filter(props) {
	// console.log(props);
	
	const meatData = props.data;
		const searchTerms = terms();
		let meatPref;
		// Determine which terms should be used to filter products, baed on the user's selected meat.
		if (props.currMeat === "poultry") {
			meatPref = searchTerms['poultry'];
		} else if (props.currMeat === "beef") {
			meatPref = searchTerms['beef'];
		} else if(props.currMeat === "pork") {
			meatPref = searchTerms['pork'];
		}
		if (Object.entries(meatData).length) {// Check if the weekly specials array is empty or not.  If it is not empty, execute code.
			const filterObject = (obj) => 
				Object.keys(obj).reduce(function (acc, val) {
					const itemName = obj[val]["display_name"].toLowerCase();
					console.log('name is: ' + itemName);
					let match = false;
					if (props.currMeat === "") {
						match = true;
					} else {
						for (let i = 0; i < meatPref.length; i++) {
							const pos = itemName.search(meatPref[i]);
							if (pos >= 0) {
								match = true;
								break;
							}
						}
					}
					if (match) {
						return {
							...acc,[val]: obj[val]
						};
					} else {
						return acc;
					}
				}
		  	);
			const test123 = filterObject(meatData);
			console.log(test123);
		
			Object.keys(meatData).map(function (key) {// Loop over every key in the weekly specials array and check if it contains any of the meat search terms.  If so, render a row of information to the page.
		 		/* Begin code to check if item name contains any search terms. */
				const itemName = meatData[key]["display_name"].toLowerCase();
				let match = false;
				if (props.currMeat === "") {
					match = true;
				} else {
					for (let i = 0; i < meatPref.length; i++) {
						const pos = itemName.search(meatPref[i]);
						if (pos >= 0) {
							match = true;
							console.log('type: ' + typeof meatData);
							break;
						}
					}
				}
				/* End code to check if item name contains any meat terms. */
			});
		}
		return meatData;
}