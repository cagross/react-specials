#! /usr/bin/env node

// const nodemailer = require('nodemailer');
// const mongoose = require('mongoose');
// const fetch = require('node-fetch');
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

import { hello } from './src/module.js';
import { filter } from './src/module-filter.js';

/* Replace this static string with a string created from the start/end dates that are present in the array returned after filtering items by the user's preferred meat. */
const dates = 'Friday, April 3 - Thursday, April 9';


const promise1 = Promise.resolve(hello());

const promise2 = new Promise(function(resolve, reject) {
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
	// const SomeModel = mongoose.model('somemodel', SomeModelSchema );
	let SomeModel = mongoose.model('somemodel', SomeModelSchema );

	resolve(SomeModel);

});


Promise.all([promise1, promise2]).then(function(values) {
	console.log(Object.keys(values[0]).length);
	const SomeModel = values[1];

	SomeModel.find({}, 'name email meat th_price', function (err, match) {

		if (err) {
			return console.log('error:  ' + err);
		} else {
	
	
			var len = match.length;
			// for (let i = 0; i < len; i++) {
			for (let i = 0; i < 1; i++) {
				console.log(len + ' ' + i + ' ' + match[i].email);
				main(match[i].email, match[i].name, match[i].meat, match[i].th_price, dates).catch(console.error);// If a match is found, execute the main() function, and pass to it the email address found in the database.
			}
			mongoose.connection.close();
	
		}
	})
});

// Function to prepare an email and send it.
async function main(email, name, meatPref, thPrice, dates) {// async..await is not allowed in global scope, must use a wrapper

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


	const storeLoc = [
		'Giant Food',
		'7235 Arlington Blvd',
		'Falls Church, VA 22042'
	]

	let myHtml;
	myHtml = 'Hi ' + name + ',<br><br>';
	myHtml = myHtml.concat("Based on your selection criteria, we've found some matches this week." + '<br><br>');

	myHtml = myHtml.concat('Your selection criteria is:  ');
	myHtml = myHtml.concat('<br>');
	myHtml = myHtml.concat('Meat Preference:  ' + meatPref);
	myHtml = myHtml.concat('<br>');
	myHtml = myHtml.concat('Threshold Price:  ' + thPrice);
	myHtml = myHtml.concat('<br><br>');
	
	myHtml = myHtml.concat('The specials are available at this store:<br>');
	storeLoc.forEach(entry => {
		myHtml = myHtml.concat('<br>', entry);
	});
	
	myHtml = myHtml.concat('<br><br>');

	/* Replace this static array with the array returned after filtering items by the user's preferred meat. */
	const userResults = [
		{name:"John", age:33, eyeColor:"blue"},
		{name:"Rick", age:44, eyeColor:"green"},
		{name:"Tom", age:55, eyeColor:"red"}
	];

	userResults.forEach(item => {
		myHtml = myHtml.concat('<br>', item.name);
	});

	const myText = myHtml;

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"Carl Gross" <cagross@everlooksolutions.com>', // sender address
		to: email, // list of receivers
		subject: 'Specials For ' + dates, // Subject line
		text: myText, // plain text body
		html: myHtml // html body
	});
	console.log('Message sent: %s', info.messageId);
	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

