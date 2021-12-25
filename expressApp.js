/**
 * Defines routes for Express app.
 * @file
 * @author Carl Gross
 */

const path = require("path");
const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const myModule = require("./models/createModel.js");
const createModel = myModule.createModel;
const config = require("./src/config/config.js").config;
const registerController = require("./controllers/registerController");
const apiData = require("./controllers/module-data.js");
const fetchData = apiData.apiData;

//This function call contains a callback, which is called when a user sends a username/password via POST to the login route.
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    console.log("Inside local strategy callback");

    const promiseDbConnect = createModel("users", [
      "name",
      "email",
      "meat",
      "th_price",
      "password",
    ]);

    Promise.all([promiseDbConnect])
      .then(function (values) {
        return values[0];
      })
      .then((myModel) => {
        myModel.find({}, function (err, match) {
          console.log("Inside local strategy callback.");
          if (err) {
            mongoose.connection.close();
            return console.log("error:  " + err);
          } else {
            console.log(
              `match is of type: ${typeof match} with length ${match.length}`
            );
            const isMatch = (element) => {
              return element.email === email;
            };
            const myIndex = match.findIndex(isMatch);
            if (myIndex > -1) {
              console.log("Local strategy returned true. User object is:");
              console.log(match[myIndex]);
              mongoose.connection.close();
              const user = match[myIndex];
              console.log(`password: ${password}`);
              console.log(`user.password: ${user.password}`);
              if (!bcrypt.compareSync(password, user.password)) {
                console.log("Incorrect password for that user.");
                return done(null, false, {
                  message: "Invalid username/password combination.",
                });
              }
              mongoose.connection.close();
              return done(null, user);
            } else {
              mongoose.connection.close();
              console.log("No user found.");
              return done(null, false, {
                message: "Invalid username/password combination.",
              });
            }
          }
        });
      })
      .catch((err) => {
        console.log(123);
        console.log(err);
      });
  })
);

// Tell passport how to serialize the user.
// This function call defines a callback, which is called after the passport.use() call is successful, i.e. after passport.use() has confirmed the username/password corresponds to a valid user in the database.
// The callback serializes the user's database ID, and then passes it to the next function.

passport.serializeUser((user, done) => {
  console.log(
    "Inside serializeUser callback. User id is saved to the session file store here."
  );
  done(null, user.id);
});

