window.addEventListener("DOMContentLoaded", async () => {
  const { ipcRenderer, ipcMain } = require("electron");
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

  let data;

  // send data

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

  const dataAll = await ipcRenderer.invoke("get-all-data");

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
    let current_month = today.getMonth();
    let current_year = today.getFullYear();

    if (current_month <= 9) {
      current_month = "0" + current_month;
    }

    let all =
      current_day.toString() +
      "/" +
      current_month.toString() +
      "/" +
      current_year.toString();

    thN.textContent = e._doc.name;
    thS.textContent = e._doc.class;
    thB.textContent = e._doc.book;

    thSS.textContent = "nada por enquanto";
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
});
