const { Schema, model } = require("mongoose");

const withdraw = new Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  book: { type: String, required: true },
  initD: { type: String },
  date: { type: String, required: true },
  sit: { type: String, required: true },
});

module.exports = model("Withdraw", withdraw);
