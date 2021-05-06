#! /usr/bin/env node

import nodemailer from "nodemailer";
import mongoose from "mongoose";
import { apiData } from "../src/module-data.js";
import { filter } from "../src/module-filter.js";
import { storeLoc } from "../src/module-store-location.js";

// Fetch data from the API.
const promiseData = Promise.resolve(apiData());

// Set up connection to database.
const promiseDbConnect = new Promise(function (resolve, reject) {
  let dbUserName, dbUserPass;
  if (process.env.SP_DB_USER) {
    dbUserName = process.env.SP_DB_USER;
  } else {
    dbUserName = "";
  }
  if (process.env.SP_DB_PASS) {
    dbUserPass = process.env.SP_DB_PASS;
  } else {
    dbUserPass = "";
  }

  const mongoDB =
    "mongodb+srv://" +
    process.env.SP_DB_USER +
    ":" +
    process.env.SP_DB_PASS +
    "@cluster0-mycmk.mongodb.net/sp_back?retryWrites=true&w=majority";

  mongoose.connect(mongoDB, { useNewUrlParser: true });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));

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
  let SomeModel = mongoose.model("somemodel", SomeModelSchema);

  resolve(SomeModel);
});

// Code to run when both API data has been fetched, and database connection has been made.
Promise.all([promiseData, promiseDbConnect]).then(function (values) {
  const SomeModel = values[1];
  SomeModel.find({}, "name email meat th_price", function (err, match) {
    if (err) {
      return console.log("error:  " + err);
    } else {
      for (let i = 0; i < match.length; i++) {
        // Loop through every record in the database.
        const propsy = { currMeat: match[i].meat, data: values[0] };
        const meatTest = filter(propsy);
        main(
          match[i].email,
          match[i].name,
          match[i].meat,
          match[i].th_price,
          meatTest
        ).catch(console.error); // Call main() to send an email of items to the user found in the database record.
      }
      mongoose.connection.close();
    }
  });
});

// Function to prepare an email and send it.
async function main(email, name, meatPref, thPrice, userArray) {
  let userName, userPass;
  if (process.env.SP_EMAIL_USER) {
    userName = process.env.SP_EMAIL_USER;
  } else {
    userName = "";
  }
  if (process.env.SP_EMAIL_PASS) {
    userPass = process.env.SP_EMAIL_PASS;
  } else {
    userPass = "";
  }
  // Create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: userName,
      pass: userPass,
    },
    debug: true, // show debug output
    logger: true, // log information in console
  });

  // This section needs to be cleaned up.  No time right now :-(
  let myHtml;
  myHtml = "Hi " + name + ",<br><br>";
  myHtml = myHtml.concat(
    "Based on your selection criteria, we've found some matches this week." +
      "<br><br>"
  );

  myHtml = myHtml.concat("Your selection criteria is:  ");
  myHtml = myHtml.concat("<br>");
  myHtml = myHtml.concat("<i><bold>");
  myHtml = myHtml.concat("Meat Preference:  " + meatPref);
  myHtml = myHtml.concat("<br>");
  myHtml = myHtml.concat("Threshold Price:  " + thPrice);
  myHtml = myHtml.concat("</bold></i>");
  myHtml = myHtml.concat("<br><br>");

  myHtml = myHtml.concat("The specials are available at this store:<br>");
  myHtml = myHtml.concat("<i><bold>");
  storeLoc.forEach((entry) => {
    myHtml = myHtml.concat(entry, "<br>");
  });
  myHtml = myHtml.concat("</bold></i>");

  myHtml = myHtml.concat("<br><br>");

  const userResults = userArray;

  myHtml = myHtml.concat("<table>");
  myHtml = myHtml.concat("<tr>");
  myHtml = myHtml.concat("<td>", "Item Name", "</td>");
  myHtml = myHtml.concat("<td>", "Item Price", "</td>");
  myHtml = myHtml.concat("<td>", "Item Unit Price", "</td>");
  myHtml = myHtml.concat("</tr>");

  userResults.forEach((item) => {
    myHtml = myHtml.concat("<tr>");
    myHtml = myHtml.concat("<td>", item.name, "</td>");
    myHtml = myHtml.concat(
      "<td>",
      Number(item.current_price).toFixed(2),
      item.price_text,
      "</td>"
    );
    myHtml = myHtml.concat(
      "<td>",
      Number(item.unit_price).toFixed(2),
      "/lb",
      "</td>"
    );
    myHtml = myHtml.concat("</tr>");
  });
  myHtml = myHtml.concat("</table>");

  const myText = myHtml;
  const dates = userResults[0].valid_from + "-" + userResults[0].valid_to;

  transporter.sendMail(
    {
      from: '"Carl Gross" <cagross@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Grocery Specials For " + dates, // Subject line
      text: myText, // plain text body
      html: myHtml, // html body
    },
    (err, info) => {
      if (info) {
        console.log("envelope is:");
        console.log(info.envelope);
        console.log("messageID is:");
        console.log(info.messageId);
      } else {
        console.log("err is:");
        console.log(err);
      }
    }
  );
}
