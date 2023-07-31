import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  onValue,
  get,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAmwJkuxoy2JEUbHzSAL7SQnuGOjWQ71FQ",
  authDomain: "sinavtakip-24a93.firebaseapp.com",
  databaseURL: "https://sinavtakip-24a93-default-rtdb.firebaseio.com",
  projectId: "sinavtakip-24a93",
  storageBucket: "sinavtakip-24a93.appspot.com",
  messagingSenderId: "640235953301",
  appId: "1:640235953301:web:a727fa13351c1460914f9c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

//!kullanıcı girişli değilse admin sayfasına geri dönecektir
onAuthStateChanged(auth, (user) => {
  // console.log(user);
  if (!user) {
    window.location.href = "login.html";
  }
});

//!dom başlarken select options içerisine quizlerin başlıklarını getirdim
document.addEventListener("DOMContentLoaded", function () {
  let filterQuizs = document.querySelector(".filterQuizs");
  const db = getDatabase();
  const countRef = ref(db, "sinavlar/");
  onValue(countRef, (snapshot) => {
    let data = Object.keys(snapshot.val());
    for (const i of data) {
      filterQuizs.innerHTML += `
            <option>${i}</option>
        `;
    }
  });
});

//!dom başlarken select options içerisine grupların başlıklarını getirdim



//!öğrenci notlarını çektim
const ogrenciNotlariAsync = async () => {
  const ogrenciSonuclari = [];
  try {

    const db = getDatabase();
    const countRef = ref(db, "ogrenciler/");
    const snapshot = await get(countRef);
    let data = snapshot.val();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const veri = data[key];
        ogrenciSonuclari.push(veri);
      }
    }
    console.log(ogrenciSonuclari);
    //!çekilen öğrenci notlarını tadatable şekilde olan fonksiyonuma parametre olarak gönderdim
    datatableVerileriGoster(ogrenciSonuclari);
  } catch (error) {
    console.error("Veriler alınırken bir hata oluştu:", error);
  }
};

ogrenciNotlariAsync();

//!sınava giren öğrencilerin bilgilerini panele yazdırdım
function datatableVerileriGoster(veriListesi) {
  const tbody = document.getElementById("dataTableBody");
  tbody.innerHTML = "";

  veriListesi.forEach((veri) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = veri.quizName;
    row.appendChild(nameCell);

    const quizStartNameSurNameCell = document.createElement("td");
    quizStartNameSurNameCell.textContent = veri.quizStartNameSurName;
    row.appendChild(quizStartNameSurNameCell);

    const sinavSonucCell = document.createElement("td");
    sinavSonucCell.textContent = veri.sinavSonuc;
    row.appendChild(sinavSonucCell);

    const grupName = document.createElement("td");
    grupName.textContent = veri.grupName;
    row.appendChild(grupName);

    tbody.appendChild(row);
  });
  $('#dataTable').DataTable({
    pageLength: 20
  });
}


//!data tableyi butonlara göre filtreledim mesela gruplara göre
document.querySelector('.filterByGroup').addEventListener('click', function() {
  const group = this.getAttribute('data-group');
  filterTableByGroup(group);
});

function filterTableByGroup(group) {
  const table = $('#dataTable').DataTable();
  table.search(group).draw();
}


//!yeni bir quiz yaratılıyor
document.querySelector(".createQuizBtn").addEventListener("click", function () {
  let soru = document.querySelector(".soru").value;
  let cevap1 = document.querySelector(".cevap1").value;
  let cevap2 = document.querySelector(".cevap2").value;
  let cevap3 = document.querySelector(".cevap3").value;
  let cevap4 = document.querySelector(".cevap4").value;
  let dogruCevap = +document.querySelector(".dogruCevap").value;
  let filterQuizs = document.querySelector(".filterQuizs").value;
  const db = getDatabase();

  const queryRef = ref(db, `sinavlar/${filterQuizs}`);
  get(queryRef).then(() => {
    //?her quizin bir birinden farklı olması için 8 karakterli id ürettim
    let quizId = "";
    for (let i = 0; i < 8; i++) {
      let rstQuizId = Math.floor(Math.random() * 10);
      quizId += rstQuizId;
    }

    set(ref(db, `sinavlar/${filterQuizs}/sorular/${quizId}`), {
      soru: soru,
      dogruCevap: dogruCevap,
      cevaplar: [cevap1, cevap2, cevap3, cevap4],
    });
  });
  location.reload();
});

//!yeni bir quiz başlığı yaratıyoruz
document
  .querySelector(".createQuizTitle")
  .addEventListener("click", function () {
    let quizTitle = document.querySelector(".quizTitle").value;
    let quizContentBody = document.querySelector(".quizContentBody").value;
    let quizEtiket = document.querySelector(".quizEtiket").value;
    quizEtiket = quizEtiket.split(",");

    const db = getDatabase();
    set(ref(db, "sinavlar/" + quizTitle), {
      quizBilgi: {
        name: quizTitle,
        quizContentBody: quizContentBody,
        quizEtiket: quizEtiket,
      },
    });
    location.reload();
  });


//!grup yaratıldı
document.querySelector(".createGroup").addEventListener("click", function () {
  let grupName = document.querySelector(".grupName").value
  const db = getDatabase();
  set(ref(db, "gruplar/" + grupName), {
    grup: {
      Grupname: grupName,
    },
  });

})



//!çıkış
document.querySelector(".quit").addEventListener("click", function () {
  signOut(auth)
    .then(() => {
      console.log("çıkış yapıldı");
    })
    .catch(() => {
      console.log("çıkış yapılamadı!");
    });
});


//!datatableyi xlsx formatında indirme fonksiyonu
document.querySelector(".downloadTable").addEventListener("click", function () {
  function exportToExcel() {
    const table = document.getElementById("dataTable");
    const rows = table.getElementsByTagName("tr");
    const data = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const cells = row.getElementsByTagName("td");
      const rowData = [];

      for (let j = 0; j < cells.length; j++) {
        rowData.push(cells[j].innerText);
      }

      data.push(rowData);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Dosya adını ve türünü belirleyin
    const fileName = "myData.xlsx";
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    // Dosyayı indirme bağlantısını oluşturun ve tıklayın
    const blob = new Blob([s2ab(XLSX.write(workbook, { bookType: "xlsx", type: "binary" }))], {
      type: fileType,
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }
  exportToExcel()
  // Yardımcı fonksiyon: string to array buffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
})