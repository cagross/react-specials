/**
 * Module for notify system.
 * @file
 * @author Carl Gross
 */

import { apiModule } from "../../controllers/module-data.js";
import { filter } from "../src/module-filter.js";
import { priceFilter } from "../src/module-price-filter.js";
import { storeLoc } from "../src/module-store-location.js";
import * as createModelModule from "../../models/createModel.js";
import { sendMail } from "../../controllers/module-send-mail.js";

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
          Number(item.current_price).toFixed(2),
          item.price_text,
          "</td>"
        );
        markup = markup.concat(
          "<td>",
          Number(item.unit_price).toFixed(2),
          "/lb",
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
        `Grocery Specials For + ${circularItems[0].valid_from} - ${circularItems[0].valid_to}`,
        myHtml,
        myHtml,
        users[i].email
      );
    }
  },

  /**
   * Compare two datetime objects.
   * Return true if any  of the following are met:
   * --The first date is on a Sunday and the second date is null/undefined.
   * --The first date is on a Sunday and the first date is more than one day after the second date.
   * Return false otherwise.
   * @param {object} date1 - Datetime object representing current date.
   * @param {object} date2 - Datetime object representing previous date.
   * @returns {boolean}
   */
  shouldIRun: (date1, date2) => {
    console.log(`${new Date()} Checking shouldIRun...`);
    if (date1.getDay() !== 0) return false;
    if (!date2) return true;
    if (date1 - date2 > 86400000) return true; // 1 day = 86400000 ms
    return false;
  },

  /**
   * Check if the notification system should be run.  Check occurs once per hour.
   * Note: This is not the most rock solid scheduler ever.  For example, if there is an outage all day Sunday, this scheduler will not auto-resume when the system comes back online on Monday.  It will resume the following Sunday.
   * Note: There could be a memory leak associated with this type of setInterval usage. The following link alludes to one, but I did not confirm whether it applied in this case (https://javascript.info/settimeout-setinterval).
   */
  scheduler: () => {
    let dateOfLastExecution;
    setInterval(() => {
      const dateCurrent = new Date();
      if (!notificationModule.shouldIRun(dateCurrent, dateOfLastExecution))
        return;
      console.log("Starting notification system.");
      notificationModule.main();
      dateOfLastExecution = dateCurrent;
    }, 3600000); //1 hour = 3600000 ms
  },
};
