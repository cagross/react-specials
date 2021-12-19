/**
 * Module to create Mongoose schema.
 * @file
 * @module
 * @author Carl Gross
 */

const mongoose = require("mongoose");

const allFieldsTypes = {
  name: String,
  email: String,
  meat: String,
  th_price: Number,
  password: String,
  host: String,
  origin: String,
  referer: String,
  platform: String,
  userAgent: String,
  dateCreated: Date,
};

const match = (element) => element === property;

/**
 * Accepts an array of strings, each representing a field in the user database table. Returns new Mongoose schema based on those fields.
 *
 * @param {array} fields
 * @returns {object}
 */
exports.createSchema = function (fields) {
  console.log("Inside createSchema.");
  const fieldsTypes = {};
  for (property in allFieldsTypes) {
    if (fields.some(match)) fieldsTypes[property] = allFieldsTypes[property];
  }

  //Define a schema.
  const Schema = mongoose.Schema;

  return new Schema(fieldsTypes);
};
