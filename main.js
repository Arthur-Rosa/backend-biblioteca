const express = require("express");
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
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
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "frontend-biblioteca", "js", "preload.js"),
    },
  });

  win.loadFile(path.join(__dirname, "frontend-biblioteca", "index.html"));

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

ipcMain.on("search_student", (e, value) => {
  console.log(value);
});
