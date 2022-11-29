/**
 * Module to create Mongoose schema.
 * @file
 * @module
 * @author Carl Gross
 */

import mongoose from "mongoose";

/**
 * Accepts an array of strings, each representing a field in the user database table. Returns new Mongoose schema based on those fields.
 *
 * @param {array} fields
 * @returns {object}
 */
export function createSchema(tblName, fields) {
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
    stores: {
      allFields: {
        storeNo: String,
        address1: String,
        city: String,
        state: String,
        zip: String,
      },
    },
  };

  if (!allFieldsTypes.hasOwnProperty(tblName))
    throw new Error(`${tblName} not defined in schema.`);

  const allFields = allFieldsTypes[tblName].allFields;
  const fieldsTypes = {};

  for (let property in allFields) {
    if (fields.some((element) => element === property))
      fieldsTypes[property] = allFields[property];
  }

  //Define a schema.
  const Schema = mongoose.Schema;

  return new Schema(fieldsTypes);
}
