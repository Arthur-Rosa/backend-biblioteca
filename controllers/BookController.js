const Book = require("../config/db/models/Book");

const createBook = async (req, res) => {
  try {
    const value = {
      name: req.body.name,
      amount: req.body.amount,
      book: req.body.book,
    };

    if (value.name == "" || value.amount == "" || value.book == "") {
      return res.status(404).json({ msg: "Campos Vazios" });
    }

    const data = Book.create(value);
    if (!data) {
      return res.status(400).json({ msg: "Ocorreu um Erro ao Salvar" });
    }

    return res.status(201).json({ data });
  } catch (er) {
    console.log(er);
    return res.status(500).json({ msg: "Ocorreu um Erro" });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (id == "") {
      return res.status(400).json({ msg: "ID inválido" });
    }

    const value = {
      name: req.body.name,
      amount: req.body.amount,
      book: req.body.book,
    };

    if (value.name == "" || value.amount == "" || value.book == "") {
      return res.status(404).json({ msg: "Campos Vazios" });
    }

    const data = await Book.findById(id);

    if (!data) {
      return res.status(404).json({ msg: "Nenhum dado encontrado" });
    }

    const objUpdate = await Book.findByIdAndUpdate(id, value);
    if (!objUpdate) {
      return res.status(400).json({ msg: "Ocorreu um Erro" });
    }

    return res.status(200).json({ objUpdate });
  } catch (er) {
    console.log(er);
    return res.status(500).json({ msg: "Ocorreu um Erro" });
  }
};

const getAllBook = async (req, res) => {
  try {
    const data = await Book.find();
    if (!data) {
      return res.status(404).json({ msg: "Nenhum dado encontrado" });
    }
    return res.status(200).json({ data });
  } catch (er) {
    console.log(er);
    return res.status(500).json({ msg: "Ocorreu um Erro" });
  }
};

const getOneBook = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Book.findById(id);

    if (!data) {
      return res.status(404).json({ msg: "Nenhum dado encontrado" });
    }

    return res.status(200).json({ data });
  } catch (er) {
    console.log(er);
    return res.status(500).json({ msg: "Ocorreu um Erro" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (id == "") {
      return res.status(400).json({ msg: "ID inválido" });
    }

    const obj = await Book.findById(id);

    if (!obj) {
      return res.status(404).json({ msg: "Nenhum dado encontrado" });
    }

    const objDeleted = await Book.findByIdAndDelete(id);

    if (!objDeleted) {
      return res.status(404).json({ msg: "Ocorreu um Erro" });
    }
    return res.status(200).json({ msg: "Deletado com Sucesso" });
  } catch (er) {
    console.log(er);
    return res.status(500).json({ msg: "Ocorreu um Erro" });
  }
};

module.exports = {
  createBook,
  updateBook,
  getAllBook,
  getOneBook,
  deleteBook,
};
