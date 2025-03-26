/**
 * Controller for /items GET route.
 * @file
 * @module
 * @author Carl Gross
 */

import { body, validationResult } from "express-validator";
import { dataAll } from "./module-data-all.js";

export const items_post = [
  body("zip", "Escaped characters.").escape(),
  body("radius", "Escaped characters.").escape(),

  /**
   * Accepts a network request object and response object.
   * From request object extracts zip/radius search parameters, executes a store search, and obtains store circular items.
   * From response object sends results back to browser.
   * @async
   * @param {object} req - Request object.
   * @param {object} res - Result object.
   */
  async function (req, res) {
    console.log("Inside itemsController.");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const result = await dataAll.dataAll(req.body.zip, req.body.radius);

    // As of 14/8/22, an error 204 is returned by Giant Food store search API is zero stores are found.
    if (result?.error && result.error !== 204) return res.send({ error: true });
    if (result?.status === 204 || (result && Object.keys(result).length === 0))
      return res.status(204).send();
    return res.send(result);
  },
];
