/**
 * Module to create Mongoose model.
 * @file
 * @module
 * @author Carl Gross
 */

const mongoose = require("mongoose");
const config = require("../src/config/config.js").config;
const createSchema = require("./createSchema.js").createSchema;

/**
 *
 * @param {string} tbleName - String indicating which table in database to use for model. Must match the name of an existing table in database.
 * @param {String[]} fieldNames - Array containing name of each field present in the model.
 * @returns {Promise} - Promise object resolving to a new Mongoose model.
 */
exports.createModel = async function (tblName, fieldNames) {
  console.log("Inside createModel.");
  const SomeModelSchema = createSchema(tblName, fieldNames);
  const currConfig = config();
  const tableName = currConfig.tableNames[tblName].singName;

  mongoose.connect(currConfig.mongoDBUri, { useNewUrlParser: true });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));

  let TheModel3 =
    mongoose.models[tableName] || mongoose.model(tableName, SomeModelSchema);
  return TheModel3;
};
