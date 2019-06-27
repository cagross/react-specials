// import React, { Component } from 'react';//This needs to be present in order to use React class components.  As of 3/5/19, I probably do not need it, since I plan to re-factor everything to use React hooks and functional components, instead of classes.
import React from 'react';
// import logo from './logo.svg';
import img_beef from './images/beef-250.jpg';
import img_chicken from './images/chicken-250.jpg';
import img_ribs from './images/ribs-250.jpg';

import './App.css';
import { useState } from 'react';// This needs to be present in order to use the 'useState' hook.
import { useEffect } from 'react';// This needs to be present in order to use the 'useEffect' hook.

function OutSpec(props) {

	
	function form_price(unform_price) {
		// console.log(Number(unform_price).toFixed(2));
		return Number(unform_price).toFixed(2);
		// return +unform_price.toFixed(2);


	}
	
	function sizeOptions() {
		var sizes = props.data;	

		var j = 0;

		var data_poultry = [
			"chicken",
			"roaster",
			"turkey",
			"duck",
			"hen",
			"goose"
		];

		var data_beef = [
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
		];

		var data_pork = [
			"butt",
			"ham",
			"bacon",
			// "rib",
			"sausage",
			"pork"
		];

		// if (Object.entries(sizes).length !== 0 && sizes.constructor === Object) {// Check if the sizes object is empty or not.  If it is not empty, execute code.
		if (typeof sizes.items == 'object') {// Check if  sizes.items has been set.  If so, execute code.

			console.log(sizes.items);

			var myObject = sizes.items;
			

			return Object.keys(myObject).map(function (key, index) {
				if (sizes.items[key]["category_names"][0] === "Meat" || 
					sizes.items[key]["category_names"][0] === "Deli") {
					
						var str = sizes.items[key]["display_name"].toLowerCase();
						
						var pos;
						var i;
						
						if (props.meat === "Poultry") {
							// console.log(str);
							for (i = 0;i < data_poultry.length;i++) {
								pos = str.search(data_poultry[i]);
								if (pos >= 0) {
									// console.log(poultry[i]);
									break;
								}
							}
						} else if(props.meat === "Beef") {
							// console.log(str);
							for (i = 0; i < data_beef.length; i++) {
								pos = str.search(data_beef[i]);
								if (pos >= 0) {
									break;
								}
							}
						} else if (props.meat === "Pork") {
							// console.log(str);
							for (i = 0; i < data_pork.length; i++) {
								pos = str.search(data_pork[i]);
								if (pos >= 0) {
									break;
								}
							}
						} else {
							pos = str.search(props.meat);
							// console.log(props.meat + " " + pos);
						}
						
						
						// var pos = str.search(props.meat);

						if (pos >= 0) {
							j++;
							// console.log(j);

							return (
								<div className="item_row" key={key}>
									{/* <img className="item_thumb" alt = "" src={myObject[key]['dist_coupon_image_url']}></img> */}
									<img className="item_thumb" alt="" src={myObject[key]['x_large_image_url']}></img>
									{/* <span className="item_name">{myObject[key]['name']}</span> */}
									<div>
										<span className="item_name">
											{myObject[key]['name']}
										</span>
										<br />
										<span className="item_desc">
											{myObject[key]['description']}
										</span>
										<br />
										<div className="item_disc">
											{myObject[key]['disclaimer_text']}
										</div>
										<div className="item_ss">
											{myObject[key]['sale_story']}
										</div>
									</div>

									<span className="item_price">
										${form_price(myObject[key]['current_price'])}{myObject[key]['price_text']}
									</span>
								</div>
							);
						} else return null;
					} else return null;
				});
		}
	}

	console.log("meat changed to " + props.meat);

	return (
		<div>
			{sizeOptions()}
		</div>
	);
}


