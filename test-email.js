#! /usr/bin/env node

// const nodemailer = require('nodemailer');
// const mongoose = require('mongoose');
// const fetch = require('node-fetch');
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
// import fetch from 'node-fetch';

import { hello } from './src/module.js';
// import { terms } from './src/module-terms.js';
import { filter } from './src/module-filter.js';
// const searchTerms = terms();

// let data;

(async () => {
	const data = await hello();
	// data = await hello();

	console.log(Object.keys(data).length);
	console.log('Print this after data.');
})();

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

SomeModel.find({}, 'name email meat th_price', function (err, match) {

	if (err) {
		return console.log('error:  ' + err);
	} else {


		var len = match.length;
		for (let i = 0; i < len; i++) {
			// console.log(len + ' ' + i + ' ' + match[i].email);
			console.log(len + ' ' + i + ' ' + match[i].meat);
			// main(match[i].email).catch(console.error);// If a match is found, execute the main() function, and pass to it the email address found in the database.
		}
		mongoose.connection.close();

	}
})

// Function to prepare an email and send it.
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




