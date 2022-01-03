/**
 * Module to create Mongoose model.
 * @file
 * @module
 * @author Carl Gross
 */

import mongoose from "mongoose";
import { config } from "../src/config/config.js";
import { createSchema } from "./createSchema.js";

/**
 *
 * @param {string} tbleName - String indicating which table in database to use for model. Must match the name of an existing table in database.
 * @param {String[]} fieldNames - Array containing name of each field present in the model.
 * @returns {Promise} - Promise object resolving to a new Mongoose model.
 */
export default {
  createModel: (tblName, fieldNames) => {
    console.log("Inside createModel.");
    const SomeModelSchema = createSchema(tblName, fieldNames);
    const currConfig = config();
    const tableName = currConfig.tableNames[tblName].singName;

    const db = mongoose.connection;
    db.on("open", () => console.log("MongoDB connection open"));
    db.on("error", console.error.bind(console, "MongoDB connection error:"));

    return mongoose
      .connect(currConfig.mongoDBUri, { useNewUrlParser: true })
      .then(() => {
        let TheModel3 =
          mongoose.models[tableName] ||
          mongoose.model(tableName, SomeModelSchema);
        return TheModel3;
      })
      .catch((err) => {
        console.log("Error creating model.");
        console.log(err);
      });
  },
};
