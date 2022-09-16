const { Schema, model } = require("mongoose");

const book = new Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
  gender: { type: String, required: true },
  autor: { type: String, required: true }
});

module.exports = model("Book", book);
