const express = require("express");
require("dotenv").config();

const port = process.env.PORT || "3000";
const app = express();

const cors = require("cors");
require("./config/configDb");

app.use(cors());
app.use(express.json());
// router fazer
const router = require("./router/Router");
app.use(router);
app.listen(port, () => {
  console.log("Online in Port : " + port);
});
