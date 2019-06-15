// import React, { Component } from 'react';//This needs to be present in order to use React class components.  As of 3/5/19, I probably do not need it, since I plan to re-factor everything to use React hooks and functional components, instead of classes.

import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import { useState } from 'react';// This needs to be present in order to use the 'useState' hook.
import { useEffect } from 'react';// This needs to be present in order to use the 'useEffect' hook.
// const { useRef, useLayoutEffect } = React;

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


function OutSpec(props) {


	function sizeOptions() {

		
		// if (typeof sizes.items == 'object') {
		// if (sizes.items) {
			// if (typeof sizes.items !== 'undefined') {
		



		var sizes = props.data;	
		// var sizes = [1,2,3];
		// console.log(typeof sizes.items);
		
		// console.log(typeof sizes);

		// console.log(Object.values(sizes));
		// console.log(Object.values(sizes.items));
		// console.log(sizes.items);
		

// if (typeof sizes !== 'undefined') {
		
		// console.log(sizes.items);
	// console.log(sizes);

		// if (Object.entries(sizes).length !== 0 && sizes.constructor === Object) {// Check if the sizes object has data.  If so, execute code.
		if (typeof sizes.items == 'object') {// Check if  sizes.items has been set.  If so, execute code.

			// console.log("Print this");

		
			// console.log(typeof sizes.items);

			console.log(sizes.items[0]);
		
		
			// var myObject = { 'a': 1, 'b': 2, 'c': 3 };
			var myObject = sizes.items;




			return Object.keys(myObject).map(function (key, index) {
			if (
				sizes.items[key][
				"category_names"
				][0] === "Meat" ||
				sizes.items[key][
				"category_names"
				][0] === "Deli"
			) {
							var str = sizes.items[key]["display_name"];

							var pos = str.search(props.meat);

							if (pos >= 0) {
								// console.log(key, sizes.items[key]["display_name"]);
								return (
									<div key={key}>
										<div>{myObject[key]['name']}</div>
										<div>{myObject[key]['current_price']}</div>
									</div>
								);
							} else return null;

			} else return null;
		});
	}

		// return Object.keys(sizes).map(function (key, index) {
		// 	return (
		// 		<div>{sizes[key]}</div>
		// 	);
		// });

		// return sizes.map(function(num) {
		// 	return (
		// 		<div key={num}>{num}</div>
		// 	);
		// })

		

		// if (typeof sizes.items == 'object') {

		// 	console.log(typeof Object.keys(sizes.items));
		// 	for (const key of Object.keys(sizes.items)) {
		// 		if (
		// 			sizes.items[key][
		// 			"category_names"
		// 			][0] === "Meat" ||
		// 			sizes.items[key][
		// 			"category_names"
		// 			][0] === "Deli"
		// 		) {
		// 			var str = sizes.items[key]["display_name"];

		// 			var pos = str.search(props.meat);

		// 			if (pos >= 0) {
		// 				console.log(key, sizes.items[key]["display_name"]);
		// 			}
		// 		}
		// 	}
		// }
	}


	console.log("meat changed to " + props.meat);

	//   var test = props.data;  

	// if (typeof test.items == 'object') {  
	//         for (const key of Object.keys(test.items)) {
	//         	if (
	//         		test.items[key][
	//         		"category_names"
	//         		][0] === "Meat" ||
	//         		test.items[key][
	//         		"category_names"
	//         		][0] === "Deli"
	//         	) {
	// 				      var str =test.items[key]["display_name"];

	//             var pos = str.search(props.meat);

	//         		if (pos >= 0) {
	//               console.log(key, test.items[key]["display_name"]);
	//         		}


	//           }
	//         }

	// }

	return (
		<div>
			{sizeOptions()}
		</div>
	);
}