function App(props) {

	/* Use the 'useState' hook to set initial state. */
	const [data, setData] = useState({});// Set a piece of state named 'data' to an empty object.  To update that piece of state, run the 'setData()' function.
	const [meat, setMeat] = useState('');// Set a piece of state named 'meat' to a blank string.  To update that piece of state, run the 'setMeat()' function.

	/* Begin the 'useEffect' hook to fetch the API data.  Pass a second parameter to useEffect()--a blank array--to ensure this runs only once (at startup). */
	useEffect(() => {

		/* This is a simple test function, simply to print a message to the console. */
		function handleStatusChange() {
			// console.log("Here is the API data:");
		}
		handleStatusChange();

		/* Begin code to fetch API data. */
		const proxyurl = "https://cors-anywhere.herokuapp.com/";
		// var url = "https://circular.giantfood.com/flyer_data/2545113?locale=en-US"; // This needs to be a var, since later we will modify it.  
		var url = "";

		const url_api =
			"https://circular.giantfood.com/flyers/giantfood?type=2&show_shopping_list_integration=1&postal_code=22204&use_requested_domain=true&store_code=0774&is_store_selection=true&auto_flyer=&sort_by=#!/flyers/giantfood-weekly?flyer_run_id=406535"

		fetch(proxyurl + url_api) // https://cors-anywhere.herokuapp.com/https://example.com  Method to avoid/disable CORS errors in Chrome during development.
			.then(response => response.text())
			.then(htmlStr => {
				var str = htmlStr;
				var pos = str.search("current_flyer_id");
				var res = str.slice(pos + 18, pos + 25);
				return res;
			})
			.then(id => {

				url = "https://circular.giantfood.com/flyer_data/" + id + "?locale=en-US"

				fetch(proxyurl + url)
					.then(function (response) {
						return response.json();
					})
					.then(function (myJson) {
						console.log("API data loaded.");
						setData(myJson);
					})
					.catch(() => console.log("Message from Carl's code:  can’t access " + url + " response. Blocked by browser?"));
			});
		/* End code to fetch API data. */

	}, []);//Note the empty array passed as the second input parameter.  This ensures everything inside 'useEffect' is executed only once, on page load.  If this second parameter is omitted, everything in 'useEffect' will be executed every time state is updated.

	/* Function to ensure the 'meat' piece of state is updated every time the drop-down menu changes.*/
	function handleInput(event) {
		setMeat(event.target.value);
	}

	/* Everything inside this return() statement is executed whenever state is updated. */
	return (
		<div id="content">
			<div className="filter">

					
				{/* <label htmlFor="meatChoice1">
					Beef<br />
					<input type="radio" id="meatChoice1" name="meaty" value="Beef" className="radio" onChange={handleInput} />
				</label>
			
				<label htmlFor="meatChoice2">
					Poultry<br />
					<input type="radio" id="meatChoice2" name="meaty" value="Poultry" className="radio" onChange={handleInput} />
				</label>

				<label htmlFor="meatChoice3">
					Pork<br />
					<input type="radio" id="meatChoice3" name="meaty" value="Pork" className="radio" onChange={handleInput} />
				</label> */}
						





				<div className="rad-lab" >
					<label htmlFor="meatChoice1">
						<img className="rad-lab-img" src={img_beef}>
						</img>
					</label>
					<input type="radio" id="meatChoice1" name="meaty" value="Beef" className="radio" onChange={handleInput} />
					<label className="rad-lab-txt" htmlFor="meatChoice1">
						Beef
					</label>
				</div>
				<div className="rad-lab" >
					<label htmlFor="meatChoice2">
						<img className="rad-lab-img" src={img_chicken}>
						</img>
					</label>
					<input type="radio" id="meatChoice2" name="meaty" value="Poultry" className="radio" onChange={handleInput} />
					<label className="rad-lab-txt" htmlFor="meatChoice2">
						Chicken
					</label>
				</div>
				<div className="rad-lab" >
					<label htmlFor="meatChoice3">
						<img className="rad-lab-img" src={img_ribs}>
						</img>
					</label>
					<input type="radio" id="meatChoice3" name="meaty" value="Pork" className="radio" onChange={handleInput} />
					<label className="rad-lab-txt" htmlFor="meatChoice3">
						Pork
					</label>
				</div>
						
						
						
						
						
						
			</div>

			<div id="items_container">
				<OutSpec meat={meat} data={data} />
			</div>
		</div>
	)
}

export default App;
