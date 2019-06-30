// import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6
// var ReactCSSTransitionGroup = require('react-addons-css-transition-group'); // ES5 with npm
// import React, { Component } from 'react';//This needs to be present in order to use React class components.  As of 3/5/19, I probably do not need it, since I plan to re-factor everything to use React hooks and functional components, instead of classes.
import React from 'react';
import {CSSTransition} from 'react-transition-group'

// import logo from './logo.svg';
import img_meat from './images/all-meat-250.jpg';
import img_beef from './images/beef-250.jpg';
import img_chicken from './images/chicken-250.jpg';
import img_ribs from './images/ribs-250.jpg';



import './App.css';
import './animate.css';

import { useState } from 'react';// This needs to be present in order to use the 'useState' hook.
import { useEffect } from 'react';// This needs to be present in order to use the 'useEffect' hook.

function OutSpec(props) {
						return (
							<div>
								Test Content
							</div>
						)};
		


function App(props) {

return (
			<div>

			<CSSTransition
				in={true}
				appear={true}
				timeout={1300}
				classNames="fade"
			>

				{/* <OutSpec meat={meat} data={data} /> */}
					<OutSpec />

			
			</CSSTransition>
			
			</div>
)
}

export default App;
