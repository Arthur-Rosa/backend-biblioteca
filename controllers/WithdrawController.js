const User = require("../models/Withdraw");

// Pegar dados do banco
const getAllWithdraw =
  ("get_data_student",
  async (req, res) => {
    try {
      // Busca todos os Dados
      const data = await Student.find();
      // Verifica se dados foram Encontrados
      if (data.length == 0 || !data) {
        return "Nenhum dado Encontrado";
      }
      // Retorna os Dados
      return data;
    } catch (er) {
      console.log(er);
      return "Ocorreu um Erro : " + er;
    }
  });

// Pega um Único ID
const getOneWithdraw =
  ("get_one_data_student",
  async (req, res) => {
    try {
      // Verifica ID
      if (value == "") {
        return "Id Inválido";
      }
      // Busca Student apartir do ID
      const stu = await Student.findById(value);
      // Verifica se Student Existe
      if (!stu) {
        return "Nenhum dado Encontrado";
      }
      // Retorna Student
      return stu;
    } catch (er) {
      console.log(er);
      return "Ocorreu um Erro : " + er;
    }
  });

// Atualiza pelo ID
const updateWithdraw =
  ("update_one_data_student",
  async (req, res) => {
    try {
      // Verifica ID
      if (value == "") {
        return "Id Inválido";
      }
      // Verifica se Student Existe
      const stu = await Student.findById(value);
      if (!stu) {
        return "Nenhum dado Encontrado";
      }
      // Busca pelo ID e Atualiza
      const stuUpdate = await Student.findByIdAndUpdate(value);
      // Verifica se Atualizou com Sucesso
      if (!stuUpdate) {
        return "Ocorreu um Erro";
      }
      // Retorna Student
      return stuUpdate;
    } catch (er) {
      console.log(er);
      return "Ocorreu um Erro : " + er;
    }
  });

// Deleta pelo ID
const deleteWithdraw =
  ("delete_one_data_student",
  async (req, res) => {
    try {
      // Verifica ID
      if (value == "") {
        return "Id Inválido";
      }
      // Busca Pelo ID
      const stu = await Student.findById(value);
      // Verifica se Existe
      if (!stu) {
        return "Student Não Encontrado";
      }
      // Busca Student apartir do ID e Deleta
      const stuDeleted = await Student.findByIdAndDelete(value);
      // Verifica se Foi Deletado
      if (!stuDeleted) {
        return "Ocorreu um Erro";
      }
      // Retorna Student
      return stu;
    } catch (er) {
      console.log(er);
      return "Ocorreu um Erro : " + er;
    }
  });

// Criar Retirada
const createWithdraw =
  ("data_student",
  async (req, res) => {
    const dataObj = new Date(value.finalDate);
    const dataAtual = new Date();
    // Validando Front
    if (
      value.name == "" ||
      value.serie == "" ||
      value.book == "" ||
      value.finalDate == ""
    ) {
      return "Campos Vazios";
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
      return "Data Inválida";
    }
    // Validando Dia Escolhido
    if (dataObj.getUTCDay() == 0 || dataObj.getUTCDay() == 6) {
      return "Indisponível ao Final de Semana";
    }

    // Criando Retirada
    try {
      const obj = await Student.create({
        name: value.name,
        class: value.serie,
        book: value.book,
        date: value.finalDate,
      });
      // Verificando se Salvou Corretamente
      if (!obj) {
        return "Ocorreu um Erro ao Salvar";
      }
      // Retorna Retirada
      return obj;
    } catch (er) {
      console.log("Ocorreu um Erro : " + er);
      return "Ocorreu um Erro : " + er;
    }
  });

module.exports = {
  deleteWithdraw,
  getAllWithdraw,
  getOneWithdraw,
  updateWithdraw,
  createWithdraw,
};
