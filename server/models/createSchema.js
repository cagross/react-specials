/**
 * Module to create Mongoose schema.
 * @file
 * @module
 * @author Carl Gross
 */

const mongoose = require("mongoose");

/**
 * Accepts an array of strings, each representing a field in the user database table. Returns new Mongoose schema based on those fields.
 *
 * @param {array} fields
 * @returns {object}
 */
exports.createSchema = function (tblName, fields) {
  console.log("Inside createSchema.");

  const allFieldsTypes = {
    users: {
      allFields: {
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
      },
    },
    items: {
      allFields: {
        storeCode: String,
        all_items: Object,
        dateSaved: Date,
      },
    },
  };

  const match = (element) => element === property;
  const allFields = allFieldsTypes[tblName].allFields;
  const fieldsTypes = {};
  for (property in allFields) {
    if (fields.some(match)) fieldsTypes[property] = allFields[property];
  }

  //Define a schema.
  const Schema = mongoose.Schema;

  return new Schema(fieldsTypes);
};
