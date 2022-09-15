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

  win.once("ready-to-show", async () => {
    win.show();

    const menuTemplate = [];
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    const students = await Withdraw.find();

    if (!students.length) {
      console.log("Não há estudantes para mostrar no ready to show");
      return null;
    }

    try {
      students.map(async (s) => {
        let today = new Date();

        let current_day = today.getDate();
        let current_month = today.getMonth() + 1;
        let current_year = today.getFullYear();

        if (current_day <= 9) {
          current_day = "0" + current_day;
        }

        if (current_month <= 9) {
          current_month = "0" + current_month;
        }

        let all =
          current_year.toString() +
          "-" +
          current_month.toString() +
          "-" +
          current_day.toString();

        async function timeOutStudent(id, sit) {
          console.log(id, sit);
          const students_timesup = await Withdraw.findByIdAndUpdate(id, {
            name: s.name,
            class: s.class,
            book: s.book,
            date: s.date,
            sit: sit,
          });

          return students_timesup;
        }

        all > s.date ? timeOutStudent(s._id, 2) : null;
      });
    } catch (error) {
      console.log("erro no ready to show", error);
    }
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

ipcMain.handle("update_dashboard", async (e, value) => {
  try {
    const data = await Withdraw.find();
    var a = 0;
    var b = 0;
    var c = 0;
    data.forEach((ev) => {
      if (ev.sit == 1) {
        a++;
        return a;
      } else if (ev.sit == 2) {
        b++;
        return b;
      } else if (ev.sit == 3) {
        c++;
        return c;
      }
    });
    var obj = {
      a: a,
      b: b,
      c: c,
    };
    return obj;
  } catch (error) {
    console.log("Erro ao mandar update_dashboard", error);
    return;
  }
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

ipcMain.on("update_withdraw_status_conc", async (e, value) => {
  try {
    const st = await Withdraw.findOne({ name: value.nameUp });

    console.log(st);

    if (!st) {
      console.log("err update data");
      return;
    }

    var obj = {
      id: st._id,
      name: st.name,
      class: st.class,
      book: st.book,
      date: st.date,
      sit: 3,
    };

    const fnln = await Withdraw.findByIdAndUpdate(st._id, obj);

    if (!fnln) {
      return;
    }

    console.log("uodate hour : " + fnln);

    return fnln;
  } catch (e) {
    console.log("err 500 : " + e);
    return;
  }
});

ipcMain.handle("get-two-data", async (e, value) => {
  const data = await Withdraw.find({
    sit: 2,
  });
  if (!data.length) {
    return null;
  }
  console.log("encontrei um atrasado! ", data);
  return data;
});

ipcMain.handle("get-three-data", async (e, value) => {
  const data = await Withdraw.find({
    sit: 3,
  });
  if (!data.length) {
    return null;
  }
  return data;
});

let searchStudent;

ipcMain.on("search_student", async (e, value) => {
  const studentSearch = await Withdraw.find({ name: value });
  if (!studentSearch.length) {
    console.log("não achei nada");
    return null;
  }

  searchStudent = studentSearch;
  console.log("olha aqui aqui ", searchStudent);

  return searchStudent;
});

ipcMain.handle("get-search-data", async () => {
  const student = await Withdraw.find({ name: searchStudent[0].name });

  if (!student.length) {
    console.log("não há estudantes com esse nome");
    return null;
  }

  console.log("olha o search aqui ", student);
  return student;
});

ipcMain.on("data_student", async (e, value) => {
  console.log("estudante salvo", value);

  // Criando Retirada
  const obj = new Withdraw({
    name: value.name,
    class: value.serie,
    book: value.book,
    initD: value.dateInit,
    date: value.finalDate,
    sit: 1,
  });
  try {
    const savedObj = await obj.save();

    return savedObj;
  } catch (e) {
    console.log("erro ao salvar estudante", e);
    return;
  }
});

// Update corrigido no front
ipcMain.on("student_update", async (e, value) => {
  const student = await Withdraw.findOne({ name: value.nameUp });
  try {
    const studentUp = await Withdraw.findByIdAndUpdate(student._id, {
      name: value.nameUp,
      class: value.serieUp,
      book: value.bookUp,
      date: value.finalDateUp,
    });
  } catch (error) {
    console.log("erro ao atualizar aluno");
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
