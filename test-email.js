#! /usr/bin/env node







// /* ES5, using Bluebird */
// var isMomHappy = true;
// // var isMomHappy = false;


// // Promise
// var willIGetNewPhone = new Promise(
//     function (resolve, reject) {
//         if (isMomHappy) {
//             var phone = {
//                 brand: 'Samsung',
//                 color: 'black'
//             };
//             resolve(phone);
//         } else {
// 			var reason = new Error('mom is not happy');
//             // var reason = 123;
			
//             reject(reason);
//         }

//     }
// );


// // call our promise
// var askMom = function () {
//     willIGetNewPhone
//         .then(function (fulfilled) {
//             // yay, you got a new phone
//             console.log(fulfilled);
//         })
//         .catch(function (error) {
//             // ops, mom don't buy it
// 			console.log(error.message);
//             // console.log(error);
			
//         });
// }

// askMom();










// const nodemailer = require('nodemailer');
// const mongoose = require('mongoose');
// const fetch = require('node-fetch');
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import fetch from 'node-fetch';


// import { hello } from './module.js';
// let val = hello();  // val is "Hello";
// console.log('module says ' + val);
// console.log('module says ' + hello());
// console.log(hello());
console.log('Print this after Hello World.');


//Set up mongoose connection
const mongoDB = 'mongodb+srv://cagross:blood74pen@cluster0-mycmk.mongodb.net/sp_back?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


console.log('Here is the output.');

//Define a schema.  
const Schema = mongoose.Schema;
//Create an instance of schema Schema.
const SomeModelSchema = new Schema({
	email: String,
});

// Compile model from schema object.
const SomeModel = mongoose.model('somemodel', SomeModelSchema );

// Create a new record in the database.  Create an instance of model SomeModel, and assign a value of 'cagross@gmail.com' to 'email'.
// var awesome_instance = new SomeModel({ email: 'cag8f@yahoo.com' });
// Save the new record in the database.  Save new model instance, with the new data, passing a call back
// awesome_instance.save(function (err) {
//   if (err) return handleError(err);
// });

// Search the model for a particular record.  findOne() will find one single record, and execute a call back function.
// SomeModel.findOne({ 'email': 'cagross@gmail.com' }, 'email', function (err, match) {
SomeModel.find({}, 'email', function (err, match) {

	if (err) {
		return console.log('error:  ' + err);
	} else {





		/* Begin code to fetch all weekly special data from the Giant Food API. */
		// const proxyURL = "https://cors-anywhere.herokuapp.com/";
		const proxyURL = '';

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
				// console.log(dataAll);
			
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
				console.log('fetched');
		// 		setData(dataMeatItems);//Assign this array (the array containing all desired items and information) to the value of the 'data' variable.
			})
		.catch(() => console.log("Message from Carl's code:  can’t access " + urlAPIData + " response. Possibly blocked by browser."));
		});
		/* End code to fetch API data. */



		// console.log(match);
		var len = match.length;
		for (let i = 0; i < len; i++) {
			console.log(len + ' ' + i + ' ' + match[i].email);
			main(match[i].email).catch(console.error);// If a match is found, execute the main() function, and pass to it the email address found in the database.
		}
		// main(match.email).catch(console.error);// If a match is found, execute the main() function, and pass to it the email address found in the database.
		mongoose.connection.close();

	}
})

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

// // Access model field values using dot notation
// // console.log(awesome_instance.email); //should log 'also_awesome'

// // Function to prepare an email and send it.
async function main(email) {// async..await is not allowed in global scope, must use a wrapper
// async function main() {// async..await is not allowed in global scope, must use a wrapper


	// console.log(email);
	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	// let testAccount = await nodemailer.createTestAccount();

	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		// host: 'smtp.dreamhost.com',
		// port: 465,
		// secure: true, // true for 465, false for other ports
		// auth: {
		// 	user: 'admin@kabultec.org',
		// 	pass: 'KQqDu_47EL'
		// }

		// host: 'mail.everlooksolutions.com',
		// host: 'everlooksolutions.com',
		host: 'sg2plcpnl0174.prod.sin2.secureserver.net',
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: 'cagross@everlooksolutions.com',
			pass: 'blood74pen'
		}

	});

	// send mail with defined transport object
	let info = await transporter.sendMail({
		// from: '"Carl Gross" <admin@kabultec.org>', // sender address
		// from: '"Carl Gross" <cagross@everlooksolutions.com>', // sender address
		from: '"Carl Gross" <cagross@gmail.com>', // sender address
		// to: 'cagross@gmail.com', // list of receivers
		to: email, // list of receivers
		subject: 'Testing messages', // Subject line
		text: 'Hello world?', // plain text body
		html: '<b>Hello world?</b>' // html body
	});
	console.log('Message sent: %s', info.messageId);
	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

}

// main().catch(console.error);
// main();

