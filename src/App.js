//App.js fetches grocery specials from a web API, and renders them onto the page.

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

import { apiData } from './module-data.js';
import { filter } from './module-filter.js';
import { dispPrice } from './module-display-price.js';

// Function to format date.
function formDate(unform_date) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(unform_date));
}

// Filter the list of specials based on the user's meat selection, and return a <div> containing the list of results.
function Results(props) {
  function meatList() {// Filter the list of specials based on the user's meat selection and return an HTML element of the results.
    const meatData = filter(props);
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
                  {/* 15/7/19 The store name/address is hard coded here for now.  Once more stores are added, this should be dynamic--read from the API response. */}
                  <div className="row__storaddress">
                    Giant Food<br />
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
                {dispPrice(meatData[key]['current_price'], meatData[key]['price_text'])}
              </span>
              <span className="row__price">
                {dispPrice(meatData[key]['unit_price'], '/lb')}
              </span>
            </div>
          </CSSTransition>
        );
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
  const [data, setData] = useState([]);// Set a piece of state named 'data' to an empty array.  To update that piece of state, run the 'setData()' function.
  const [currentMeat, setMeat] = useState('');// Set a piece of state named 'currentMeat' to an empty string.  To update that piece of state, run the 'setMeat()' function.

  /* Execute the 'useEffect' hook to fetch the API data.  Pass an empty array as the second parameter to ensure this is executed only once (on initial page load). */
  useEffect(() => {
    (async () => {
      setData(await apiData());
    })();
  }, []);

  /* Function to ensure the 'meat' piece of state is updated every time the drop-down menu changes, as well as set classes on the radio button elements.*/
  function handleInput( event ) {
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

      {/* Insert the list of items. */}
      <section id="items_container">
        <Results currMeat={currentMeat} data={data} />
      </section>
    </div>
  )
}

// Export App, so it can be imported by index.js.
export default App;
