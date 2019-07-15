//App.js fetches grocery meat specials from an API, and renders them onto the page using React JS.

import React from 'react';
import {CSSTransition} from 'react-transition-group'

import './App.css';
import './animate.css';

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

		var meatData = props.data;
		var meatTerms;

		//Definie all possible search terms here--terms which are indicative of a poultry, beef, or pork item.  This is very incomplete, as determining accurate terms is the difficult part.  This ia also  something that will eventually be moved to a database.
		var searchTerms = {
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
				var pos;
				var i;
				var str = meatData[key]["display_name"].toLowerCase();
					
				if (props.meat === "") {
					pos = str.search(props.meat);
				} else {
					for (i = 0; i < meatTerms.length; i++) {
						pos = str.search(meatTerms[i]);
						if (pos >= 0) {
							break;
						}
					}
				}
				/* End code to check if item name contains any meat terms. */

				/* Begin code to render a row of item information to the page. */
				if (pos >= 0) {
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
								{/* <span className="item_price">
									${form_price(meatData[key]['unit_price'])}/lb.
								</span>								 */}
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

	/* Execute the 'useEffect' hook to fetch the API data.  Pass a second parameter to useEffect()--a blank array--to ensure this is executed  only once (on initial page load ). */
	useEffect(() => {

		/* Begin code to fetch all weekly special data from the Giant Food API. */
		const proxyurl = "https://cors-anywhere.herokuapp.com/";
		const url_api1 =
			"https://circular.giantfood.com/flyers/giantfood?type=2&show_shopping_list_integration=1&postal_code=22204&use_requested_domain=true&store_code=0774&is_store_selection=true&auto_flyer=&sort_by=#!/flyers/giantfood-weekly?flyer_run_id=406535"
		var url_api2;

		fetch(proxyurl + url_api1) // https://cors-anywhere.herokuapp.com/https://example.com  Method to avoid/disable CORS errors in Chrome during local development.
		//Use this first fetch() to obtain just the flyer ID, which we will in-turn use with a second fetch() to obtain the actual weekly specials data.
		.then(response => response.text())
		.then(infoAPI2 => {
			var pos = infoAPI2.search("current_flyer_id");
			var id_api2 = infoAPI2.slice(pos + 18, pos + 25);
			return id_api2;// This is the flyer ID that we will use with a second fetch() to obtain actual weekly specials data.
		})		
		.then(id => {
			url_api2 = "https://circular.giantfood.com/flyer_data/" + id + "?locale=en-US"
			fetch(proxyurl + url_api2)
			//This fetch() obtains an object containing all weekly specials data from the Giant Food store in-question.
			.then(response => response.json())
			.then(dataAll => {

				//Filter the weekly specials to return only the specials on meat.
				var dataItems = dataAll.items;
				var dataMeatItems = Object.keys(dataItems).filter(key => {
					if ((dataItems[key]["category_names"][0] === "Meat") ||
						dataItems[key]["category_names"][0] === "Deli") {
						return true;
					}
				});
				dataMeatItems = dataMeatItems.map(function (key, index) {
					var part = dataItems[key];
					// part['unit_price'] = 5.55;// Set the unit price of each item here (incomplete as of 15/7/19)
					return part;
				});
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
		var i;
		var radButtons = document.getElementsByTagName("input") 
		for (i = 0; i < radButtons.length; i++) {
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
			<div className="filter">
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
			</div>

			{/* Render the list of items. */}
			<div id="items_container">
				<Results meat={meat} data={data} />
			</div>
		</div>
	)
}

// Ensure App() is executed whenever index.js renders App.
export default App;
