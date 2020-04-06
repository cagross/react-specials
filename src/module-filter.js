//Define all possible search terms here--terms which are indicative of a poultry, beef, or pork item.  These terms are requried to determine which meat category each items belongs.  This is very incomplete and inexact, as determining accurate and complete search terms is difficult.  Also, this data should eventually be moved to a database.
import { terms } from './module-terms.js';
export function filter(props) {

	const mdOriginal = props.data;
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

	function isBigEnough(value) {
		const itemName = value["display_name"].toLowerCase();
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
			return value;
		}
	}
 	let filtered = mdOriginal.filter(isBigEnough)
	// console.log(filtered);

	return filtered;
}