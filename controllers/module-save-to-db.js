/**
 * @file
 * @module
 * @author Carl Gross
 */

import createModel from "../models/createModel.js";
import { config } from "../src/config/config.js";

export const saveToDb = {
  /**
   * Saves data to database.
   * @param {object} dataToSave - Data to save.
   * @param {string} tbleName - Name of database table.
   * @returns {boolean}
   */
  saveToDb: async (dataToSave, tbleName) => {
    console.log("Inside saveToDb");
    const currConfig = config();
    const fields = currConfig.tableNames[tbleName].fields;

    const myModel = await createModel.createModel(tbleName, fields);

    const myModelParam = {};
    for (let i = 0; i < fields.length; i++) {
      const element = fields[i];
      myModelParam[`${element}`] = dataToSave[`${element}`];
    }
    myModelParam.dateSaved = new Date();

    const modInst = new myModel(myModelParam);
    try {
      console.log("Saving one circular to db.");
      const saveRes = (await modInst.save()) || {};
      //Return true if save completed successfully.
      if (saveRes === modInst) {
        console.log("Save succesful.");
        return true;
      }
      console.log("Save unsuccesful.");
      return false;
    } catch (error) {
      console.log("Error saving with save method:");
      console.log(error);
      return false;
    }
  },
};
