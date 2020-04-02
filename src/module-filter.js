//Define all possible search terms here--terms which are indicative of a poultry, beef, or pork item.  These terms are requried to determine which meat category each items belongs.  This is very incomplete and inexact, as determining accurate and complete search terms is difficult.  Also, this data should eventually be moved to a database.

import { terms } from './module-terms.js';


// export function filter(meat) {
export function filter(props) {
	console.log(props);
	// Determine which terms should be used to filter products, baed on the user's selected meat.
	let list;
	//Define search terms.
	const searchTerms = terms();
	// console.log(meat);
	if (props.currMeat === "poultry") {
		list = searchTerms['poultry'];
	} else if (props.currMeat === "beef") {
		list = searchTerms['beef'];
	} else if(props.currMeat === "pork") {
		list = searchTerms['pork'];
	}



	const meatData = props.data;

	if (Object.entries(meatData).length) {// Check if the weekly specials array is empty or not.  If it is not empty, execute code.

		return Object.keys(meatData).map(function (key) {// Loop over every key in the weekly specials array and check if it contains any of the meat search terms.  If so, render a row of information to the page.

			/* Begin code to check if item name contains any search terms. */
			const itemName = meatData[key]["display_name"].toLowerCase();
				
			let match = false;
			if (props.currMeat === "") {
				match = true;
			} else {
				for (let i = 0; i < list.length; i++) {
					const pos = itemName.search(list[i]);
					if (pos >= 0) {
						match = true;
						break;
					}
				}
			}
			/* End code to check if item name contains any meat terms. */

			/* Begin code to render a row of item information to the page. */
			// if (match) {
			// 	return (

			// 		<CSSTransition //Ensure each row appears with a CSS fade transition.
			// 			in={true}
			// 			appear={true}
			// 			timeout={1300}
			// 			classNames="fade"
			// 			key={key}
			// 		>

			// 			<div className="row" >
			// 				<img className="row__thumb" alt={meatData[key]['name']} src={meatData[key]['x_large_image_url']}></img>
			// 				<div className="row__details">
			// 					<div className="row__name">
			// 						{meatData[key]['name']}
			// 					</div>
			// 					<div className="row__desc">
			// 						{meatData[key]['description']}
			// 					</div>

			// 					<div className="row__disc">
			// 						{meatData[key]['disclaimer_text']}
			// 					</div>
			// 					<div className="row__ss">
			// 						{meatData[key]['sale_story']}
			// 					</div>
			// 				</div>
			// 				<div className="row__dates">
			// 					<div className="row__storinfo">
			// 						<img className="row__storlogo" alt="Logo: Giant Food." src={logo_giant}></img>
			// 						{/* 15/7/19 The store name/address is hard coded for now.  Once more stores are added, this will be dynamic. */}
			// 						<div className="row__storaddress">
			// 							Giant Food<br />
			// 							2501 S. 9th Rd.<br />
			// 							Arlington, VA 22204
			// 						</div>
			// 					</div>
			// 					<div className="row__datetext">
			// 						<i>
			// 							<span className="row__dateprefix">
			// 								valid:
			// 							</span>
			// 							<time dateTime={meatData[key]['valid_from']}>{formDate(meatData[key]['valid_from'])}</time> - <time dateTime={meatData[key]['valid_to']}>{formDate(meatData[key]['valid_to'])}</time>

			// 						</i>
			// 					</div>
			// 				</div>
			// 				<span className="row__price">
			// 					${formPrice(meatData[key]['current_price'])}{meatData[key]['price_text']}
			// 				</span>
			// 				<span className="row__price">
			// 					${formPrice(meatData[key]['unit_price'])}/lb.
			// 				</span>
			// 			</div>
			// 		</CSSTransition>
			// 	);
			// }
			/* End code to render a row of item information to the page. */
		});
	}

	// return list;
}