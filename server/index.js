const path = require("path");
const express = require("express");
const app = express(); // create express app

// add middlewaree
/* Begin middleware to ensure React app is served at localhost:5555 and all subdirectories. */
app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.use(express.static("public"));
/* Ensure a route to any path serves my React app.*/
// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
// });
/* End middleware to ensure React app is served at localhost:5555 and all subdirectories. */

console.log(555);
console.log(path.join(__dirname, "..", "client", "public"));

// Create the /register route.
app.use(express.json());
// app.post("/register", (req, res) => {
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  // res.json("register response");
});
// app.post("/login", (req, res) => {
//   res.json("login");
// });
// app.post("/profile", (req, res) => {
//   res.json("profile");
// });

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// app.get("/", (req, res) => {
//   res.send("This is from express.js");
// });

// start express server on port 5555
app.listen(5555, () => {
  console.log("server started on port 5555");
});
