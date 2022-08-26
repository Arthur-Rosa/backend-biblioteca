window.addEventListener("DOMContentLoaded", async () => {
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

  let data;

  // send data
  function sendData() {
    data = {
      name: name_student.value,
      serie: serie.value,
      book: book.value,
      finalDate: finalDate.value,
    };

    alert("Aluno adicionado!");
    toggleModal(modal);
    return data;
  }

  const { ipcRenderer } = require("electron");
  const buttonSend = document.querySelector("#sendDataStudent");

  buttonSend.addEventListener("click", () => {
    if (
      name_student.value == "" ||
      serie.value == "" ||
      book.value == "" ||
      finalDate.value == ""
    ) {
      alert("Preencha todos os campos!");
      return;
    } else {
      ipcRenderer.send("data_student", sendData());
    }
  });

  const dataAll = await ipcRenderer.invoke("get-all-data");

  dataAll.forEach((e) => {
    console.log(e._doc.name);
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

    thSS.textContent = "Nada Por Enquanto";
    thRR.textContent = "99/99/9999";
    thRE.textContent = e._doc.date;

    const tdBtn1 = document.createElement("td");
    const button = document.createElement("button");

    const button2 = document.createElement("button");
    const tdBtn2 = document.createElement("td");

    back.appendChild(t);
    t.appendChild(thN);
    t.appendChild(thS);
    t.appendChild(thB);
    t.appendChild(thSS);
    t.appendChild(thRR);
    t.appendChild(thRE);
    t.appendChild(tdBtn1);
    tdBtn1.appendChild(button);
    t.appendChild(tdBtn2);
    tdBtn2.appendChild(button2);
  });
});
