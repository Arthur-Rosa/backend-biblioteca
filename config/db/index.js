const { connect, connection } = require("mongoose");

function connectDb() {
  connect(
    "mongodb+srv://printnaosome:SiO4eSk2zUFkyf6J@school-lib.yvxpyif.mongodb.net/?retryWrites=true&w=majority"
  );

  let db = connection;

  db.on("error", () => console.log("Error on connection"));
  db.once("open", () => console.log("Database running"));
}

module.exports = { connectDb };
