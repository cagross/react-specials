//App.js fetches grocery meat specials from an API, and renders them onto the page using ReactJS.

import React from 'react';

import { CSSTransition } from 'react-transition-group'// Required only for CSS transitions.
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

import { hello } from './module.js';
// import { terms } from './module-terms.js';
import { filter } from './module-filter.js';
import { dispPrice } from './module-display-price.js';

// Function to format date.
function formDate(unform_date) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(unform_date));
}

function Results(props) {// Filter the list of specials based on the user's meat selection, and render that list onto the page.

  function meatList() {// Filter the list of specials based on the user's meat selection and render it into a list.

    // const meatData = props.data;
    const meatData = filter(props);

    // const searchTerms = terms();
    // let meatPref;
    // // Determine which terms should be used to filter products, baed on the user's selected meat.
    // if (props.currMeat === "poultry") {
    // 	meatPref = searchTerms['poultry'];
    // } else if (props.currMeat === "beef") {
    // 	meatPref = searchTerms['beef'];
    // } else if(props.currMeat === "pork") {
    // 	meatPref = searchTerms['pork'];
    // }

    if (Object.entries(meatData).length) {// Check if the weekly specials array is empty or not.  If it is not empty, execute code.
      return Object.keys(meatData).map(function (key) {// Loop over every key in the weekly specials array and check if it contains any of the meat search terms.  If so, render a row of information to the page.

        /* Begin code to check if item name contains any search terms. */
        // const itemName = meatData[key]["display_name"].toLowerCase();

        // let match = false;
        // if (props.currMeat === "") {
        // 	match = true;
        // } else {
        // 	for (let i = 0; i < meatPref.length; i++) {
        // 		const pos = itemName.search(meatPref[i]);
        // 		if (pos >= 0) {
        // 			match = true;
        // 			break;
        // 		}
        // 	}
        // }
        /* End code to check if item name contains any meat terms. */

        /* Begin code to render a row of item information to the page. */
        // if (match) {
        return (

          <CSSTransition //Ensure each row appears with a CSS fade transition.
            in={true}
            appear={true}
            timeout={1300}
            classNames="fade"
            key={key}
          >

            <div className="row" >
              <img className="row__thumb" alt={meatData[key]['name']} src={meatData[key]['x_large_image_url']}></img>
              <div className="row__details">
                <div className="row__name">
                  {meatData[key]['name']}
                </div>
                <div className="row__desc">
                  {meatData[key]['description']}
                </div>

                <div className="row__disc">
                  {meatData[key]['disclaimer_text']}
                </div>
                <div className="row__ss">
                  {meatData[key]['sale_story']}
                </div>
              </div>
              <div className="row__dates">
                <div className="row__storinfo">
                  <img className="row__storlogo" alt="Logo: Giant Food." src={logo_giant}></img>
                  {/* 15/7/19 The store name/address is hard coded for now.  Once more stores are added, this will be dynamic. */}
                  <div className="row__storaddress">
                    Giant Food<br />
                    {/* 2501 S. 9th Rd.<br />
											Arlington, VA 22204 */}
											7235 Arlington Blvd<br />
											Falls Church, VA 22042
										</div>
                </div>
                <div className="row__datetext">
                  <i>
                    <span className="row__dateprefix">
                      valid:
											</span>
                    <time dateTime={meatData[key]['valid_from']}>{formDate(meatData[key]['valid_from'])}</time> - <time dateTime={meatData[key]['valid_to']}>{formDate(meatData[key]['valid_to'])}</time>

                  </i>
                </div>
              </div>
              <span className="row__price">
                {/* ${formPrice(meatData[key]['current_price'])}{meatData[key]['price_text']} */}
                {/* {dispPrice(meatData[key]['current_price'])}{meatData[key]['price_text']} */}
                {dispPrice(meatData[key]['current_price'], meatData[key]['price_text'])}


              </span>
              <span className="row__price">
                {/* ${formPrice(meatData[key]['unit_price'])}/lb. */}
                {/* {dispPrice(meatData[key]['unit_price'])} */}
                {/* {dispPrice(meatData[key]['unit_price'], 'up')} */}
                {dispPrice(meatData[key]['unit_price'], '/lb')}


              </span>
            </div>
          </CSSTransition>
        );
        // }
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
    (async () => {
      const testy = await hello();
      setData(testy);//Assign this array (the array containing all desired items and information) to the value of the 'data' variable.
    })();
  }, []);


  /* End code to fetch API data. */



  /* Function to ensure the 'meat' piece of state is updated every time the drop-down menu changes, as well as handle the functionality of the radio buttons.*/
  function handleInput(event) {
    setMeat(event.target.value);

    // Add necessary CSS classes to radio button elements, ensuring their animations function as expected.
    const radButtons = document.getElementsByTagName("input")
    for (let i = 0; i < radButtons.length; i++) {
      if (radButtons[i].value === event.target.value) {
        radButtons[i].className = "radio__input animated heartBeat";
      } else {
        radButtons[i].className = "radio__input";
      }
    }
  }

  return (
    <div id="content">
      {/* Add the radio button filter. */}
      <section className="filter">
        <label className="radio" htmlFor="allmeat">
          <img className="radio__img" alt="" src={img_meat}></img>
          <input type="radio" id="allmeat" name="meaty" value="" className="radio__input" onChange={handleInput} defaultChecked />
						All Meat
					</label>
        <label className="radio" htmlFor="beef">
          <img className="radio__img" alt="" src={img_beef}></img>
          <input type="radio" id="beef" name="meaty" value="beef" className="radio__input" onChange={handleInput} />
						Beef
					</label>
        <label className="radio" htmlFor="poultry">
          <img className="radio__img" alt="" src={img_chicken}></img>
          <input type="radio" id="poultry" name="meaty" value="poultry" className="radio__input" onChange={handleInput} />
						Poultry
					</label>
        <label className="radio" htmlFor="pork">
          <img className="radio__img" alt="" src={img_ribs}></img>
          <input type="radio" id="pork" name="meaty" value="pork" className="radio__input" onChange={handleInput} />
						Pork
					</label>
      </section>

      <div className="tabhead" >
        <div className="tabhead__thumb">
          Image
				</div>
        <div className="tabhead__details">
          Name/Description
				</div>
        <div className="tabhead__info">
          Sale Info
				</div>
        <div className="tabhead__price">
          Price
				</div>
        <div className="tabhead__price">
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






// function App() {

// 	/* Use the 'useState' hook to set initial state. */
// 	const [data, setData] = useState([]);// Set a piece of state named 'data' to an empty object.  To update that piece of state, run the 'setData()' function.
// 	const [currentMeat, setMeat] = useState('');// Set a piece of state named 'currentMeat' to an empty string.  To update that piece of state, run the 'setMeat()' function.

// 	/* Execute the 'useEffect' hook to fetch the API data.  Pass a second parameter to useEffect()--a blank array--to ensure this is executed only once (on initial page load ). */
// 	useEffect(() => {

// 		/* Begin code to fetch all weekly special data from the Giant Food API. */
// 		const proxyURL = "https://cors-anywhere.herokuapp.com/";
// 		const urlAPIFlyer =
// 			"https://circular.giantfood.com/flyers/giantfood?type=2&show_shopping_list_integration=1&postal_code=22204&use_requested_domain=true&store_code=0774&is_store_selection=true&auto_flyer=&sort_by=#!/flyers/giantfood-weekly?flyer_run_id=406535"

// 		// Use this first fetch() to obtain just the flyer ID, which we will in-turn use with a second fetch() to obtain the actual weekly specials data.
// 		fetch(proxyURL + urlAPIFlyer) // e.g. https://cors-anywhere.herokuapp.com/https://example.com  Method to avoid/disable CORS errors in Chrome during local development.

// 		.then(response => response.text())

// 		.then(flyerInfo => {

// 			const posFlyerID = flyerInfo.search("current_flyer_id");
// 			const flyerID = flyerInfo.slice(posFlyerID + 18, posFlyerID + 25);
// 			const urlAPIData = "https://circular.giantfood.com/flyer_data/" + flyerID + "?locale=en-US";

// 			fetch(proxyURL + urlAPIData)// This fetch() obtains an object containing all weekly specials data from the Giant Food store in-question.

// 			.then(response => response.json())

// 			.then(dataAll => {

// 				const dataItems = dataAll.items;// Filter all data into only data related to items.
// 				var dataMeatItems;

// 				const filter = 1;// Set this to 1 to filter data into only meat/deli items.  Set this to any other value to apply no filtering (i.e. display all items on page).
// 				const dataMeatItemsKeys = productFilter(dataItems, filter);// This returns an array of the keys after the desired filter has been applied.

// 				dataMeatItems = dataMeatItemsKeys.map(function (key) {// Create a new array containing only filtered items.  In addition, calculate and add a unit price property to the array.

// 					let item = dataItems[key];

// 					if (item['current_price'] === null) {//If an item has no price, set its price and unit price as unknown.
// 						item['unit_price'] = 'unknown';
// 						item['current_price'] = item['unit_price'];
// 					} else {
// 						unitPrice(item);//Calculate the unit price of the item and add it to the items array.
// 					}

// 					return item;
// 				});

// 				setData(dataMeatItems);//Assign this array (the array containing all desired items and information) to the value of the 'data' variable.
// 			})
// 		.catch(() => console.log("Message from Carl's code:  can’t access " + urlAPIData + " response. Possibly blocked by browser."));
// 		});
// 		/* End code to fetch API data. */

// 	}, []);

// 	/* Function to ensure the 'meat' piece of state is updated every time the drop-down menu changes, as well as handle the functionality of the radio buttons.*/
// 	function handleInput(event) {
// 		setMeat(event.target.value);

// 		// Add necessary CSS classes to radio button elements, ensuring their animations function as expected.
// 		const radButtons = document.getElementsByTagName("input") 
// 		for (let i = 0; i < radButtons.length; i++) {
// 			if (radButtons[i].value === event.target.value) {
// 				radButtons[i].className = "radio__input animated heartBeat";	
// 			} else {
// 				radButtons[i].className = "radio__input";	
// 			}
// 		}
// 	}

// 	return (
// 		<div id="content">
// 			{/* Add the radio button filter. */}
// 			<section className="filter">
// 					<label className="radio" htmlFor="allmeat">
// 						<img className="radio__img" alt = "" src={img_meat}></img>
// 						<input type="radio" id="allmeat" name="meaty" value="" className="radio__input" onChange={handleInput} defaultChecked/>
// 						All Meat
// 					</label>
// 					<label className="radio" htmlFor="beef">
// 						<img className="radio__img" alt = "" src={img_beef}></img>
// 						<input type="radio" id="beef" name="meaty" value="beef" className="radio__input" onChange={handleInput} />
// 						Beef
// 					</label>
// 					<label className="radio" htmlFor="poultry">
// 						<img className="radio__img" alt = "" src={img_chicken}></img>
// 						<input type="radio" id="poultry" name="meaty" value="poultry" className="radio__input" onChange={handleInput} />
// 						Poultry
// 					</label>
// 					<label className="radio" htmlFor="pork">
// 						<img className="radio__img" alt = "" src={img_ribs}></img>
// 						<input type="radio" id="pork" name="meaty" value="pork" className="radio__input" onChange={handleInput} />
// 						Pork
// 					</label>
// 			</section>

// 			<div className="tabhead" >
// 				<div className="tabhead__thumb">
// 					Image
// 				</div>
// 				<div className="tabhead__details">
// 					Name/Description
// 				</div>
// 				<div className="tabhead__info">
// 					Sale Info
// 				</div>
// 				<div className="tabhead__price">
// 					Price
// 				</div>
// 				<div className="tabhead__price">
// 					Unit Price
// 				</div>
// 			</div>

// 			{/* Render the list of items. */}
// 			<section id="items_container">
// 				<Results currMeat={currentMeat} data={data} />
// 			</section>
// 		</div>
// 	)
// }

// Ensure the function App() is executed whenever index.js renders App.
export default App;
