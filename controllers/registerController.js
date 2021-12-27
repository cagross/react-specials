/**
 * Controller for /register POST route.
 * @file
 * @module
 * @author Carl Gross
 */

const { doSave } = require("./module-do-save.js");
const { saveToDb } = require("./module-save-to-db.js");
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

    doSave
      .doSave({ email: req.body.email }, "users")
      .then(() => {
        return bcrypt
          .hash(password, 10)
          .then((hash) => {
            console.log("Hash obtained.");
            return saveToDb(
              {
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
              },
              "users"
            )
              .then((result) => {
                if (result) {
                  return res.json(
                    `User registered with username ${email}, password ${password}, and has been hashed.`
                  );
                }
                return res.json(`3: Error saving: ${result}.`);
              })
              .catch((err) => {
                return res.json(`4: Error saving: ${err}.`);
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
  },
];
