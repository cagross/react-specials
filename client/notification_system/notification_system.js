#! /usr/bin/env node

/**
 * For each user in database, find all meat/threshold matches. If found, prepare and send email.
 * @file
 * @author Carl Gross
 */

import nodemailer from "nodemailer";
import mongoose from "mongoose";
import { apiData } from "../../controllers/module-data.js";
import { filter } from "../src/module-filter.js";
import { storeLoc } from "../src/module-store-location.js";
import { createModel } from "../../models/createModel.js";
import { config } from "../../src/config/config.js";

// Promise to fetch data from the API.
const promiseData = Promise.resolve(apiData());

// Promise to set up connection to database.
const promiseDbConnect = createModel("users", [
  "name",
  "email",
  "meat",
  "th_price",
]);

// Resolve all promises and run subsequent code.
Promise.all([promiseData, promiseDbConnect]).then(function (values) {
  const SomeModel = values[1];
  SomeModel.find({}, "name email meat th_price", function (err, match) {
    if (err) {
      return console.log("error:  " + err);
    } else {
      for (let i = 0; i < match.length; i++) {
        // Loop through every record in the database.
        const currMeat = match[i].meat || "";
        const propsy = { currMeat: currMeat, data: values[0] };
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

/**
 * Function to prepare an email and send it.
 *
 * @async
 * @param {string} email
 * @param {string} name
 * @param {string} meatPref
 * @param {number} thPrice
 * @param {Object[]} userArray
 */
async function main(email, name, meatPref, thPrice, userArray) {
  const currConfig = config();
  mongoose.connect(currConfig.mongoDBUri, { useNewUrlParser: true });
  // Create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.SP_EMAIL_USER ? process.env.SP_EMAIL_USER : "",
      pass: process.env.SP_EMAIL_PASS ? process.env.SP_EMAIL_PASS : "",
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
