/**
 * Fetches grocery specials from a web API, and renders them onto the page.
 * @file
 * @module
 * @author Carl Gross
 */

import { CSSTransition } from "react-transition-group"; // Required only for CSS transitions.
import "./App.css"; // Import the main CSS file.
import { useState, useEffect, useRef } from "react"; // This needs to be present in order to use the React hooks.

// Import my images.
import img_meat from "./images/all-meat-250.jpg";
import img_beef from "./images/beef-250.jpg";
import img_chicken from "./images/chicken-250.jpg";
import img_ribs from "./images/ribs-250.jpg";
import logo_giant from "./images/logo-Giant-50.png";

import PropTypes from "prop-types"; // Required to add data type validation on props.
import { filter } from "./module-filter.js";
import { dispPrice } from "./module-display-price.js";

/**
 * Format date.
 * @param {String} unform_date
 * @returns {Date}
 */
function formDate(unform_date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(unform_date));
}

/**
 * Filter the list of specials based on the user's meat selection, and return a <div> component containing the list of results.
 * @param {Object} props
 * @returns
 */
function Results(props) {
  /**
   * For one store, filters circular items by meat selection and returns list of HTML elements.
   * @param {string} meat - Meat selection.
   * @param {object} items - Circular items from one store.
   * @returns {Array} - Array of <div> elements.
   */
  function meatList(meat, items) {
    const meatData = filter(meat, items.items);

    if (Object.entries(meatData).length) {
      return Object.keys(meatData).map(function (key) {
        const nodeRef = useRef(null);
        return (
          <CSSTransition //Ensure each row appears with a CSS fade transition.
            in={true}
            appear={true}
            timeout={1300}
            classNames="fade"
            key={key}
            nodeRef={nodeRef}
          >
            <div className="row" ref={nodeRef}>
              <img
                className="row__thumb"
                alt={meatData[key]["name"]}
                src={meatData[key]["x_large_image_url"]}
              ></img>
              <div className="row__details">
                <div className="row__name">{meatData[key]["name"]}</div>
                <div className="row__desc">{meatData[key]["description"]}</div>

                <div className="row__disc">
                  {meatData[key]["disclaimer_text"]}
                </div>
                <div className="row__ss">{meatData[key]["sale_story"]}</div>
              </div>
              <div className="row__dates">
                <div className="row__storinfo">
                  <img
                    className="row__storlogo"
                    alt="Logo: Giant Food."
                    src={logo_giant}
                  ></img>
                  <div className="row__storaddress">
                    {items.storeLocation[0]}
                    <br />
                    {items.storeLocation[1]}
                    <br />
                    {items.storeLocation[2]}
                  </div>
                </div>
                <div className="row__datetext">
                  <i>
                    <span className="row__dateprefix">valid:</span>
                    <time dateTime={meatData[key]["valid_from"]}>
                      {formDate(meatData[key]["valid_from"])}
                    </time>{" "}
                    -{" "}
                    <time dateTime={meatData[key]["valid_to"]}>
                      {formDate(meatData[key]["valid_to"])}
                    </time>
                  </i>
                </div>
              </div>
              <span className="row__price">
                {dispPrice(meatData[key], false)}
              </span>
              <span className="row__price">
                {dispPrice(meatData[key], true)}
              </span>
            </div>
          </CSSTransition>
        );
      });
    }
  }
  console.log("Meat selection changed to " + props.currMeat);

  if (typeof props.data === "undefined" || props.data === null)
    return <div></div>;
  if (props.data.noStores)
    return <div class="noresults">No stores found in your search.</div>;
  if (props.data.error)
    return <div class="noresults">Error with store search.</div>;

  if (props && Object.keys(props.data).length === 0) return <div></div>;

  //Iterate over each store's circular and return a list of HTML elements.
  return (
    <div>
      {Object.keys(props.data).map((key) =>
        meatList(props.currMeat, props.data[key])
      )}
    </div>
  );
}

