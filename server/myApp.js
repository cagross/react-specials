const path = require("path");
const express = require("express");
const app = express(); // create express app
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const myModule = require("./myModule.js");
const createModel = myModule.createModel;

//Define a schema.
const Schema = mongoose.Schema;
//Create an instance of schema Schema.
const SomeModelSchema = new Schema({
  name: String,
  email: String,
  meat: String,
  th_price: Number,
  password: String,
});

//This function call contains a callback, which is called when a user sends a username/password via POST to the login route.
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    console.log("Inside local strategy callback");

    const promiseDbConnect = new Promise(function (resolve, reject) {
      let dbUserName, dbUserPass;
      if (process.env.SP_DB_USER) {
        dbUserName = process.env.SP_DB_USER;
      } else {
        dbUserName = "";
      }
      if (process.env.SP_DB_PASS) {
        dbUserPass = process.env.SP_DB_PASS;
      } else {
        dbUserPass = "";
      }

      const mongoDB =
        "mongodb+srv://" +
        process.env.SP_DB_USER +
        ":" +
        process.env.SP_DB_PASS +
        "@cluster0-mycmk.mongodb.net/sp_back?retryWrites=true&w=majority";

      mongoose.connect(mongoDB, { useNewUrlParser: true });
      const db = mongoose.connection;
      db.on("error", console.error.bind(console, "MongoDB connection error:"));
      console.log("Before TheModel");
      let TheModel =
        mongoose.models.TheModel ||
        mongoose.model("somemodel", SomeModelSchema);

      resolve(TheModel);
    });

    Promise.all([promiseDbConnect]).then(function (values) {
      const myModel = values[0];

      myModel.find({}, function (err, match) {
        console.log("inside find callback.");
        console.log(
          `match is of type: ${typeof match} with length ${match.length}`
        );
        if (err) {
          mongoose.connection.close();
          return console.log("error:  " + err);
        } else {
          const isMatch = (element) => {
            // return element.email === email && element.password === password;
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
          // mongoose.connection.close();
        }
      });
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

  const promiseDbConnect = new Promise(function (resolve, reject) {
    let dbUserName, dbUserPass;
    if (process.env.SP_DB_USER) {
      dbUserName = process.env.SP_DB_USER;
    } else {
      dbUserName = "";
    }
    if (process.env.SP_DB_PASS) {
      dbUserPass = process.env.SP_DB_PASS;
    } else {
      dbUserPass = "";
    }

    const mongoDB =
      "mongodb+srv://" +
      process.env.SP_DB_USER +
      ":" +
      process.env.SP_DB_PASS +
      "@cluster0-mycmk.mongodb.net/sp_back?retryWrites=true&w=majority";

    mongoose.connect(mongoDB, { useNewUrlParser: true });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));

    //Define a schema.
    // const Schema = mongoose.Schema;

    // //Create an instance of schema Schema.
    // const SomeModelSchema = new Schema({
    //   name: String,
    //   email: String,
    //   meat: String,
    //   th_price: Number,
    //   password: String,
    // });
    console.log(445);
    // Compile model from schema object.
    // let SomeModel = mongoose.model("somemodel", SomeModelSchema);
    // console.log(111);
    // console.log(SomeModel);
    // resolve(SomeModel);

    // let TheModel = mongoose.model("somemodel", SomeModelSchema);
    let TheModel2 =
      mongoose.models.TheModel2 || mongoose.model("somemodel", SomeModelSchema);

    // mongoose.models.TheModel2 || mongoose.model("somemodel", SomeModelSchema);
    // mongoose.models.TheModel2 || mongoose.model("amodel", SomeModelSchema);

    console.log(111);
    console.log(TheModel2);
    resolve(TheModel2);
  });

  Promise.all([promiseDbConnect]).then(function (values) {
    const myModel = values[0];

    myModel.find({}, function (err, match) {
      console.log("inside find callback.");
      console.log(
        `match is of type: ${typeof match} with length ${match.length}`
      );
      // console.log(match);

      if (err) {
        mongoose.connection.close();
        return console.log("error:  " + err);
      } else {
        const isMatch = (element) => {
          return element.id === id;
        };
        const myIndex = match.findIndex(isMatch);
        console.log(myIndex);
        let myUser;
        if (myIndex > -1) {
          console.log("Local strategy returned true. User object is:");
          console.log(match[myIndex]);
          mongoose.connection.close();
          console.log(1);
          console.log(myUser);
          myUser = match[myIndex];
          return done(null, myUser);
        } else {
          myUser = false;
        }
        mongoose.connection.close();
      }
    });
  });
});
/* Begin middleware to ensure React app is served at localhost:5555 and all subdirectories. */
app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.use(express.static("public"));
/* Ensure a route to any path serves my React app.*/
// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
// });
/* End middleware to ensure React app is served at localhost:5555 and all subdirectories. */
//Create new session store. i.e. connect to the database table that houses all my session ID/user ID pairs.
const myMongoStore = new MongoDBStore({
  uri:
    "mongodb+srv://" +
    process.env.SP_DB_USER +
    ":" +
    process.env.SP_DB_PASS +
    "@cluster0-mycmk.mongodb.net/connect_mongodb_session_test?retryWrites=true&w=majority",
  databaseName: "connect_mongodb_session_test",
  collection: "mySessions",
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
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);
//Begin using Passport.
app.use(passport.initialize());
app.use(passport.session());
app.get("/testhomepage", (req, res) => {
  console.log("Inside the homepage callback function");
  console.log("req.sessionID:");
  console.log(req.sessionID);
  res.send(`You hit home page!\n`);
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
      return res.send("You were authenticated & logged in!");
    });
  })(req, res, next);
});
app.get("/authrequired", (req, res) => {
  console.log("Inside GET /authrequired callback");
  console.log(`User authenticated? ${req.isAuthenticated()}`);
  if (req.isAuthenticated()) {
    res.send("you hit the authentication endpoint\n");
  } else {
    res.redirect("/");
  }
});
app.use(express.json());
app.post("/register", (req, res) => {
  console.log(111);
  console.log(req.body);
  const { email, password } = req.body;
  let myUser;

  createModel(req, res).then((myModel) => {
    console.log(123);
    console.log(myModel);
    console.log(req.body.email);
    myModel
      .findOne({ email: req.body.email })
      .then((result) => {
        console.log("Database search for email address complete.");
        console.log(result);
        if (result) {
          // User already exists in database. Optional redirect to proper page.
          console.log("Email address already exists in database.");
          return res.json(`Email address already in-use.`);
          //  res.redirect(result.url);
        } else {
          console.log(
            "Email address does not already exist in database. Hashing password and saving new document to database..."
          );
          return bcrypt.hash(password, 10).then((hash) => {
            myUser = new myModel({
              email: req.body.email,
              password: hash,
            });
            return myUser.save(function (err) {
              if (err) {
                console.log("Error saving new user to database.");
                return res.json("Error creating user.");
              }
              // Password saved. Optional redirect to proper page.
              return res.json(
                `User registered with username ${email}, password ${password}, and has been hashed.`
              );
              //  res.redirect(SomeModelSchema.url);
            });
          });
        }
      })
      .catch((err) => {
        console.log("Error somewhere.");
        if (err) {
          console.log(err);
          return res.status(400).json({ error: err });
        }
      });
  });
});

module.exports = app;
