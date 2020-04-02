#! /usr/bin/env node

// const nodemailer = require('nodemailer');
// const mongoose = require('mongoose');
// const fetch = require('node-fetch');
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
// import fetch from 'node-fetch';

import { hello } from './src/module.js';

import { terms } from './src/module-terms.js';
const searchTerms = terms();


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
	name: String,
	email: String,
	meat: String,
	th_price: Number,
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
// SomeModel.find({}, 'email', function (err, match) {
SomeModel.find({}, 'name email meat th_price', function (err, match) {


	if (err) {
		return console.log('error:  ' + err);
	} else {


		(async () => {
			const data = await hello();
			// await hello();
			// console.log('data is: ' + data);
			
			console.log(Object.keys(data).length);
			console.log('Print this after data.');
		})();

		var len = match.length;
		for (let i = 0; i < len; i++) {
			// console.log(len + ' ' + i + ' ' + match[i].email);
			console.log(len + ' ' + i + ' ' + match[i].meat);

			// main(match[i].email).catch(console.error);// If a match is found, execute the main() function, and pass to it the email address found in the database.
		}
		mongoose.connection.close();

	}
})

// // Function to filter all data into items from specific departments, e.g. meat, deli, etc.
// function productFilter(dataItems, filter) {
// 	let myArray;

// 	let dataMeatItems = Object.keys(dataItems).filter(key => {
// 		switch (filter) {
// 			case 1:
// 				myArray = ['Meat', 'Deli'];
// 				if (myArray.includes(dataItems[key]["category_names"][0])) {
// 					return true;
// 				}
// 				break;
// 			default:
// 				return true;
// 			}
// 	});
// 	return dataMeatItems;
// }

// // Function to calculate the unit price of an item, and insert it into the main product array.
// function unitPrice(item) {
// 	/* Begin code to calculate unit price for each item and add it as a new element in the array. */
// 		const pos_lb = item['price_text'].search("lb");// Search the 'price text' of each item for 'lb.'

// 		if (pos_lb >= 0) {// If 'lb' occurs in the 'price text' of an item, then its 'current price' is already its unit price, so set it accordingly.
// 			item['unit_price'] = item['current_price'];
// 		} else {// If 'lb' does not occur in the 'price text' of an item, continue to determine the unit price using other methods.
// 			item['unit_price'] = 55.55;
// 			const patt_ea = /\/ea/;
// 			const has_ea = patt_ea.test(item['price_text']);// Check if the string 'ea' exists in the 'price text.'
// 			// If 'ea' occurs in the 'price text,' or the 'price text' is blank, then assume the price is per package, and run the following code which searches through the item 'description' to determine the weight of the package.
// 			if (has_ea || item['price_text'] === "") {

// 				if (item['description'] != null) {
// 					const pos_oz = item['description'].search(/oz\./i);// Search for the string 'oz' in the item 'description.'  Return the index in the string.

// 					if (pos_oz >= 0) {// If the string 'oz' appears in the item 'description,' run the following code to extract the weight of the item, in pounds.
// 						const partial_oz = item['description'].substring(0, pos_oz);
// 						const weight_oz = partial_oz.match(/[0-9]+/);
// 						item['unit_price'] = 16*item['current_price']/weight_oz;// Calculate the per pound unit price of the item, using the total price and weight in ounces.
// 					}
// 				}
// 			}
// 		}
// 	/* End code to calculate unit price for each item and add it as a new element in the array. */
// }

// // Access model field values using dot notation
// // console.log(awesome_instance.email); //should log 'also_awesome'

// // Function to prepare an email and send it.
async function main(email) {// async..await is not allowed in global scope, must use a wrapper

	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: 'sg2plcpnl0174.prod.sin2.secureserver.net',
		port: 465,
		secure: true,
		auth: {
			user: 'cagross@everlooksolutions.com',
			pass: 'blood74pen'
		}
	});

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"Carl Gross" <cagross@everlooksolutions.com>', // sender address
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

