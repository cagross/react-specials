import React, { Component } from 'react';//This needs to be present in order to use React class components.  As of 3/5/19, I probably do not need it, since I plan to re-factor everything to use React hooks and functional components, instead of classes.
// import logo from './logo.svg';
// import './App.css';
import { useState } from 'react';// This needs to be present in order to use the 'useState' hook.
import { useEffect } from 'react';// This needs to be present in order to use the 'useEffect' hook.

/* Example of a functional component.  I can possibly use this component to display search results. */

// function DisplayResults(props) {
// 	return (
// 		<div className={props.myvar}>
// 			{props.myvar}
// 		</div>
// 	);
// }

/* Begin example of a functional component--one that displays the meat selector and updates state.  ~28/4/19 I moved this functionality to the parent component.*/

// function MeatSelector(props) {

// 	function onMeatChange (evt) {
// 		// console.log(evt.target.value);
// 		const mymeat = evt.target.value;
// 		props.handleMeatChange("meat", mymeat);
// 	}
// 	return (
// 		<div>
// 			<label htmlFor="size-options">Select Meat: </label>
// 			{/* <select name="sizeOptions" id="size-options" onChange={onMeatChange}> */}
// 			<select name="sizeOptions" id="size-options" >

// 				<option>Beef</option>
// 				<option>Chicken</option>
// 				<option>Pork</option>
// 			</select>
// 		</div>
// 	);
// }
/* End example of a functional component to displays the meat selector and updates state. */

function App() {

	/* Use the 'useState' hook to set initial state. */
	const [name, setName] = useState('Rusty Venture');
	// const [meat, setMeat] = useState('');// Set a piece of state named 'meat' to a blank string.  To update that piece of state, run the 'setMeat()' function.
	// const [data, setData] = useState('');// Set a piece of state named 'meat' to a blank string.  To update that piece of state, run the 'setMeat()' function.

	/* Begin the 'useEffect' hook to fetch the API data.  Pass a second parameter to useEffect()--a blank array--to ensure this runs only once (at startup). */
	// useEffect(() => {
		
	// 	/* This is a simple test function, simply to print a message to the console. */
	// 	function handleStatusChange() {
	// 		// console.log("Here is the API data:");
	// 	}
	// 	handleStatusChange();
	
	// 	/* Begin code to fetch API data. */
	// 	const proxyurl =
	// 		"https://cors-anywhere.herokuapp.com/";
	// 	var url =
	// 		"https://circular.giantfood.com/flyer_data/2545113?locale=en-US"; // site that doesn’t send Access-Control-*


	// 	const url_api =
	// 		// "https://circular.giantfood.com/flyers/giantfood?type=2&use_requested_domain=true&show_shopping_list_integration=1"
	// 		"https://circular.giantfood.com/flyers/giantfood?type=2&show_shopping_list_integration=1&postal_code=22204&use_requested_domain=true&store_code=0774&is_store_selection=true&auto_flyer=&sort_by=#!/flyers/giantfood-weekly?flyer_run_id=406535"

	// 	fetch(proxyurl + url_api) // https://cors-anywhere.herokuapp.com/https://example.com
	// 		.then(response => response.text())
	// 		.then(htmlStr => {
	// 			var str = htmlStr;
	// 			var pos = str.search("current_flyer_id");
	// 			var res = str.slice(pos + 18, pos + 25);
	// 			return res;
	// 		})
	// 		.then(id => {

	// 			url = "https://circular.giantfood.com/flyer_data/" + id + "?locale=en-US"

	// 			fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
	// 				// fetch("https://circular.giantfood.com/flyer_data/2505221?locale=en-US")
	// 				.then(function (response) {
	// 					return response.json();
	// 				})
	// 				.then(function (myJson) {
	// 					// for (const key of Object.keys(myJson.items)) {
	// 					// 	if (
	// 					// 		myJson.items[key][
	// 					// 		"category_names"
	// 					// 		][0] === "Meat" ||
	// 					// 		myJson.items[key][
	// 					// 		"category_names"
	// 					// 		][0] === "Deli"
	// 					// 	) {
	// 					// 		// var str =myJson.items[key]["display_name"];
	// 					// 		// var pos = str.search("hicken");
	// 					// 		// var pos = str.search(mymeat);

	// 					// 		// if (pos >= 0) {
	// 					// 			// console.log(key, myJson.items[key]);
	// 					// 		// }
	// 					// 	}
	// 					// }
	// 					// console.log("testy");
	// 					setData(myJson);
	// 				})
	// 				.catch(() => console.log("Message from Carl's code:  can’t access " + url + " response. Blocked by browser?"));
	// 		});


	// /* End code to fetch API data. */
	
	// },[]);//Note the empty array passed as the second input parameter.  This ensures everything inside 'useEffect' is executed only once.  If this second parameter is omitted, everything in 'useEffect' will be executed every time state is updated.

	/* End the 'useEffect' hook to fetch the API data.  Pass a second parameter to useEffect()--a blank array--to ensure this runs only once (at startup). */


	// function printData(namey) {
	function printData() {
		// setMeat(event.target.value);
		console.log("test");
		// console.log(namey);
	}




	/* Function to ensure the 'meat' piece of state is updated every time the drop-down menu changes.*/
	// function handleInput(event) {
	// 	setMeat(event.target.value);
	// }


	/* Everything inside this return() statement is executied whenever state is updated. */
	return (
		<div>
			{printData()}
		</div>
	)
}
// }

export default App;