// Ensure each prop has its type defined.
Results.propTypes = {
  currMeat: PropTypes.string,
  data: PropTypes.object,
};

/**
 * App() is the top level functional component.  It ensures data is fetched from the API on initial page render.  It also renders all content on the page, and defines the onClick functionality for the radio buttons.
 * @returns
 */
const App = () => {
  const [zip, setZip] = useState("");
  const [radius, setRadius] = useState("");
  const [data, setData] = useState({});
  const [meat, setMeat] = useState("");

  /**
   * Make AJAX call to /items route and return response to browser
   * @param {string} zip - US zip code.  Center of store search.
   * @param {number} radius - Radius of store search in miles.
   * @returns {object} All circular items from all stores found within the zip/radius search parameters.
   */
  const fetchData = (zip, radius) => {
    const origin = window.location.href;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ zip: zip, radius: radius }), // body data type must match "Content-Type" header.
    };
    return fetch(origin + "items", params)
      .then((response) => {
        if (response.status === 204) return { noStores: true };
        console.log("Items found.");
        return response.json();
      })
      .then((dataAll) => {
        return dataAll;
      })
      .catch((err) => {
        console.log("Error fetching circular data:");
        console.log(err);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData(await fetchData(zip, radius));
  };

  /**
   * onClick handler for radio buttons.
   * Update the 'meat' piece of state, as well as set classes on the radio button elements.
   * @param {object} event - Event object.
   */
  function handleInput(event) {
    setMeat(event.target.value);

    // Add necessary CSS classes to radio button elements, ensuring their animations function as expected.
    const radButtons = document.getElementsByClassName(".radio__input");
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
      <section className="search">
        <form className="search__form" onSubmit={handleSubmit}>
          <label htmlFor="zip" className="search__label">
            Zip Code:
            <input
              type="text"
              name="zip"
              placeholder="e.g. 22042"
              className="search__txtinput"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </label>
          <label htmlFor="radius" className="search__label">
            Radius (miles):
            <input
              type="number"
              name="radius"
              placeholder="e.g. 3"
              className="search__txtinput"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
            />
          </label>
          <input
            type="submit"
            id="button"
            className="search__button"
            value="Search"
          />
        </form>
      </section>

      <section className="filter">
        <label className="radio" htmlFor="allmeat">
          <img className="radio__img" alt="" src={img_meat}></img>
          <input
            type="radio"
            id="allmeat"
            name="meaty"
            value=""
            className="radio__input"
            onChange={handleInput}
            defaultChecked
          />
          All Meat
        </label>
        <label className="radio" htmlFor="beef">
          <img className="radio__img" alt="" src={img_beef}></img>
          <input
            type="radio"
            id="beef"
            name="meaty"
            value="beef"
            className="radio__input"
            onChange={handleInput}
          />
          Beef
        </label>
        <label className="radio" htmlFor="poultry">
          <img className="radio__img" alt="" src={img_chicken}></img>
          <input
            type="radio"
            id="poultry"
            name="meaty"
            value="poultry"
            className="radio__input"
            onChange={handleInput}
          />
          Poultry
        </label>
        <label className="radio" htmlFor="pork">
          <img className="radio__img" alt="" src={img_ribs}></img>
          <input
            type="radio"
            id="pork"
            name="meaty"
            value="pork"
            className="radio__input"
            onChange={handleInput}
          />
          Pork
        </label>
      </section>

      <div className="tabhead">
        <div className="tabhead__thumb">Image</div>
        <div className="tabhead__details">Name/Description</div>
        <div className="tabhead__info">Sale Info</div>
        <div className="tabhead__price">Price</div>
        <div className="tabhead__price">Unit Price</div>
      </div>

      <section id="items_container">
        <Results currMeat={meat} data={data} />
      </section>
    </div>
  );
};

export default App;
