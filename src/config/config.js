/**
 * Defines configuration.
 * @returns object
 */
exports.config = function () {
  const dbUsername = process.env.SP_DB_USER ? process.env.SP_DB_USER : "";
  const dbPassword = process.env.SP_DB_PASS ? process.env.SP_DB_PASS : "";

  const mongoDBUri =
    "mongodb+srv://" +
    dbUsername +
    ":" +
    dbPassword +
    "@cluster0-mycmk.mongodb.net/sp_back?retryWrites=true&w=majority";

  const tableNames = {
    items: {
      singName: "item",
      fields: ["storeCode", "all_items", "dateSaved"],
    },
    users: {
      // singName: "somemodel",
      singName: "user",
      fields: [
        "name",
        "email",
        "meat",
        "th_price",
        "password",
        "host",
        "origin",
        "referer",
        "platform",
        "userAgent",
        "dateCreated",
      ],
    },
  };

  return {
    dbUsername: dbUsername,
    dbPassword: dbPassword,
    mongoDBUri: mongoDBUri,
    sessionStoreDbName: "connect_mongodb_session_test",
    sessionStoreCollName: "mySessions",
    tableNames: tableNames,
    sessionSecret: process.env.SP_SESSION_SECRET
      ? process.env.SP_SESSION_SECRET
      : "",
  };
};
