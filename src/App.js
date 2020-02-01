//App.js fetches grocery meat specials from an API, and renders them onto the page using React JS.

import React from 'react';
import {CSSTransition} from 'react-transition-group'

import './App.css';// Import the main CSS file.
import './animate.css';// Needed to fade transition to function.

import { useState } from 'react';// This needs to be present in order to use the 'useState' hook.
import { useEffect } from 'react';// This needs to be present in order to use the 'useEffect' hook.

import img_meat from './images/all-meat-250.jpg';
import img_beef from './images/beef-250.jpg';
import img_chicken from './images/chicken-250.jpg';
import img_ribs from './images/ribs-250.jpg';
import logo_giant from './images/logo-Giant-50.png';

function Results(props) {// Filter the list of specials based on the user's meat selection, and render that list onto the page.

	// Function to format price.
	function formPrice(unform_price) {
		return Number(unform_price).toFixed(2);
	}

	// Function to formate date.
	function formDate(unform_date) {
		return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(unform_date));
	}
	
	function meatList() {

		const meatData = props.data;
		let meatTerms;

		//Definie all possible search terms here--terms which are indicative of a poultry, beef, or pork item.  This is very incomplete, as determining accurate terms is the difficult part.  This ia also  something that will eventually be moved to a database.
		const searchTerms = {
			poultry: [
				"chicken",
				"roaster",
				"turkey",
				"duck",
				"hen",
				"goose"
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

		// Assign the appropriate search terms based on the user's selected meat.
		if (props.meat === "poultry") {
			meatTerms = searchTerms['poultry'];
		} else if (props.meat === "beef") {
			meatTerms = searchTerms['beef'];
		} else if(props.meat === "pork") {
			meatTerms = searchTerms['pork'];
		}

		// if (Object.entries(sizes).length !== 0 && sizes.constructor === Object) {// Check if the sizes object is empty or not.  If it is not empty, execute code.
		if (Object.entries(meatData).length) {// Check if the weekly specials object is empty or not.  If it is not empty, execute code.

			return Object.keys(meatData).map(function (key, index) {// Loop over every key in the weekly specials object and check if its name contains any of the meat search terms.  If so, render a row of information to the page.

				/* Begin code to check if item name contains any meat terms. */
				let pos;
				// var i;
				const str = meatData[key]["display_name"].toLowerCase();
					
				if (props.meat === "") {
					pos = str.search(props.meat);
				} else {
					for (let i = 0; i < meatTerms.length; i++) {
						pos = str.search(meatTerms[i]);
						if (pos >= 0) {
							break;
						}
					}
				}
				/* End code to check if item name contains any meat terms. */

				/* Begin code to render a row of item information to the page. */
				if (pos >= 0) {
					// console.log(meatData[key]['valid_from']);
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
									<span className="item_name">
										{meatData[key]['name']}
									</span>
									<br />
									<span className="item_desc">
										{meatData[key]['description']}
									</span>
									<br />
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
											{formDate(meatData[key]['valid_from'])} - {formDate(meatData[key]['valid_to'])}

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
	console.log("meat changed to " + props.meat);
	return (
		<div>
			{meatList()}
		</div>
	);
}

//App() is the top level functional component.
function App(props) {

	/* Use the 'useState' hook to set initial state. */
	const [data, setData] = useState({});// Set a piece of state named 'data' to an empty object.  To update that piece of state, run the 'setData()' function.
	const [meat, setMeat] = useState('');// Set a piece of state named 'meat' to an empty string.  To update that piece of state, run the 'setMeat()' function.

	/* Execute the 'useEffect' hook to fetch the API data.  Pass a second parameter to useEffect()--a blank array--to ensure this is executed only once (on initial page load ). */
	useEffect(() => {

		// fetch('http://localhost:8000/')
		// .then(response => response.json())
		// .then(responsy => {
		// 	console.log(responsy);
		// 	setData(responsy);
		// })
		
		/* Begin code to fetch all weekly special data from the Giant Food API. */
		const proxyurl = "https://cors-anywhere.herokuapp.com/";
		const url_api1 =
			"https://circular.giantfood.com/flyers/giantfood?type=2&show_shopping_list_integration=1&postal_code=22204&use_requested_domain=true&store_code=0774&is_store_selection=true&auto_flyer=&sort_by=#!/flyers/giantfood-weekly?flyer_run_id=406535"

		// fetch(url_api1) // https://cors-anywhere.herokuapp.com/https://example.com  Method to avoid/disable CORS errors in Chrome during local development.
		fetch(proxyurl + url_api1) // https://cors-anywhere.herokuapp.com/https://example.com  Method to avoid/disable CORS errors in Chrome during local development.
		//Use this first fetch() to obtain just the flyer ID, which we will in-turn use with a second fetch() to obtain the actual weekly specials data.
		// .then(response => {
		// 	console.log(response.text);
		// })
		
		.then(response => response.text())
		.then(infoAPI2 => {
			// console.log(infoAPI2);
			const pos = infoAPI2.search("current_flyer_id");
			// console.log(pos);
			const id_api2 = infoAPI2.slice(pos + 18, pos + 25);
			return id_api2;// This is the flyer ID that we will use with a second fetch() to obtain actual weekly specials data.
		})		
		.then(id => {
			const url_api2 = "https://circular.giantfood.com/flyer_data/" + id + "?locale=en-US"
			fetch(proxyurl + url_api2)//This fetch() obtains an object containing all weekly specials data from the Giant Food store in-question.
			.then(response => response.json())
			.then(dataAll => {
				//Filter the weekly specials to return only the specials on meat.
				const dataItems = dataAll.items;
				let dataMeatItems = Object.keys(dataItems).filter(key => {
					if ((dataItems[key]["category_names"][0] === "Meat") ||
						dataItems[key]["category_names"][0] === "Deli") {
						return true;
					}
				});
				dataMeatItems = dataMeatItems.map(function (key, index) {
					
					let part = dataItems[key];
					part['unit_price'] = 55.55;

					if (part['current_price'] === null) {//If an item has no price, set its price and unit price as unknown.
						part['unit_price'] = 'unknown';
						part['current_price'] = part['unit_price'];
					} else {

						const pos_lb = part['price_text'].search("lb");// Search the 'price text' of each item for 'lb.'

						if (pos_lb >= 0) {// If 'lb' occurs in the 'price text' of an item, then its 'current price' is already its unit price, so set it accordingly.
							part['unit_price'] = part['current_price'];
						} else {// If 'lb' does not occur in the 'price text' of an item, continue to determine the unit price using other methods.

							const patt_ea = /\/ea/;
							const has_ea = patt_ea.test(part['price_text']);// Check if the string 'ea' exists in the 'price text.'
							// If 'ea' occurs in the 'price text,' or the 'price text' is blank, then assume the price is per package, and run the following code which searches through the item 'description' to determine the weight of the package.
							if (has_ea || part['price_text'] === "") {

								if (part['description'] != null) {
									const pos_oz = part['description'].search(/oz\./i);// Search for the string 'oz' in the item 'description.'  Return the index in the string.

									if (pos_oz >= 0) {// If the string 'oz' appears in the item 'description,' run the following code to extract the weight of the item, in pounds.
										const partial_oz = part['description'].substring(0, pos_oz);
										const weight_oz = partial_oz.match(/[0-9]+/);
										part['unit_price'] = 16*part['current_price']/weight_oz;// Calculate the per pound unit price of the item, using the total price and weight in ounces.
									}
								}
							}
						}
					}

					return part;
				});
				// console.log(dataMeatItems)
				setData(dataMeatItems);
			})
		.catch(() => console.log("Message from Carl's code:  can’t access " + url_api2 + " response. Possibly blocked by browser"));
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
				<div className="rad-lab" >
					<label htmlFor="allmeat">
						<img className="rad-lab-img" alt = "Various barbecued meats." src={img_meat}>
						</img>
					</label>
					<input type="radio" id="allmeat" name="meaty" value="" className="radio" onChange={handleInput} defaultChecked/>
					<label className="rad-lab-txt" htmlFor="allmeat">
						All Meat
					</label>
				</div>

				<div className="rad-lab" >
					<label htmlFor="beef">
						<img className="rad-lab-img" alt = "Cooked and sliced steak." src={img_beef}>
						</img>
					</label>
					<input type="radio" id="beef" name="meaty" value="beef" className="radio" onChange={handleInput} />
					<label className="rad-lab-txt" htmlFor="beef">
						Beef
					</label>
				</div>
				<div className="rad-lab" >
					<label htmlFor="poultry">
						<img className="rad-lab-img" alt = "Lemon herb roast chicken." src={img_chicken}>
						</img>
					</label>
					<input type="radio" id="poultry" name="meaty" value="poultry" className="radio" onChange={handleInput} />
					<label className="rad-lab-txt" htmlFor="poultry">
						Poultry
					</label>
				</div>
				<div className="rad-lab" >
					<label htmlFor="pork">
						<img className="rad-lab-img" alt = "BBQ ribs." src={img_ribs}>
						</img>
					</label>
					<input type="radio" id="pork" name="meaty" value="pork" className="radio" onChange={handleInput} />
					<label className="rad-lab-txt" htmlFor="pork">
						Pork
					</label>
				</div>
			</section>

			{/* Render the list of items. */}
			<section id="items_container">
				<Results meat={meat} data={data} />
			</section>
		</div>
	)
}

// Ensure App() is executed whenever index.js renders App.
export default App;
