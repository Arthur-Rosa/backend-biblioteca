window.addEventListener("DOMContentLoaded", async () => {
  const { ipcRenderer } = require("electron");
  const changeModal = document.querySelector(".button_modal");
  const closeModal = document.querySelector(".close");
  const modal = document.querySelector(".modal");

  function toggleModal(modal) {
    if (modal.classList.contains("modal_close")) {
      modal.classList.remove("modal_close");
    } else {
      modal.classList.add("modal_close");
    }
  }

  changeModal.addEventListener("click", () => {
    toggleModal(modal);
  });

  closeModal.addEventListener("click", () => {
    toggleModal(modal);
  });

  // Data students
  const name_student = document.querySelector("#name_student");
  const serie = document.querySelector("#class_student");
  const book = document.querySelector("#book");
  const finalDate = document.querySelector("#date");
  // end data student

  // validation error
  const inputField = document.querySelector(".unfield");

  // edit data button
  const modal_edit = document.querySelector(".modal_edit_container");
  const name_studentEdit = document.querySelector("#name_edit");
  const serieEdit = document.querySelector("#serie_edit");
  const bookEdit = document.querySelector("#book_edit");
  const finalDateEdit = document.querySelector("#finalDate_edit");
  const close_edit = document.querySelector("#close_edit");
  const update_student = document.querySelector("#sendDataChanged");

  let dataEdit;

  close_edit.addEventListener("click", () => {
    toggleModal(modal_edit);
  });

  // send data
  let data;

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

  // search student
  const inpSearch = document.querySelector("#inp_search");
  const buttonSearch = document.querySelector("#search-button");

  buttonSearch.addEventListener("click", () => {
    const valueSearch = inpSearch.value;

    if (!valueSearch) {
      return;
    }

    ipcRenderer.send("search_student", valueSearch);
  });

  function sendData() {
    data = {
      name: name_student.value,
      serie: serie.value,
      book: book.value,
      dateInit: all,
      finalDate: finalDate.value,
    };

    toggleModal(modal);
    return data;
  }

  const buttonSend = document.querySelector("#sendDataStudent");

  buttonSend.addEventListener("click", () => {
    if (
      name_student.value == "" ||
      serie.value == "" ||
      book.value == "" ||
      finalDate.value == ""
    ) {
      inputField.style.display = "block";

      setInterval(() => {
        inputField.style.display = "none";
      }, 3000);
    } else {
      ipcRenderer.send("data_student", sendData());
      window.location.reload();
    }
  });

  const dsh = await ipcRenderer.invoke("update_dashboard");
  console.log(dsh);
  if (dsh.a == 0) {
    document.getElementById("and").textContent = "0";
  } else {
    document.getElementById("and").textContent = dsh.a;
  }

  if (dsh.b == 0) {
    document.getElementById("atr").textContent = "0";
  } else {
    document.getElementById("atr").textContent = dsh.b;
  }

  if (dsh.c == 0) {
    document.getElementById("conc").textContent = "0";
  } else {
    document.getElementById("conc").textContent = dsh.c;
  }

  document.getElementById("concEntrega").addEventListener("click", () => {
    dataEdit = {
      nameUp: name_studentEdit.value,
      serieUp: serieEdit.value,
      bookUp: bookEdit.value,
      finalDateUp: finalDateEdit.value,
    };
    ipcRenderer.send("update_withdraw_status_conc", dataEdit);
    window.location.reload();
  });

  var dataChange = document.getElementById("page").textContent;
  console.log(dataChange);

  if (dataChange == "index") {
    const dataAll = await ipcRenderer.invoke("get-all-data");

    if (dataAll == null) {
      document.querySelector("table").style.display = "none";
      document.getElementById("not-exist").style.display = "block";
    } else {
      document.querySelector("table").style.display = "block";
      document.getElementById("not-exist").style.display = "none";
    }

    dataAll.forEach((e) => {
      console.log(e._doc);
      const back = document.getElementById("tbody");
      const t = document.createElement("tr");
      // nome
      const thN = document.createElement("td");
      // sala
      const thS = document.createElement("td");
      // book
      const thB = document.createElement("td");
      // situacao
      const thSS = document.createElement("td");
      // retirada date
      const thRR = document.createElement("td");
      // entrega date
      const thRE = document.createElement("td");

      thN.textContent = e._doc.name;
      thS.textContent = e._doc.class;
      thB.textContent = e._doc.book;
      var __v = "";
      if (e._doc.sit == 1) {
        __v = "Em Andamento";
      }
      if (e._doc.sit == 2) {
        __v = "Em Atraso";
      }
      if (e._doc.sit == 3) {
        __v = "Devolvido";
      }
      thSS.textContent = __v;
      thRR.textContent = e._doc.initD;
      thRE.textContent = e._doc.date;

      const tdBtnEdit = document.createElement("td");
      const buttonEdit = document.createElement("button");

      const buttonDelete = document.createElement("button");
      const tdBtnDelete = document.createElement("td");

      buttonEdit.textContent = "Editar";
      buttonEdit.setAttribute("class", "edt-btn");
      buttonEdit.addEventListener("click", () => {
        toggleModal(modal_edit);

        name_studentEdit.value = e._doc.name;
        serieEdit.value = e._doc.class;
        bookEdit.value = e._doc.book;
        finalDateEdit.value = e._doc.date;
      });

      update_student.addEventListener("click", () => {
        dataEdit = {
          nameUp: name_studentEdit.value,
          serieUp: serieEdit.value,
          bookUp: bookEdit.value,
          finalDateUp: finalDateEdit.value,
        };

        ipcRenderer.send("student_update", dataEdit);
        window.location.reload();
      });

      buttonDelete.textContent = "Apagar";
      buttonDelete.setAttribute("class", "del-btn");

      buttonDelete.addEventListener("click", () => {
        ipcRenderer.send("delete_student", e._doc.name);
        window.location.reload();
      });

      back.appendChild(t);
      t.appendChild(thN);
      t.appendChild(thS);
      t.appendChild(thB);
      t.appendChild(thSS);
      t.appendChild(thRR);
      t.appendChild(thRE);
      t.appendChild(tdBtnEdit);
      tdBtnEdit.appendChild(buttonEdit);
      t.appendChild(tdBtnDelete);
      tdBtnDelete.appendChild(buttonDelete);
    });
  }

  if (dataChange == "1") {
    const dataAll = await ipcRenderer.invoke("get-one-data");

    if (dataAll == null) {
      document.getElementById("not-exist").style.display = "block";
      document.querySelector("table").style.display = "none";
    } else {
      document.getElementById("not-exist").style.display = "none";
      document.querySelector("table").style.display = "block";
    }

    dataAll.forEach((e) => {
      console.log(e._doc);
      const back = document.getElementById("tbody");
      const t = document.createElement("tr");
      // nome
      const thN = document.createElement("td");
      // sala
      const thS = document.createElement("td");
      // book
      const thB = document.createElement("td");
      // situacao
      const thSS = document.createElement("td");
      // retirada date
      const thRR = document.createElement("td");
      // entrega date
      const thRE = document.createElement("td");

      let today = new Date();

      let current_day = today.getDate();
      let current_month = today.getMonth();
      let current_year = today.getFullYear();

      var __v = "";
      if (e._doc.sit == 1) {
        __v = "Em Andamento";
      }
      if (e._doc.sit == 2) {
        __v = "Em Atraso";
      }
      if (e._doc.sit == 3) {
        __v = "Devolvido";
      }
      thSS.textContent = __v;
      thN.textContent = e._doc.name;
      thS.textContent = e._doc.class;
      thB.textContent = e._doc.book;
      thRR.textContent = e._doc.initD;
      thRE.textContent = e._doc.date;

      const tdBtnEdit = document.createElement("td");
      const buttonEdit = document.createElement("button");

      const buttonDelete = document.createElement("button");
      const tdBtnDelete = document.createElement("td");

      buttonEdit.textContent = "Editar";
      buttonEdit.setAttribute("class", "edt-btn");
      buttonEdit.addEventListener("click", () => {
        toggleModal(modal_edit);

        name_studentEdit.value = e._doc.name;
        serieEdit.value = e._doc.class;
        bookEdit.value = e._doc.book;
        finalDateEdit.value = e._doc.date;
      });

      update_student.addEventListener("click", () => {
        dataEdit = {
          nameUp: name_studentEdit.value,
          serieUp: serieEdit.value,
          bookUp: bookEdit.value,
          finalDateUp: finalDateEdit.value,
        };
        ipcRenderer.send("student_update", dataEdit);
        window.location.reload();
      });

      buttonDelete.textContent = "Apagar";
      buttonDelete.setAttribute("class", "del-btn");

      buttonDelete.addEventListener("click", () => {
        ipcRenderer.send("delete_student", e._doc.name);
        window.location.reload();
      });

      back.appendChild(t);
      t.appendChild(thN);
      t.appendChild(thS);
      t.appendChild(thB);
      t.appendChild(thSS);
      t.appendChild(thRR);
      t.appendChild(thRE);
      t.appendChild(tdBtnEdit);
      tdBtnEdit.appendChild(buttonEdit);
      t.appendChild(tdBtnDelete);
      tdBtnDelete.appendChild(buttonDelete);
    });
  }

  if (dataChange == "2") {
    const dataAll = await ipcRenderer.invoke("get-two-data");
    console.log("andamento", dataAll);

    if (!dataAll) {
      document.getElementById("not-exist").style.display = "block";
      document.querySelector("table").style.display = "none";
    } else {
      document.getElementById("not-exist").style.display = "none";
      document.querySelector("table").style.display = "block";
    }

    dataAll.forEach((e) => {
      console.log(e._doc._id);
      const back = document.getElementById("tbody");
      const t = document.createElement("tr");
      // nome
      const thN = document.createElement("td");
      // sala
      const thS = document.createElement("td");
      // book
      const thB = document.createElement("td");
      // situacao
      const thSS = document.createElement("td");
      // retirada date
      const thRR = document.createElement("td");
      // entrega date
      const thRE = document.createElement("td");

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
        current_day.toString() +
        "-" +
        current_month.toString() +
        "-" +
        current_year.toString();

      thN.textContent = e._doc.name;
      thS.textContent = e._doc.class;
      thB.textContent = e._doc.book;

      var __v = "";
      if (e._doc.sit == 1) {
        __v = "Em Andamento";
      }
      if (e._doc.sit == 2) {
        __v = "Em Atraso";
      }
      if (e._doc.sit == 3) {
        __v = "Devolvido";
      }
      thSS.textContent = __v;
      thRR.textContent = all;
      thRE.textContent = e._doc.date;

      const tdBtnEdit = document.createElement("td");
      const buttonEdit = document.createElement("button");

      const buttonDelete = document.createElement("button");
      const tdBtnDelete = document.createElement("td");

      buttonEdit.textContent = "Editar";
      buttonEdit.setAttribute("class", "edt-btn");
      buttonEdit.addEventListener("click", () => {
        toggleModal(modal_edit);

        name_studentEdit.value = e._doc.name;
        serieEdit.value = e._doc.class;
        bookEdit.value = e._doc.book;
        finalDateEdit.value = e._doc.date;
      });

      update_student.addEventListener("click", () => {
        dataEdit = {
          nameUp: name_studentEdit.value,
          serieUp: serieEdit.value,
          bookUp: bookEdit.value,
          finalDateUp: finalDateEdit.value,
        };
        ipcRenderer.send("student_update", dataEdit);
        window.location.reload();
      });

      buttonDelete.textContent = "Apagar";
      buttonDelete.setAttribute("class", "del-btn");

      buttonDelete.addEventListener("click", () => {
        ipcRenderer.send("delete_student", e._doc.name);
        window.location.reload();
      });

      back.appendChild(t);
      t.appendChild(thN);
      t.appendChild(thS);
      t.appendChild(thB);
      t.appendChild(thSS);
      t.appendChild(thRR);
      t.appendChild(thRE);
      t.appendChild(tdBtnEdit);
      tdBtnEdit.appendChild(buttonEdit);
      t.appendChild(tdBtnDelete);
      tdBtnDelete.appendChild(buttonDelete);
    });
  }

  if (dataChange == "3") {
    const dataAll = await ipcRenderer.invoke("get-three-data");

    if (dataAll == null) {
      document.getElementById("not-exist").style.display = "block";
      document.querySelector("table").style.display = "none";
    } else {
      document.getElementById("not-exist").style.display = "none";
      document.querySelector("table").style.display = "block";
    }

    dataAll.forEach((e) => {
      console.log("passou aqui bro" + e._doc._id);
      const back = document.getElementById("tbody");
      const t = document.createElement("tr");
      // nome
      const thN = document.createElement("td");
      // sala
      const thS = document.createElement("td");
      // book
      const thB = document.createElement("td");
      // situacao
      const thSS = document.createElement("td");
      // retirada date
      const thRR = document.createElement("td");
      // entrega date
      const thRE = document.createElement("td");

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
        current_day.toString() +
        "-" +
        current_month.toString() +
        "-" +
        current_year.toString();

      thN.textContent = e._doc.name;
      thS.textContent = e._doc.class;
      thB.textContent = e._doc.book;
      var __v = "";
      if (e._doc.sit == 1) {
        __v = "Em Andamento";
      }
      if (e._doc.sit == 2) {
        __v = "Em Atraso";
      }
      if (e._doc.sit == 3) {
        __v = "Devolvido";
      }
      thSS.textContent = __v;
      thRR.textContent = all;
      thRE.textContent = e._doc.date;

      const tdBtnEdit = document.createElement("td");
      const buttonEdit = document.createElement("button");

      const buttonDelete = document.createElement("button");
      const tdBtnDelete = document.createElement("td");

      buttonEdit.textContent = "Editar";
      buttonEdit.setAttribute("class", "edt-btn");
      buttonEdit.addEventListener("click", () => {
        toggleModal(modal_edit);

        name_studentEdit.value = e._doc.name;
        serieEdit.value = e._doc.class;
        bookEdit.value = e._doc.book;
        finalDateEdit.value = e._doc.date;
      });

      update_student.addEventListener("click", () => {
        dataEdit = {
          nameUp: name_studentEdit.value,
          serieUp: serieEdit.value,
          bookUp: bookEdit.value,
          finalDateUp: finalDateEdit.value,
        };
        ipcRenderer.send("student_update", dataEdit);
        window.location.reload();
      });

      buttonDelete.textContent = "Apagar";
      buttonDelete.setAttribute("class", "del-btn");

      buttonDelete.addEventListener("click", () => {
        ipcRenderer.send("delete_student", e._doc.name);
        window.location.reload();
      });

      back.appendChild(t);
      t.appendChild(thN);
      t.appendChild(thS);
      t.appendChild(thB);
      t.appendChild(thSS);
      t.appendChild(thRR);
      t.appendChild(thRE);
      t.appendChild(tdBtnEdit);
      tdBtnEdit.appendChild(buttonEdit);
      t.appendChild(tdBtnDelete);
      tdBtnDelete.appendChild(buttonDelete);
    });
  }

  if (dataChange == "search") {
    const dataAll = await ipcRenderer.invoke("get-search-data");

    if (dataAll == null) {
      document.getElementById("not-exist").style.display = "block";
      document.querySelector("table").style.display = "none";
    } else {
      document.getElementById("not-exist").style.display = "none";
      document.querySelector("table").style.display = "block";
    }

    dataAll.forEach((e) => {
      const back = document.getElementById("tbody");
      const t = document.createElement("tr");
      // nome
      const thN = document.createElement("td");
      // sala
      const thS = document.createElement("td");
      // book
      const thB = document.createElement("td");
      // situacao
      const thSS = document.createElement("td");
      // retirada date
      const thRR = document.createElement("td");
      // entrega date
      const thRE = document.createElement("td");

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
        current_day.toString() +
        "-" +
        current_month.toString() +
        "-" +
        current_year.toString();

      thN.textContent = e._doc.name;
      thS.textContent = e._doc.class;
      thB.textContent = e._doc.book;
      var __v = "";
      if (e._doc.sit == 1) {
        __v = "Em Andamento";
      }
      if (e._doc.sit == 2) {
        __v = "Em Atraso";
      }
      if (e._doc.sit == 3) {
        __v = "Devolvido";
      }
      thSS.textContent = __v;
      thRR.textContent = all;
      thRE.textContent = e._doc.date;

      const tdBtnEdit = document.createElement("td");
      const buttonEdit = document.createElement("button");

      const buttonDelete = document.createElement("button");
      const tdBtnDelete = document.createElement("td");

      buttonEdit.textContent = "Editar";
      buttonEdit.setAttribute("class", "edt-btn");
      buttonEdit.addEventListener("click", () => {
        toggleModal(modal_edit);

        name_studentEdit.value = e._doc.name;
        serieEdit.value = e._doc.class;
        bookEdit.value = e._doc.book;
        finalDateEdit.value = e._doc.date;
      });

      update_student.addEventListener("click", () => {
        dataEdit = {
          nameUp: name_studentEdit.value,
          serieUp: serieEdit.value,
          bookUp: bookEdit.value,
          finalDateUp: finalDateEdit.value,
        };
        ipcRenderer.send("student_update", dataEdit);
        window.location.reload();
      });

      buttonDelete.textContent = "Apagar";
      buttonDelete.setAttribute("class", "del-btn");

      buttonDelete.addEventListener("click", () => {
        ipcRenderer.send("delete_student", e._doc.name);
        window.location.reload();
      });

      back.appendChild(t);
      t.appendChild(thN);
      t.appendChild(thS);
      t.appendChild(thB);
      t.appendChild(thSS);
      t.appendChild(thRR);
      t.appendChild(thRE);
      t.appendChild(tdBtnEdit);
      tdBtnEdit.appendChild(buttonEdit);
      t.appendChild(tdBtnDelete);
      tdBtnDelete.appendChild(buttonDelete);
    });
  }
});
