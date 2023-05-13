/**
 * Module for notify system.
 * @file
 * @author Carl Gross
 */

import { apiModule } from "../../controllers/module-data.js";
import { filter } from "../src/module-filter.js";
import { priceFilter } from "../src/module-price-filter.js";
import { storeLoc } from "../src/module-store-location.js";
import { dispPrice } from "../src/module-display-price.js";
import * as createModelModule from "../../models/createModel.js";
import { sendMail } from "../../controllers/module-send-mail.js";
import { emailSubject } from "../../controllers/module-email-subject.js";

export const notificationModule = {
  /**
   * For each user in database, find all circular items which match user meat/threshold. If found, prepare and send email.
   *
   * @async
   * @returns undefined
   */
  main: async () => {
    /**
     * Accepts an array of objects representing circular items, and returns a string containing HTML markup of those items.
     * @param {Object[]} items - Array of circular items.
     * @returns {string}
     */
    const itemMarkup = (items) => {
      if (!items) return "";
      let markup = "";
      items.forEach((item) => {
        markup = markup.concat("<tr>");
        markup = markup.concat("<td>", item.display_name, "</td>");
        markup = markup.concat(
          "<td>",
          dispPrice(item.current_price, item.price_text),
          "</td>"
        );
        markup = markup.concat(
          "<td>",
          dispPrice(item.unit_price, "/lb"),
          "</td>"
        );
        markup = markup.concat("</tr>");
      });
      return markup;
    };

    const createModel = createModelModule.default.createModel;
    const circularItems = await apiModule.apiData("0233");

    const userModel = await createModel("users", [
      "name",
      "email",
      "meat",
      "th_price",
    ]);
    const users = await userModel.find();

    let myHtml;

    let storeMarkup = "";
    storeLoc.forEach((entry) => {
      storeMarkup = storeMarkup.concat(entry, "<br>");
    });

    for (let i = 0; i < users.length; i++) {
      const matchedItems = priceFilter(
        filter(users[i].meat, circularItems),
        users[i].th_price
      );

      // This section needs to be tidied up.  No time right now :-(
      myHtml = "Hi " + users[i].name + ",<br><br>";
      myHtml = myHtml.concat(
        "Based on your selection criteria, here are this week's matches." +
          "<br><br>"
      );
      myHtml = myHtml.concat("Your selection criteria is:  ");
      myHtml = myHtml.concat("<br>");
      myHtml = myHtml.concat("<i><bold>");
      myHtml = myHtml.concat("Meat Preference:  " + users[i].meat);
      myHtml = myHtml.concat("<br>");
      myHtml = myHtml.concat("Threshold Price:  " + users[i].th_price);
      myHtml = myHtml.concat("</bold></i>");
      myHtml = myHtml.concat("<br><br>");
      myHtml = myHtml.concat("The specials are available at this store:<br>");
      myHtml = myHtml.concat("<i><bold>");
      myHtml = myHtml.concat(storeMarkup);
      myHtml = myHtml.concat("</bold></i>");
      myHtml = myHtml.concat("<br><br>");
      myHtml = myHtml.concat("<table>");
      myHtml = myHtml.concat("<tr>");
      myHtml = myHtml.concat("<td>", "Item Name", "</td>");
      myHtml = myHtml.concat("<td>", "Item Price", "</td>");
      myHtml = myHtml.concat("<td>", "Item Unit Price", "</td>");
      myHtml = myHtml.concat("</tr>");
      myHtml = myHtml.concat(itemMarkup(matchedItems));
      myHtml = myHtml.concat("</table>");
      sendMail.sendMail(
        // `Grocery Specials For + ${circularItems[0].valid_from} - ${circularItems[0].valid_to}`,
        emailSubject(circularItems[0].valid_from, circularItems[0].valid_to),
        myHtml,
        myHtml,
        users[i].email
      );
    }
  },
};
