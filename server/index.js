var server = require("./myApp");

var port = 5555;

server.listen(port, function () {
  console.log("Server running on port %d", port);
});
