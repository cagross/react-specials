/**
 * Defines configuration.
 * @returns object
 */
export function config() {
  const dbUsername = process.env.SP_DB_USER ? process.env.SP_DB_USER : "";
  const dbPassword = process.env.SP_DB_PASS ? process.env.SP_DB_PASS : "";

  const mongoDBUri =
    "mongodb://" +
    dbUsername +
    ":" +
    dbPassword +
    "@cluster0-shard-00-00.mycmk.mongodb.net:27017,cluster0-shard-00-01.mycmk.mongodb.net:27017,cluster0-shard-00-02.mycmk.mongodb.net:27017/sp_back?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

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
    stores: {
      singName: "store",
      fields: ["storeNo", "address1", "city", "state", "zip"],
    },
  };

  const sessionSecret = process.env.SP_SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error(
      "Missing required environment variable: SP_SESSION_SECRET"
    );
  }

  return {
    dbUsername: dbUsername,
    dbPassword: dbPassword,
    mongoDBUri: mongoDBUri,
    sessionStoreDbName: "connect_mongodb_session_test",
    sessionStoreCollName: "mySessions",
    tableNames: tableNames,
    sessionSecret: sessionSecret,
  };
}
