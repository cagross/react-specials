/**
 * Main file for Express app. Defines port number, and begins listening.
 * @file
 * @module
 * @author Carl Gross
 */

import app from "./expressApp.js";
const server = app.app;

var port = process.env.PORT || 5555;

server.listen(port, function () {
  console.log("Server running on port %d", port);
});
