const path = require("path");
const express = require("express");
const app = express(); // create express app
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

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
        console.log(match);

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
            if (!user) {
              return done(null, false, { message: "No user found.\n" });
            }
            // if (password != user.password) {
            if (!bcrypt.compareSync(password, user.password)) {
              return done(null, false, {
                message: "Incorrect password for that user.\n",
              });
            }
            return done(null, user);
          }
          mongoose.connection.close();
        }
      });
    });
  })
);

// Tell passport how to serialize the user.
passport.serializeUser((user, done) => {
  console.log(
    "Inside serializeUser callback. User id is saved to the session file store here."
  );
  done(null, user.id);
});

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
      console.log(match);

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

const myMongoStore = new MongoDBStore(
  {
    uri:
      "mongodb+srv://" +
      process.env.SP_DB_USER +
      ":" +
      process.env.SP_DB_PASS +
      "@cluster0-mycmk.mongodb.net/connect_mongodb_session_test?retryWrites=true&w=majority",
    databaseName: "connect_mongodb_session_test",
    collection: "mySessions",
  },
  function (error) {
    console.log("error 1");
    console.log("Could not connect to Mongo session store. Full error is:");
    console.log(error);
  }
);

myMongoStore.on("error", function (error) {
  console.log("error 2");
  console.log(error);
});

// Add & configure middleware
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

app.use(passport.initialize());
app.use(passport.session());

// Create the /register route.
// app.use(express.json());
// app.post("/register", (req, res) => {
// app.post("/register", (req, res) => {
//   const { username, password } = req.body;
//   // res.json("register response");
// });
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
    req.login(user, (err) => {
      console.log("Inside req.login() callback");
      console.log(
        `req.session.passport: ${JSON.stringify(req.session.passport)}`
      );
      console.log(`req.user: ${JSON.stringify(req.user)}`);
      return res.send("You were authenticated & logged in!\n");
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

// Start express server on port 5555
app.listen(5555, () => {
  console.log("Listening on port 5555");
});
