const express = require("express");
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Withdraw = require("./config/db/models/Withdraw");
require("dotenv").config();

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
  });

  win.webContents.send("aaaa", "sua mãe");
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
    return "nada";
  }
  console.log(data);
  return data;
});

ipcMain.handle("search_student", async (e, value) => {
  const studentSearch = await Withdraw.find({
    name: { $regex: ".*" + value + ".*" },
  });
  if (!studentSearch.length) {
    console.log("não achei nada");

    return "Nenhum dado Encontrado";
  }
  return studentSearch;
});
