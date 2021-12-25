/**
 * Main file for Express app. Defines port number, and begins listening.
 * @file
 * @module
 * @author Carl Gross
 */

var server = require("./expressApp");
var port = 5555;

server.listen(port, function () {
  console.log("Server running on port %d", port);
});
