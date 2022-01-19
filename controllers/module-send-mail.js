/**
 * @file
 * @module
 * @author Carl Gross
 */
import nodemailer from "nodemailer";

export const sendMail = {
  /**
   * Accepts email address, subject, and body, then creates and sends an email.
   * @param {string} subject - Subject of email.
   * @param {string} myText - Plain text body of eamil.
   * @param {string} myHtml - HTML body of email.
   * @param {string} email - Email address of recipient.
   */
  sendMail: (subject, myText, myHtml, email) => {
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
    transporter.sendMail(
      {
        from: '"Carl Gross" <cagross@gmail.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
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
          console.log("Error sending email:");
          console.log(err);
        }
      }
    );
  },
};
