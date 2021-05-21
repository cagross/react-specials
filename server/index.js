const path = require("path");
const express = require("express");
const app = express(); // create express app
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// import mongoose from "mongoose";
const mongoose = require("mongoose");

// const users = [{ id: "2f24vvg", email: "test@test.com", password: "password" }];
const users = [
  {
    id: "5e7a0f9967d7650f285c1aac",
    email: "cagross@gmail.com",
    password: "password-g",
  },
];

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    console.log("Inside local strategy callback");
    // here is where you make a call to the database
    // to find the user based on their username or email address
    // for now, we'll just pretend we found that it was users[0]
    // const user = users[0];
    // if (email === user.email && password === user.password) {
    //   console.log("Local strategy returned true");
    //   return done(null, user);
    // }

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
      const Schema = mongoose.Schema;

      //Create an instance of schema Schema.
      const SomeModelSchema = new Schema({
        name: String,
        email: String,
        meat: String,
        th_price: Number,
        password: String,
      });
      console.log(444);
      // Compile model from schema object.
      // let SomeModel = mongoose.model("somemodel", SomeModelSchema);
      // console.log(111);
      // console.log(SomeModel);
      // resolve(SomeModel);

      // let TheModel = mongoose.model("somemodel", SomeModelSchema);
      let TheModel =
        mongoose.models.TheModel ||
        mongoose.model("somemodel", SomeModelSchema);

      console.log(111);
      console.log(TheModel);
      resolve(TheModel);
    });

    // Code to run when both API data has been fetched, and database connection has been made.
    // Promise.all([promiseData, promiseDbConnect]).then(function (values) {
    Promise.all([promiseDbConnect]).then(function (values) {
      console.log(555);
      console.log(values);
      // const SomeModel = values[0];
      const myModel = values[0];

      // SomeModel.find(
      myModel.find(
        {},
        "name email meat th_price password",
        function (err, match) {
          console.log("inside find callback.");
          console.log(
            `match is of type: ${typeof match} with length ${match.length}`
          );
          console.log(match);

          if (err) {
            mongoose.connection.close();

            return console.log("error:  " + err);
          } else {
            console.log("email pass");
            console.log(email);
            console.log(password);
            const isMatch = (element) => {
              return element.email === email && element.password === password;
            };
            // console.log(isMatch);

            const myIndex = match.findIndex(isMatch);
            console.log(myIndex);

            if (myIndex > -1) {
              console.log("Local strategy returned true. User object is:");
              console.log(match[myIndex]);
              mongoose.connection.close();
              const user = match[myIndex];

              return done(null, user);
            }
            mongoose.connection.close();
          }
        }
      );
    });

    // const user = users[0];
    // if (email === user.email && password === user.password) {
    //   console.log("Local strategy returned true");
    //   return done(null, user);
    // }
  })
);

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  console.log(
    "Inside serializeUser callback. User id is saved to the session file store here."
  );
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  console.log("Inside deserializeUser callback");
  console.log(`The user id passport saved in the session file store is: ${id}`);
  const user = users[0].id === id ? users[0] : false;
  done(null, user);
});
// passport.deserializeUser((id, done) => {
//   // axios.get(`http://localhost:5000/users/${id}`)
//   // .then(res => done(null, res.data) )
//   // .catch(error => done(error, false))

//   const promiseDbConnect = new Promise(function (resolve, reject) {
//     let dbUserName, dbUserPass;
//     if (process.env.SP_DB_USER) {
//       dbUserName = process.env.SP_DB_USER;
//     } else {
//       dbUserName = "";
//     }
//     if (process.env.SP_DB_PASS) {
//       dbUserPass = process.env.SP_DB_PASS;
//     } else {
//       dbUserPass = "";
//     }

//     const mongoDB =
//       "mongodb+srv://" +
//       process.env.SP_DB_USER +
//       ":" +
//       process.env.SP_DB_PASS +
//       "@cluster0-mycmk.mongodb.net/sp_back?retryWrites=true&w=majority";

//     mongoose.connect(mongoDB, { useNewUrlParser: true });
//     const db = mongoose.connection;
//     db.on("error", console.error.bind(console, "MongoDB connection error:"));

