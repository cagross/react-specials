//App.js fetches grocery meat specials from an API, and renders them onto the page using ReactJS.

import React from 'react';

import {CSSTransition} from 'react-transition-group'// Required only for CSS transitions.
// import './animate.css';// Needed to for the specific CSS transition I'm using ('fade' in this case).

import './App.css';// Import the main CSS file.

import { useState } from 'react';// This needs to be present in order to use the 'useState' hook.
import { useEffect } from 'react';// This needs to be present in order to use the 'useEffect' hook.

// Import my images.
import img_meat from './images/all-meat-250.jpg';
import img_beef from './images/beef-250.jpg';
import img_chicken from './images/chicken-250.jpg';
import img_ribs from './images/ribs-250.jpg';
import logo_giant from './images/logo-Giant-50.png';

import PropTypes from 'prop-types';// Required to add data type validation on props.

// Function to format price.
function formPrice(unform_price) {
	return Number(unform_price).toFixed(2);
}

// Function to format date.
function formDate(unform_date) {
	return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(unform_date));
}

function Results(props) {// Filter the list of specials based on the user's meat selection, and render that list onto the page.

	function meatList() {// Filter the list of specials based on the user's meat selection and render it into a list.

		const meatData = props.data;
		let meatTerms;

		//Define all possible search terms here--terms which are indicative of a poultry, beef, or pork item.  These terms are requried to determine which meat category each items belongs.  This is very incomplete and inexact, as determining accurate and complete search terms is difficult.  Also, this data should eventually be moved to a database.
		const searchTerms = {
			poultry: [
				"chicken",
				"roaster",
				"turkey",
				"duck",
				"hen",
				"goose",
				"turducken"
			],
			beef: [
				"beef",
				"steak",
				"round",
				"chuck",
				"rump",
				"mignon",
				"frank",
				// "bologna",
				// "lunch meat",
				"veal",
				// "ground",
				"roast",
				"porterhouse",
				"90 % lean"
			],
			pork: [
				"butt",
				"ham",
				"bacon",
				// "rib",
				"sausage",
				"pork"
			]
		}

		// Determine which terms should be used to filter products, baed on the user's selected meat.
		if (props.currMeat === "poultry") {
			meatTerms = searchTerms['poultry'];
		} else if (props.currMeat === "beef") {
			meatTerms = searchTerms['beef'];
		} else if(props.currMeat === "pork") {
			meatTerms = searchTerms['pork'];
		}

		if (Object.entries(meatData).length) {// Check if the weekly specials array is empty or not.  If it is not empty, execute code.

			return Object.keys(meatData).map(function (key) {// Loop over every key in the weekly specials array and check if it contains any of the meat search terms.  If so, render a row of information to the page.

				/* Begin code to check if item name contains any search terms. */
				const itemName = meatData[key]["display_name"].toLowerCase();
					
				let match = false;
				if (props.currMeat === "") {
					match = true;
				} else {
					for (let i = 0; i < meatTerms.length; i++) {
						const pos = itemName.search(meatTerms[i]);
						if (pos >= 0) {
							match = true;
							break;
						}
					}
				}
				/* End code to check if item name contains any meat terms. */

				/* Begin code to render a row of item information to the page. */
				if (match) {
					return (

						<CSSTransition //Ensure each row appears with a CSS fade transition.
							in={true}
							appear={true}
							timeout={1300}
							classNames="fade"
							key={key}
						>

							<div className="item_row" >
								<img className="item_thumb" alt={meatData[key]['name']} src={meatData[key]['x_large_image_url']}></img>
								<div className="item_details">
									<div className="item_name">
										{meatData[key]['name']}
									</div>
									<div className="item_desc">
										{meatData[key]['description']}
									</div>

									<div className="item_disc">
										{meatData[key]['disclaimer_text']}
									</div>
									<div className="item_ss">
										{meatData[key]['sale_story']}
									</div>
								</div>
								<div className="item_dates">
									<div className="store_info">
										<img className="store_logo" alt="Logo: Giant Food." src={logo_giant}></img>
										{/* 15/7/19 The store name/address is hard coded for now.  Once more stores are added, this will be dynamic. */}
										<div className="store_address">
											Giant Food<br />
											2501 S. 9th Rd.<br />
											Arlington, VA 22204
										</div>
									</div>
									<div className="item_dates_text">
										<i>
											<span className="item_dates_prefix">
												valid:
											</span>
											<time dateTime={meatData[key]['valid_from']}>{formDate(meatData[key]['valid_from'])}</time> - <time dateTime={meatData[key]['valid_to']}>{formDate(meatData[key]['valid_to'])}</time>

										</i>
									</div>
								</div>
								<span className="item_price">
									${formPrice(meatData[key]['current_price'])}{meatData[key]['price_text']}
								</span>
								<span className="item_price">
									${formPrice(meatData[key]['unit_price'])}/lb.
								</span>
							</div>
						</CSSTransition>
					);
				}
				/* End code to render a row of item information to the page. */
			});
		}
	}
	console.log("meat changed to " + props.currMeat);
	return (
		<div>
			{meatList()}
		</div>
	);
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

// Ensure each prop has its type defined.  With these types defined, if code tries to pass a prop with a different type, a JS console error will occur.
Results.propTypes = {
	currMeat: PropTypes.string,
	data: PropTypes.array,
  };

// App() is the top level functional component.  It ensures data is fetched from the API on initial page render.  It also renders all content on the page, and defines the onClick functionality for the radio buttons.
function App() {

	/* Use the 'useState' hook to set initial state. */
	const [data, setData] = useState([]);// Set a piece of state named 'data' to an empty object.  To update that piece of state, run the 'setData()' function.
	const [currentMeat, setMeat] = useState('');// Set a piece of state named 'currentMeat' to an empty string.  To update that piece of state, run the 'setMeat()' function.

	/* Execute the 'useEffect' hook to fetch the API data.  Pass a second parameter to useEffect()--a blank array--to ensure this is executed only once (on initial page load ). */
	useEffect(() => {
	
		/* Begin code to fetch all weekly special data from the Giant Food API. */
		const proxyURL = "https://cors-anywhere.herokuapp.com/";
		const urlAPIFlyer =
			"https://circular.giantfood.com/flyers/giantfood?type=2&show_shopping_list_integration=1&postal_code=22204&use_requested_domain=true&store_code=0774&is_store_selection=true&auto_flyer=&sort_by=#!/flyers/giantfood-weekly?flyer_run_id=406535"

		// Use this first fetch() to obtain just the flyer ID, which we will in-turn use with a second fetch() to obtain the actual weekly specials data.
		fetch(proxyURL + urlAPIFlyer) // e.g. https://cors-anywhere.herokuapp.com/https://example.com  Method to avoid/disable CORS errors in Chrome during local development.
		
		.then(response => response.text())

		.then(flyerInfo => {

			const posFlyerID = flyerInfo.search("current_flyer_id");
			const flyerID = flyerInfo.slice(posFlyerID + 18, posFlyerID + 25);
			const urlAPIData = "https://circular.giantfood.com/flyer_data/" + flyerID + "?locale=en-US";

			fetch(proxyURL + urlAPIData)// This fetch() obtains an object containing all weekly specials data from the Giant Food store in-question.

			.then(response => response.json())

			.then(dataAll => {
			
				const dataItems = dataAll.items;// Filter all data into only data related to items.
				var dataMeatItems;

				const filter = 1;// Set this to 1 to filter data into only meat/deli items.  Set this to any other value to apply no filtering (i.e. display all items on page).
				const dataMeatItemsKeys = productFilter(dataItems, filter);// This returns an array of the keys after the desired filter has been applied.

				dataMeatItems = dataMeatItemsKeys.map(function (key) {// Create a new array containing only filtered items.  In addition, calculate and add a unit price property to the array.
		
					let item = dataItems[key];

					if (item['current_price'] === null) {//If an item has no price, set its price and unit price as unknown.
						item['unit_price'] = 'unknown';
						item['current_price'] = item['unit_price'];
					} else {
						unitPrice(item);//Calculate the unit price of the item and add it to the items array.
					}

					return item;
				});

				setData(dataMeatItems);//Assign this array (the array containing all desired items and information) to the value of the 'data' variable.
			})
		.catch(() => console.log("Message from Carl's code:  can’t access " + urlAPIData + " response. Possibly blocked by browser."));
		});
		/* End code to fetch API data. */

	}, []);

	/* Function to ensure the 'meat' piece of state is updated every time the drop-down menu changes, as well as handle the functionality of the radio buttons.*/
	function handleInput(event) {
		setMeat(event.target.value);

		// Add necessary CSS classes to radio button elements, ensuring their animations function as expected.
		const radButtons = document.getElementsByTagName("input") 
		for (let i = 0; i < radButtons.length; i++) {
			if (radButtons[i].value === event.target.value) {
				radButtons[i].className = "radio animated heartBeat";	
			} else {
				radButtons[i].className = "radio";	
			}
		}
	}

	return (
		<div id="content">
			{/* Add the radio button filter. */}
			<section className="filter">
					<label className="rad-lab" htmlFor="allmeat">
						<img className="rad-lab-img" alt = "" src={img_meat}></img>
						<input type="radio" id="allmeat" name="meaty" value="" className="radio" onChange={handleInput} defaultChecked/>
						All Meat
					</label>
					<label className="rad-lab" htmlFor="beef">
						<img className="rad-lab-img" alt = "" src={img_beef}></img>
						<input type="radio" id="beef" name="meaty" value="beef" className="radio" onChange={handleInput} />
						Beef
					</label>
					<label className="rad-lab" htmlFor="poultry">
						<img className="rad-lab-img" alt = "" src={img_chicken}></img>
						<input type="radio" id="poultry" name="meaty" value="poultry" className="radio" onChange={handleInput} />
						Poultry
					</label>
					<label className="rad-lab" htmlFor="pork">
						<img className="rad-lab-img" alt = "" src={img_ribs}></img>
						<input type="radio" id="pork" name="meaty" value="pork" className="radio" onChange={handleInput} />
						Pork
					</label>
			</section>
			
			<div className="header_row" >
				<div className="item_thumb">
					Image
				</div>
				<div className="item_details">
					Name/Description
				</div>
				<div className="header_dates">
					Sale Info
				</div>
				<div className="header_price">
					Price
				</div>
				<div className="header_price">
					Unit Price
				</div>
			</div>

			{/* Render the list of items. */}
			<section id="items_container">
				<Results currMeat={currentMeat} data={data} />
			</section>
		</div>
	)
}

// Ensure the function App() is executed whenever index.js renders App.
export default App;
