/**
 * Sends an admin notification email when a new user registers.
 * @file
 * @module
 * @author Carl Gross
 */
import { sendMail } from "./module-send-mail.js";

export const registrationNotifier = {
  notify: async (email) => {
    await sendMail.sendMail(
      "Grocery Specials App: New User Registered",
      `A new user has registered on the Grocery Specials app.\n\nEmail: ${email}`,
      `<p>A new user has registered on the <strong>Grocery Specials</strong> app.</p><p>Email: <strong>${email}</strong></p>`,
      "cagross@everlooksolutions.com"
    );
  },
};
