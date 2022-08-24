const { Schema, model } = require("mongoose");

const withdraw = new Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  book: { type: String, required: true },
  date: { type: String, required: true },
});

module.exports = model("Withdraw", withdraw);
