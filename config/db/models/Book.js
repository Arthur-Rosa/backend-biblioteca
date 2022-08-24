const { Schema, model } = require("mongoose");

const book = new Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
  book: { type: String, required: true },
});

module.exports = model("Book", book);
