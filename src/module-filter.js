import { terms } from './module-terms.js';

/**
 * Accepts an object of grocery store items from all categories, and returns a filtered array of items.
 * @param {object} props 
 */
export function filter(props) {
	const items = props.data;
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

	function matchTerm(value) {
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
 	const filtered = items.filter(matchTerm)
	return filtered;
}