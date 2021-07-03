const mongoose = require("mongoose");

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

// Handle Genre create on POST.
exports.createModel = function (req, res) {
  console.log("Inside create post.");
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

    console.log(445);

    let TheModel3 =
      mongoose.models.TheModel3 || mongoose.model("somemodel", SomeModelSchema);

    console.log(111);
    console.log(TheModel3);
    resolve(TheModel3);
  });
  return Promise.all([promiseDbConnect]).then(function (values) {
    const myModel = values[0];
    return myModel;
  });
};
