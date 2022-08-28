require("dotenv").config();
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const express = require("express");
const path = require("path");
const Withdraw = require("./config/db/models/Withdraw");

const port = process.env.PORT || "3000";
const App = express();

const { connectDb } = require("./config/db");
const cors = require("cors");
connectDb();

App.use(cors());
App.use(express.json());
// router fazer
const router = require("./router/Router");
App.use(router);
App.listen(port, () => {
  console.log("Online in Port : " + port);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 1080,
    show: false,
    icon: path.join(__dirname, "assets", "logo.png"),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "frontend", "js", "preload.js"),
    },
  });

  win.loadFile(path.join(__dirname, "frontend", "index.html"));

  win.once("ready-to-show", () => {
    win.show();
    /* 
    const menuTemplate = [];
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu); */
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length == 0) {
    createWindow();
  }
});

ipcMain.handle("get-all-data", async (e, value) => {
  const data = await Withdraw.find();
  if (!data.length) {
    return null;
  }
  return data;
});

ipcMain.handle("get-one-data", async (e, value) => {
  const data = await Withdraw.find({
    sit: 1,
  });
  console.log(data);
  if (!data.length) {
    return null;
  }
  return data;
});

ipcMain.handle("get-two-data", async (e, value) => {
  const data = await Withdraw.find({
    sit: 2,
  });
  if (!data.length) {
    return null;
  }
  return data;
});

ipcMain.on("search_student", async (e, value) => {
  const studentSearch = await Withdraw.find({ name: value });
  if (!studentSearch.length) {
    console.log("não achei nada");
    return null;
  }
  return console.log(studentSearch);
});

ipcMain.on("data_student", async (e, value) => {
  const student = new Withdraw({
    name: value.name,
    class: value.serie,
    book: value.book,
    date: value.finalDate,
    sit: 1,
  });

  try {
    const savedStudent = await student.save();
    return savedStudent;
  } catch (error) {
    console.log("Erro ao salvar aluno no banco");
    return;
  }
});

ipcMain.on("delete_student", async (e, value) => {
  const student = await Withdraw.findOne({ name: value });
  console.log(student);
  try {
    const delStudent = await Withdraw.findByIdAndDelete(student._id);
    console.log("deletado!");
  } catch (error) {
    console.log("erro ao apagar aluno");
    return;
  }
});

ipcMain.on("student_update", async (e, value) => {
  const student = await Withdraw.findOne({ name: value.nameUp });
  console.log("estudante é", student);
  try {
    const studentUp = await Withdraw.findByIdAndUpdate(student._id, {
      name: value.nameUp,
      class: value.serieUp,
      book: value.bookUp,
      date: value.finalDateEdit,
    });
    console.log("ATUALIZADO!");
  } catch (error) {
    console.log("erro ao atualizar aluno");
    return;
  }
});