function App(props) {


	/* Use the 'useState' hook to set initial state. */
	const [data, setData] = useState({});
	const [meat, setMeat] = useState('');// Set a piece of state named 'meat' to a blank string.  To update that piece of state, run the 'setMeat()' function.

	/* Begin the 'useEffect' hook to fetch the API data.  Pass a second parameter to useEffect()--a blank array--to ensure this runs only once (at startup). */
	useEffect(() => {

		/* This is a simple test function, simply to print a message to the console. */
		function handleStatusChange() {
			// console.log("Here is the API data:");
		}
		handleStatusChange();

		/* Begin code to fetch API data. */
		const proxyurl =
			"https://cors-anywhere.herokuapp.com/";
		var url =
			"https://circular.giantfood.com/flyer_data/2545113?locale=en-US"; // site that doesn’t send Access-Control-*


		const url_api =
			// "https://circular.giantfood.com/flyers/giantfood?type=2&use_requested_domain=true&show_shopping_list_integration=1"
			"https://circular.giantfood.com/flyers/giantfood?type=2&show_shopping_list_integration=1&postal_code=22204&use_requested_domain=true&store_code=0774&is_store_selection=true&auto_flyer=&sort_by=#!/flyers/giantfood-weekly?flyer_run_id=406535"

		fetch(proxyurl + url_api) // https://cors-anywhere.herokuapp.com/https://example.com
			.then(response => response.text())
			.then(htmlStr => {
				var str = htmlStr;
				var pos = str.search("current_flyer_id");
				var res = str.slice(pos + 18, pos + 25);
				return res;
			})
			.then(id => {

				url = "https://circular.giantfood.com/flyer_data/" + id + "?locale=en-US"

				fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
					// fetch("https://circular.giantfood.com/flyer_data/2505221?locale=en-US")
					.then(function (response) {
						return response.json();
					})
					.then(function (myJson) {


						// console.log(myJson);
						// console.log(typeof myJson);
						console.log("API data loaded.");


						setData(myJson);

					})
					.catch(() => console.log("Message from Carl's code:  can’t access " + url + " response. Blocked by browser?"));
			});


		/* End code to fetch API data. */

	}, []);//Note the empty array passed as the second input parameter.  This ensures everything inside 'useEffect' is executed only once.  If this second parameter is omitted, everything in 'useEffect' will be executed every time state is updated.

	/* End the 'useEffect' hook to fetch the API data.  Pass a second parameter to useEffect()--a blank array--to ensure this runs only once (at startup). */


	// useEffect(outSpec);


	/* Function to ensure the 'meat' piece of state is updated every time the drop-down menu changes.*/
	function handleInput(event) {
		setMeat(event.target.value);
	}

	// function outSpec() {
	//   function OutSpec() {

	// 	  console.log("meat changed to " + meat);
	// 	  var test = {data};  
	//     if (typeof test.data.items == 'object') {  
	//             for (const key of Object.keys(test.data.items)) {
	//             	if (
	//             		test.data.items[key][
	//             		"category_names"
	//             		][0] === "Meat" ||
	//             		test.data.items[key][
	//             		"category_names"
	//             		][0] === "Deli"
	//             	) {
	// 					      var str =test.data.items[key]["display_name"];

	//                 var pos = str.search(meat);

	//             		if (pos >= 0) {
	//                   console.log(key, test.data.items[key]["display_name"]);
	//             		}


	//               }
	//             }

	//     }

	//     return meat;

	//   }




	/* Everything inside this return() statement is executed whenever state is updated. */
	return (
		<div>

			<div>
				<label htmlFor="size-options">Select Meat: </label>
				{/* <select name="sizeOptions" id="size-options" onChange={onMeatChange}> */}
				{/* <select name="sizeOptions" id="size-options" > */}
				{/* <select name="sizeOptions" id="size-options" onChange={() => setCount(count + 1)}> */}
				<select name="sizeOptions" id="size-options" onChange={handleInput}>
					<option>Beef</option>
					<option>Chicken</option>
					<option>Pork</option>
				</select>
			</div>

			<div id="output">
				{/* {meat} */}
				<br />
				{/* {data} */}
				<OutSpec meat={meat} data={data} />
			</div>
		</div>
	)
}
// }

export default App;
