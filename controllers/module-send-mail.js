/**
 * @file
 * @module
 * @author Carl Gross
 */
import nodemailer from "nodemailer";

export const sendMail = {
  /**
   * Accepts email address, subject, and body, then creates and sends an email.
   * @async
   * @param {string} subject - Subject of email.
   * @param {string} myText - Plain text body of eamil.
   * @param {string} myHtml - HTML body of email.
   * @param {string} email - Email address of recipient.
   * @returns {Promise<void>}
   */
  sendMail: async (subject, myText, myHtml, email) => {
    console.log("Inside sendMail.");
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
    try {
      const info = await transporter.sendMail({
        from: '"Carl Gross" <cagross@gmail.com>',
        to: email,
        subject: subject,
        text: myText,
        html: myHtml,
      });
      console.log("envelope is:");
      console.log(info.envelope);
      console.log("messageID is:");
      console.log(info.messageId);
    } catch (err) {
      console.log("Error sending email:");
      console.log(err);
    }
  },
};