//     //Define a schema.
//     const Schema = mongoose.Schema;

//     //Create an instance of schema Schema.
//     const SomeModel2Schema = new Schema({
//       id: String,
//       name: String,
//       email: String,
//       meat: String,
//       th_price: Number,
//       password: String,
//     });

//     // Compile model from schema object.
//     let SomeModel2 = mongoose.model("somemodel2", SomeModel2Schema);
//     console.log(111);
//     console.log(SomeModel2);

//     resolve(SomeModel2);
//   });

//   // Code to run when both API data has been fetched, and database connection has been made.
//   // Promise.all([promiseData, promiseDbConnect]).then(function (values) {
//   Promise.all([promiseDbConnect])
//     .then(function (values) {
//       console.log(222);
//       console.log(values);
//       const SomeModel2 = values[0];
//       SomeModel2.find(
//         {},
//         "id name email meat th_price password",
//         function (err, match) {
//           if (err) {
//             return console.log("error:  " + err);
//           } else {
//             console.log("id:");
//             console.log(id);
//             console.log("email pass");
//             console.log(email);
//             console.log(password);
//             const isMatch = (element) => {
//               return element.email === email && element.password === password;
//             };

//             const myIndex = match.findIndex(isMatch);
//             console.log(myIndex);

//             if (myIndex > -1) {
//               console.log("Local strategy returned true");
//               mongoose.connection.close();

//               return done(null, match[myIndex]);
//             }
//             mongoose.connection.close();
//           }
//         }
//       );
//     })
//     // .then((res) => done(null, res.data))
//     .then((res) => {
//       console.log(111);
//       console.log(res);
//       return done(null, res.data);
//     })

//     .catch((error) => done(error, false));
// });

// add middlewaree

// app.use(function (req, res, next) {
// var filename = path.basename(req.url);
// var extension = path.extname(filename);
// if (extension === '.css')
// console.log("The file " + filename + " was requested.");
// console.log(111);
// console.log(path);
// console.log(path.dirname(__filename));
// console.log(req);
// next();
// });

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
    // uri: "mongodb://bad.host:27000/connect_mongodb_session_test?connectTimeoutMS=10",
    // uri: "mongodb://localhost:27017/connect_mongodb_session_test",
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
    // Should have gotten an error
    console.log("error 1");
    // console.log("Could not connect to Mongo session store. Full error is:");
    console.log(error);
  }
);
// console.log(myMongoStore);

myMongoStore.on("error", function (error) {
  // Also get an error here
  console.log("error 2");
  console.log(error);
});

// const jsonParser = bodyParser.json();
// add & configure middleware
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

// console.log(555);
// console.log(path.join(__dirname, "..", "client", "public"));

// Create the /register route.
// app.use(express.json());
// app.post("/register", (req, res) => {
// app.post("/register", (req, res) => {
//   const { username, password } = req.body;
//   // res.json("register response");
// });
app.get("/testhomepage", (req, res) => {
  // console.log("/test route hit.");
  // console.log("req is:");
  // console.log(req);
  // const uniqueId = uuidv4();
  // res.send(`Hit home page. Received the unique id: ${uniqueId}\n`);
  console.log("Inside the homepage callback function");
  console.log("req.sessionID");
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

// app.post("/login", (req, res) => {
// app.post("/login", jsonParser, (req, res) => {
app.post("/login", express.json(), (req, res, next) => {
  // console.log("Inside POST /login callback function");
  // console.log(req.body);
  // res.send(`You posted to the login page!\n`);
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
  // console.log(req);
  console.log(`User authenticated? ${req.isAuthenticated()}`);
  if (req.isAuthenticated()) {
    res.send("you hit the authentication endpoint\n");
  } else {
    res.redirect("/");
  }
});
// start express server on port 5555
app.listen(5555, () => {
  console.log("Listening on port 5555");

  // app.get("/register", (req, res) => {
  //   console.log("CAG Listening on localhost:5555");
  //   res.send("Listening on localhost:5555");
  //   // const { username, password } = req.body;
  //   // res.json("register response");
  // });

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
});
