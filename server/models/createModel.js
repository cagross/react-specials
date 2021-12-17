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
 * @param {String[]} theFields - Array containing name of each field present in the model.
 * @returns {Promise} - Promise object resolving to a new Mongoose model.
 */
exports.createModel = function (theFields) {
  console.log("Inside createModel.");

  const myFields = theFields;
  const SomeModelSchema = createSchema(myFields);
  const currConfig = config();
  const modelName = currConfig.modelName;

  return new Promise(function (resolve, reject) {
    mongoose.connect(currConfig.mongoDBUri, { useNewUrlParser: true });

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));

    let TheModel3 =
      mongoose.models[modelName] || mongoose.model(modelName, SomeModelSchema);
    resolve(TheModel3);
  });
};
