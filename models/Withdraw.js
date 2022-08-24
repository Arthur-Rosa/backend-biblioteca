const Sequelize = require("sequelize");
const db = require("../config/configDb");
const Book = require("./Book");

const Withdrawal = db.define("withdraw", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: { type: Sequelize.STRING, required: true },
  class: { type: Book, required: true },
  book: { type: Sequelize.STRING, required: true },
  date: { type: Sequelize.STRING, required: true },
});

module.exports = Withdrawal;
