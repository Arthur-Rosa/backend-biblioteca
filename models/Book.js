const Sequelize = require("sequelize");
const db = require("../config/configDb");

const Book = db.define("withdraw", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: { type: Sequelize.STRING, required: true },
  quantidade: { type: Sequelize.STRING, required: true },
});

module.exports = Book;
