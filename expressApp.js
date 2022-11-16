/**
 * Defines routes for Express app.
 * @file
 * @author Carl Gross
 */

import * as path from "path";
import express from "express";
import { v4 } from "uuid";
import session from "express-session";
import connect from "connect-mongodb-session";
import passport from "passport";
import passportLocal from "passport-local";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import createModelModule from "./models/createModel.js";
import * as registerController from "./controllers/registerController.js";
import { loginController } from "./controllers/loginController.js";
import { config } from "./src/config/config.js";
import * as itemsController from "./controllers/itemsController.js";
import { notificationModule } from "./client/notification_system/notification_system.js";

const __dirname = path.resolve();
const app = express();

const MongoDBStore = connect(session);

const LocalStrategy = passportLocal.Strategy;

const createModel = createModelModule.createModel;

const loginPost = loginController.loginPost;

// This function call contains a callback, which is called when a user sends a username/password to the POST /login route.
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    console.log("Inside local strategy callback.");

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
          console.log("Find method complete.");
          if (err) {
            mongoose.connection.close();
            return console.log("error:  " + err);
          } else {
            const isMatch = (element) => {
              return element.email === email;
            };
            const myIndex = match.findIndex(isMatch);
            if (myIndex > -1) {
              console.log("Local strategy returned true.");
              mongoose.connection.close();
              const user = match[myIndex];
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
        console.log("Error with local strategy:");
        console.log(err);
      });
  })
);

// Tell passport how to serialize the user.
// This function call defines a callback, which is called after the passport.use() call is successful, e.g. after passport.use() has confirmed the username/password corresponds to a valid user in the database.
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
      console.log("Error with deserialize user:");
      console.log(err);
    });
});

/* Begin middleware to ensure React app is served at root URL. */
app.use("/", (req, res, next) => {
  express.static(path.join(__dirname, "client", "build"))(req, res, next);
});
app.use(express.static("public"));
/* End middleware to ensure React app is served at root URL. */

const currConfig = config();
const myMongoStore = new MongoDBStore({
  uri: currConfig.mongoDBUri,
  databaseName: currConfig.sessionStoreDbName,
  collection: currConfig.sessionStoreCollName,
});
myMongoStore.on("error", function (error) {
  console.log("Error with MongoDBStore:");
  console.log(error);
});
// This function call creates a new session, with a unique session ID, and stores it in the session store (created above).
app.use(
  session({
    genid: (req) => {
      return v4(); // Use UUIDs for session IDs
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

app.post("/items", express.json(), itemsController.items_post);

app.get("/login", (req, res) => {
  console.log("Inside GET /login callback function");
  res.send(`You got the login page!\n`);
});
app.post("/login", express.json(), (req, res, next) => {
  loginPost(req, res, next);
});
app.get("/profile", (req, res) => {
  console.log("Inside GET /profile callback");
  console.log(`User authenticated? ${req.isAuthenticated()}`);
  if (req.isAuthenticated()) {
    res.send("You hit the authentication endpoint.");
  } else {
    const baseUrl = `${req.protocol}://${req.headers.host}`;
    const myURL = new URL(baseUrl);
    res.send(`You are not logged in. Please login at: ${myURL.href}login/.`);
  }
});
app.get("/checkauth", (req, res) => {
  console.log("Inside GET /checkauth callback");
  if (req.isAuthenticated()) {
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
  express.static(path.join(__dirname, "routes", "register"))(req, res, next);
});

app.get("/register", (req, res) => {
  console.log("Inside GET /register callback function");
  res.sendFile(path.join(__dirname, "routes", "register", "register.html"));
});

app.post("/register", express.json(), registerController.register_post);

export default {
  app,
};