// This function call defines a callback, which is called after the user has already successfully logged in, left the page, and sent a new HTTP request to a route requiring authentication. The session store is then checked to see if it contains the session ID of the HTTP request. If yes, the corresponding user ID is passed to the callback defined below. The callback uses the user ID to lookup the user's data from the user table, then passes it to the next function.
passport.deserializeUser((id, done) => {
  console.log("Inside deserializeUser callback");
  console.log(`The user id passport saved in the session file store is: ${id}`);

  const promiseDbConnect = createModel("users", [
    "name",
    "email",
    "meat",
    "th_price",
    "password",
  ]);

  Promise.all([promiseDbConnect])
    .then(function (values) {
      return values[0];
    })
    .then((myModel) => {
      myModel.find({}, function (err, match) {
        console.log("Inside deserialize user find callback.");
        console.log(
          `match is of type: ${typeof match} with length ${match.length}`
        );

        if (err) {
          mongoose.connection.close();
          return console.log("error:  " + err);
        } else {
          const isMatch = (element) => {
            return element.id === id;
          };
          const myIndex = match.findIndex(isMatch);
          let myUser;
          if (myIndex > -1) {
            console.log("Local strategy returned true. User object is:");
            console.log(match[myIndex]);
            mongoose.connection.close();
            myUser = match[myIndex];
            return done(null, myUser);
          } else {
            myUser = false;
          }
          mongoose.connection.close();
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

/* Begin middleware to ensure React app is served at localhost:5555 and all subdirectories. */
app.use("/", (req, res, next) => {
  express.static(path.join(__dirname, "client", "build"))(req, res, next);
});
app.use(express.static("public"));
/* End middleware to ensure React app is served at localhost:5555 and all subdirectories. */

const currConfig = config();
const myMongoStore = new MongoDBStore({
  uri: currConfig.mongoDBUri,
  databaseName: currConfig.sessionStoreDbName,
  collection: currConfig.sessionStoreCollName,
});
myMongoStore.on("error", function (error) {
  console.log("error 2");
  console.log(error);
});
// Add & configure session middleware.
// This function call creates a new session, with a unique session ID, and stores it in the session store (created above).
app.use(
  session({
    genid: (req) => {
      console.log("Inside the session middleware");
      console.log(req.sessionID);
      return uuidv4(); // use UUIDs for session IDs
    },
    store: myMongoStore,
    secret: currConfig.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);
//Begin using Passport.
app.use(passport.initialize());
app.use(passport.session());

app.get("/items", async (req, res) => {
  console.log("Inside GET /items callback function");
  res.send(await fetchData());
});

// create the login get and post routes
app.get("/login", (req, res) => {
  console.log("Inside GET /login callback function");
  console.log("req.sessionID");

  console.log(req.sessionID);
  res.send(`You got the login page!\n`);
});
app.post("/login", express.json(), (req, res, next) => {
  console.log("Inside POST /login callback");
  console.log(req.body);
  passport.authenticate("local", (err, user, info) => {
    console.log("Inside passport.authenticate() callback");
    console.log(
      `req.session.passport: ${JSON.stringify(req.session.passport)}`
    );
    console.log(`req.user: ${JSON.stringify(req.user)}`);
    if (info) return res.send(info.message);
    if (err) return next(err);
    // if (!user) return res.redirect("/login");
    if (!user)
      return res
        .status(400)
        .json({ error: "Invalid username/password combination." });

    req.login(user, (err) => {
      console.log("Inside req.login() callback");
      console.log(
        `req.session.passport: ${JSON.stringify(req.session.passport)}`
      );
      console.log(`req.user: ${JSON.stringify(req.user)}`);
      if (err) {
        return next(err);
      }
      // return res.send("You were authenticated & logged in!");
      return res.json({
        userAuth: true,
      });
    });
  })(req, res, next);
});
app.get("/profile", (req, res) => {
  console.log("Inside GET /profile callback");
  console.log(`User authenticated? ${req.isAuthenticated()}`);
  if (req.isAuthenticated()) {
    res.send(`
      You hit the authentication endpoint.\n
      Your username is: ${req.user.email}.  
      `);
  } else {
    const baseUrl = `${req.protocol}://${req.headers.host}`;
    const myURL = new URL(baseUrl);
    res.send(`You are not logged in. Please login at: ${myURL.href}login/.`);
  }
});
app.get("/checkauth", (req, res) => {
  console.log("Inside GET /checkauth callback");
  console.log(`User authenticated? ${req.isAuthenticated()}`);
  if (req.isAuthenticated()) {
    // res.send(`
    //   You hit the authentication endpoint.\n
    //   Your username is: ${req.user.email}.
    //   `);
    // res.send(555);
    res.json({
      user: {
        name: req.user.name,
        email: req.user.email,
        meat: req.user.meat,
        th_price: req.user.th_price,
      },
    });
  } else {
    // const baseUrl = `${req.protocol}://${req.headers.host}`;
    // const myURL = new URL(baseUrl);
    // res.send(`You are not logged in. Please login at: ${myURL.href}login/.`);
    res.json({});
  }
});

app.use("/register", (req, res, next) => {
  // express.static(path.join(__dirname, "..", "server", "routes", "register"))(
  console.log(111);
  console.log(__dirname);
  express.static(path.join(__dirname, "routes", "register"))(req, res, next);
});

app.get("/register", (req, res) => {
  console.log("Inside GET /register callback function");
  console.log("req.sessionID");
  console.log(req.sessionID);
  res.sendFile(path.join(__dirname, "routes", "register", "register.html"));
});

app.post("/register", express.json(), registerController.register_post);

module.exports = app;
