/**
 * @file
 * @module
 * @author Carl Gross
 */
const createModel = require("../models/createModel");
const config = require("../src/config/config.js").config;

exports.doSave = {
  /**
   * Determines if data is already in database or not.
   * @param {object} data - Data.
   * @param {string} tbleName - Name of database table.
   * @returns {boolean}
   */
  doSave: async (data, tbleName) => {
    console.log("Inside doSave");

    const currConfig = config();
    const myModel = await createModel.createModel(
      tbleName,
      currConfig.tableNames[tbleName].fields
    );

    /**
     * Accepts an object, and a starting value as params. Returns an object with property names in the format required by the [Mongoose save method](https://docs.mongodb.com/manual/tutorial/query-embedded-documents/#query-on-nested-field).
     * @param {object} obj
     * @param {object} prev
     * @returns {object}
     */
    function printObj(obj, prev) {
      for (let key in obj) {
        let value = obj[key];

        if (typeof value === "object" && !(value instanceof Date)) {
          finalKey = prev ? `${prev}.${key}` : `${key}`;
          printObj(value, finalKey);
        } else {
          finalKey = prev ? `${prev}.${key}` : `${key}`;
          myObj[`${finalKey}`] = value;
        }
      }
      return myObj;
    }
    const myObj = {};
    const findOneParam = printObj(data, undefined);

    return myModel
      .findOne(findOneParam)
      .then((res) => {
        if (res) {
          console.log("Data already saved in DB.");
          return false;
        }
        console.log("Data not found in DB.");
        return true;
      })
      .catch((err) => {
        console.log("Error searching database.");
        console.log(err);
        return false;
      });
  },
};
