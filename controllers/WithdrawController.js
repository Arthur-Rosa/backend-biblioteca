const Withdraw = require("../config/db/models/Withdraw");

// Pegar dados do banco
const getAllWithdraw = async (req, res) => {
  try {
    // Busca todos os Dados
    const data = await Withdraw.find();
    // Verifica se dados foram Encontrados
    if (data.length == 0 || !data) {
      return res.status(404).json({ err: "Nenhum dado encontrado" });
    }
    // Retorna os Dados
    return res.status(200).json({ data });
  } catch (er) {
    console.log(er);
    return res.status(500).json({ err: "Ocorreu um Erro" });
  }
};

// Pega um Único ID
const getOneWithdraw = async (req, res) => {
  try {
    // Guarda ID
    const { id } = req.params;
    // Verifica ID
    if (id == "") {
      return res.status(404).json({ msg: "ID inválido" });
    }
    // Busca Withdraw apartir do ID
    const obj = await Withdraw.findById(id);
    // Verifica se Withdraw Existe
    if (!obj) {
      return res.status(404).json({ msg: "Nenhum dado encontrado" });
    }
    // Retorna Withdraw
    return res.status(200).json({ obj });
  } catch (er) {
    console.log(er);
    return res.status(500).json({ msg: "Ocorreu um Erro" });
  }
};

// Atualiza pelo ID
const updateWithdraw = async (req, res) => {
  try {
    // Reguardando o Objeto
    const value = {
      name: req.body.name,
      class: req.body.class,
      book: req.body.book,
      finalDate: req.body.finalDate,
    };
    const dataObj = new Date(value.finalDate);
    const dataAtual = new Date();
    // Validando Front
    if (
      value.name == "" ||
      value.serie == "" ||
      value.book == "" ||
      value.finalDate == ""
    ) {
      return res.status(404).json({ msg: "Campos Vazios" });
    }
    // Validando data Atual
    if (
      dataObj.getUTCDate() +
        "/" +
        (dataObj.getUTCMonth() + 1) +
        "/" +
        dataObj.getUTCFullYear() <=
      dataAtual.getUTCDate() +
        "/" +
        (dataAtual.getUTCMonth() + 1) +
        "/" +
        dataAtual.getUTCFullYear()
    ) {
      return res.status(400).json({ msg: "Data Inválida" });
    }
    // Validando Dia Escolhido
    if (dataObj.getUTCDay() == 0 || dataObj.getUTCDay() == 6) {
      return res.status(400).json({ msg: "Indisponível ao Final de Semana" });
    }
    // Pega o ID
    const { id } = req.params;
    // Verifica ID
    if (id == "") {
      return res.status(404).json({ msg: "Id Inválido" });
    }
    // Verifica se Withdraw Existe
    const obj = await Withdraw.findById(id);
    // Verifica se encontrou algo
    if (!obj) {
      return res.status(404).json({ msg: "Nenhum dado Encontrado" });
    }
    // Busca pelo ID e Atualiza
    const objUpdate = await Withdraw.findByIdAndUpdate(id, value);
    // Verifica se Atualizou com Sucesso
    if (!objUpdate) {
      return res.status(404).json({ msg: "Ocorreu um Erro" });
    }
    // Retorna Withdraw
    return res.status(200).json({ value });
  } catch (er) {
    console.log(er);
    return res.status(500).json({ msg: "Ocorreu um Erro" });
  }
};

// Deleta pelo ID
const deleteWithdraw = async (req, res) => {
  try {
    const { id } = req.params;
    // Verifica ID
    if (id == "") {
      return res.status(404).json({ msg: "Id Inválido" });
    }
    // Busca Pelo ID
    const obj = await Withdraw.findById(id);
    // Verifica se Existe
    if (!obj) {
      return res.status(404).json({ msg: "Withdraw Não Encontrado" });
    }
    // Busca Withdraw apartir do ID e Deleta
    const objDeleted = await Withdraw.findByIdAndDelete(id);
    // Verifica se Foi Deletado
    if (!objDeleted) {
      return res.status(404).json({ msg: "Ocorreu um Erro" });
    }
    // Retorna Withdraw
    return res.status(200).json({ msg: "Deletado com Sucesso" });
  } catch (er) {
    console.log(er);
    return res.sttatus(500).json({ msg: "Ocorreu um Erro" });
  }
};

// Criar Retirada
const createWithdraw = async (req, res) => {
  // Reguardando o Objeto
  const value = {
    name: req.body.name,
    class: req.body.class,
    book: req.body.book,
    finalDate: req.body.finalDate,
  };
  const dataObj = new Date(value.finalDate);
  const dataAtual = new Date();
  // Validando Front
  if (
    value.name == "" ||
    value.serie == "" ||
    value.book == "" ||
    value.finalDate == ""
  ) {
    return res.status(404).json({ msg: "Campos Vazios" });
  }
  // Validando data Atual
  if (
    dataObj.getUTCDate() +
      "/" +
      (dataObj.getUTCMonth() + 1) +
      "/" +
      dataObj.getUTCFullYear() <=
    dataAtual.getUTCDate() +
      "/" +
      (dataAtual.getUTCMonth() + 1) +
      "/" +
      dataAtual.getUTCFullYear()
  ) {
    return res.status(400).json({ msg: "Data Inválida" });
  }
  // Validando Dia Escolhido
  if (dataObj.getUTCDay() == 0 || dataObj.getUTCDay() == 6) {
    return res.status(400).json({ msg: "Indisponível ao Final de Semana" });
  }

  // Criando Retirada
  try {
    const obj = await Withdraw.create({
      name: value.name,
      class: value.class,
      book: value.book,
      date: value.finalDate,
    });
    // Verificando se Salvou Corretamente
    if (!obj) {
      return res.status(400).json({ msg: "Ocorreu um Erro ao Salvar" });
    }
    // Retorna Retirada
    return res.status(201).json({ obj });
  } catch (er) {
    console.log("Ocorreu um Erro : " + er);
    return res.status(500).json({ msg: "Ocorreu um Erro" });
  }
};

module.exports = {
  deleteWithdraw,
  getAllWithdraw,
  getOneWithdraw,
  updateWithdraw,
  createWithdraw,
};
