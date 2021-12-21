/**
 * Controller for /register POST route.
 * @file
 * @module
 * @author Carl Gross
 */

const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

const createModelModule = require("../models/createModel.js");
const createModel = createModelModule.createModel;

exports.register_post = [
  body("email", "Escaped characters.").escape(),
  body("password", "Escaped characters.").escape(),
  body("firstName", "Escaped characters.").escape(),
  body("lastName", "Escaped characters.").escape(),
  body("meatPref", "Escaped characters.").escape(),
  body("price", "Escaped characters.").escape(),

  /**
   * Accepts an email/password sent in a network request, and adds a new record to the database with this data as the username/password.
   * @param {object} req - Request object.
   * @param {object} res - Result object.
   */
  function (req, res) {
    console.log("Inside registerController.");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    let myUser;

    createModel("users", [
      "name",
      "email",
      "meat",
      "th_price",
      "password",
      "host",
      "origin",
      "referer",
      "platform",
      "userAgent",
      "dateCreated",
    ]).then((myModel) => {
      myModel
        .findOne({ email: req.body.email })
        .then((result) => {
          console.log("Database search for email address complete.");
          if (result) {
            // User already exists in database. Optional redirect to proper page.
            console.log("Email address already exists in database.");
            return res.json(`Email address already in-use.`);
            //  res.redirect(result.url);
          }
          console.log(
            "Email address does not already exist in database. Hashing password and saving new document to database..."
          );
          return bcrypt
            .hash(password, 10)
            .then((hash) => {
              console.log("Hash obtained.");
              myUser = new myModel({
                email: req.body.email,
                password: hash,
                meat: req.body.meatPref,
                th_price: req.body.price,
                name: req.body.firstName + " " + req.body.lastName,
                host: req.headers.host || "not provided",
                origin: req.headers.origin || "not provided",
                referer: req.headers.referer || "not provided",
                platform: req.headers["sec-ch-ua-platform"] || "not provided",
                userAgent: req.headers["user-agent"] || "not provided",
                dateCreated: new Date(),
              });
              return myUser.save(function (err) {
                if (err) {
                  console.log("Error saving new user to database.");
                  return res.json("Error creating user.");
                }
                // Password saved. Optional redirect to proper page.
                return res.json(
                  `User registered with username ${email}, password ${password}, and has been hashed.`
                );
                //  res.redirect(SomeModelSchema.url);
              });
            })
            .catch((err) => {
              console.log("Error with hashing.");
              if (err) {
                console.log(err);
                return res.status(400).json({ error: err });
              }
            });
        })
        .catch((err) => {
          console.log("Error somewhere.");
          if (err) {
            console.log(err);
            return res.status(400).json({ error: err });
          }
        });
    });
  },
];
