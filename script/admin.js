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
  if (!user) {
    window.location.href = "login.html";
  }
});

let panelsBtn = document.querySelectorAll(".panel")
for (const panel of panelsBtn) {
  panel.addEventListener("click", function() {
    // Önce tüm panellerin üzerindeki "activePanelBtn" sınıfını kaldırın
    for (const otherPanel of panelsBtn) {
      otherPanel.classList.remove("activePanelBtn");
    }
    
    // Sadece tıklanan panele "activePanelBtn" sınıfını ekleyin
    panel.classList.add("activePanelBtn");
  });
}

//!admin paneline öğrenciler,gruplar,sınavlar vs. hakkında bilgiyi card şeklinde getirdim
document.addEventListener("DOMContentLoaded", async function () {
  const db = getDatabase();
  const countRefOgrenciler = await ref(db, "ogrenciler/");
  onValue(countRefOgrenciler, (snapshot) => {
    //*toplam ogrenciler listelendi
    let data = Object.values(snapshot.val());
    document.querySelector(".toplamOgrenci").innerHTML = `${data.length}+`

    const cozulenSinavlar = []
    for (const i of data) {
      for (const j of i.sinavlar) {
        if (j.quizBilgi.cozulduMu == true) {
          cozulenSinavlar.push({
            quizPuan: j.quizBilgi.puan
          })
        }
      }
    }

    let toplamSinavPuanlari = 0
    cozulenSinavlar.forEach(element => {
      toplamSinavPuanlari += element.quizPuan
    });
    document.querySelector(".ogrencilerOrtalama").innerHTML = `${(toplamSinavPuanlari / cozulenSinavlar.length).toFixed(2)}+`
  })

  //*toplam sınavlar listelendi
  const countRefSinavlar = await ref(db, "sinavlar/");
  onValue(countRefSinavlar, (snapshot) => {
    let data = Object.values(snapshot.val());
    document.querySelector(".toplamSinav").innerHTML = `${data.length}+`
  })

  //*tüm gruplar listelendi
  const countRefGruplar = await ref(db, "gruplar/");
  onValue(countRefGruplar, (snapshot) => {
    let data = Object.values(snapshot.val());
    document.querySelector(".toplamGrup").innerHTML = `${data.length}+`
  })

})

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
  }), (error) => {
    console.log("kodlar gelmedi!", error);
  }
});


//!datatableyi gruplara göre filtrelemek için fonksiyon yarattım
let filterGroupButtons = document.querySelector(".filterGroupButton")
const getFilterGrupButtons = async () => {
  try {
    const db = getDatabase();
    const countRef = ref(db, "gruplar/");
    const snapshot = await get(countRef);
    let data = Object.values(snapshot.val());
    for (const i of data) {
      let filterGroupBtn = document.createElement("button")
      filterGroupBtn.textContent = i.grup.Grupname
      filterGroupBtn.addEventListener("click", function () {
        const group = this.innerHTML;

        filterTableByGroup(group);

        //!filtreleme butonuna tıklandığında grubun genel ortalamasını alıyoruz
        let ogrenciNotlari = []
        let ogreciNotu = document.querySelectorAll(".ogrenciNotu")
        console.log(ogreciNotu);
        for (const i of ogreciNotu) {
          ogrenciNotlari.push(+i.innerHTML)
        }

        let grupOrtalaması = 0
        for (const i of ogrenciNotlari) {
          grupOrtalaması += i
        }

        document.querySelector(".grupNotOrtalama").innerHTML = `${group} Grubunun Not Ortalaması : ${(grupOrtalaması / ogrenciNotlari.length).toFixed(2)}`

      })

      //!burada filtreleme işlemlerini gerçekleştirdim
      function filterTableByGroup(group) {
        const table = $('#dataTableFilter').DataTable();
        table.search(group).draw();
      }
      filterGroupButtons.prepend(filterGroupBtn)
    }
  } catch (error) {
    console.error("Veriler alınırken bir hata oluştu:", error);
  }
};
getFilterGrupButtons()

//!gruplara göre filtrelenen veriyi sildim
document.querySelector(".clearGroupFilter").addEventListener("click", function () {
  clearDataTable()
  document.querySelector(".grupNotOrtalama").innerHTML = ""
})

//!datatable clear eden fonksiyon
const clearDataTable = () => {
  let table = $('#dataTableFilter').DataTable();
  table.search("").draw()
}


//!select options ile öğrencileri filtreleme
//*ilk select dolduruldu
const filterByGroup = async () => {
  const db = getDatabase();
  const countRef = ref(db, "gruplar/");
  const snapshot = await get(countRef);
  let data = Object.values(snapshot.val())
  let selectGrup = document.querySelector(".selectGrup")
  for (const i of data) {
    let newSelect = document.createElement("option")
    newSelect.innerHTML = i.grup.Grupname
    selectGrup.prepend(newSelect)
  }
};
filterByGroup()

//*ilk selectin verisine göre öğrenci isimleri filtrelendi
document.querySelector(".selectGrup").addEventListener("change", async function () {
  document.querySelector(".selectOgreci").innerHTML = ""
  let selectGrup = document.querySelector(".selectGrup").value
  const db = getDatabase();
  const countRef = ref(db, "ogrenciler/");
  const snapshot = await get(countRef);
  let ogrenciler = Object.values(snapshot.val())
  console.log(ogrenciler);
  let ogrenciİsimSoyisim = []
  let filtrlenilenOgrenciler = ogrenciler.filter(item => item.ogrenciBilgi.grupName == selectGrup)
  console.log(filtrlenilenOgrenciler);
  for (const i of filtrlenilenOgrenciler) {
    ogrenciİsimSoyisim.push(i.ogrenciBilgi.kullaniciAdi)
  }
  ogrenciİsimSoyisim = [...new Set(ogrenciİsimSoyisim)];

  let selectOgreci = document.querySelector(".selectOgreci")
  for (const i of ogrenciİsimSoyisim) {
    let newSelect = document.createElement("option")
    newSelect.innerHTML = i
    selectOgreci.prepend(newSelect)
  }
})

//*2. selectreki öğrenci ismini göre filtreleme butonuna tıklandığında datatablede öğrenciler filtrelendi
document.querySelector(".filterOgrenci").addEventListener("click", function () {
  let selectOgreci = document.querySelector(".selectOgreci")
  const table = $('#dataTableFilter').DataTable();
  table.search(selectOgreci.value).draw()

  let ogrenciNotlari = []
  let ogreciNotu = document.querySelectorAll(".ogrenciNotu")
  console.log(ogreciNotu);
  for (const i of ogreciNotu) {
    ogrenciNotlari.push(+i.innerHTML)
  }

  let grupOrtalaması = 0
  for (const i of ogrenciNotlari) {
    grupOrtalaması += i
  }

  document.querySelector(".ogrenciOrtalama").innerHTML = `${selectOgreci.value} Not Ortalaması : ${(grupOrtalaması / ogrenciNotlari.length).toFixed(2)}`
})

//*öğrenci filtrelemesi sıfırlandı
document.querySelector(".clearOgrenciFilter").addEventListener("click", function () {
  clearDataTable()
  document.querySelector(".ogrenciOrtalama").innerHTML = ""
})


//!öğrenci notlarını çektim
const ogrenciNotlariAsync = async () => {
  const ogrenciSonuclari = [];
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get("id");
    const db = getDatabase();
    const countRef = ref(db, `ogrenciler/`);
    const snapshot = await get(countRef);
    let data = Object.values(snapshot.val());

    //*çözülen sınavları aldım
    const cozulenSinavlar = []
    for (const i of data) {
      for (const j of i.sinavlar) {
        if (j.quizBilgi.cozulduMu == true && j.quizBilgi.puan > 0) {
          cozulenSinavlar.push(
            {
              sinavSonuclar: i.sinavlar,
              OgrenciBilgiler: i.ogrenciBilgi
            }
          )
          break
        }
      }
    }

    datatableVerileriGoster(cozulenSinavlar);
    // //!çekilen öğrenci notlarını tadatable şekilde olan fonksiyonuma parametre olarak gönderdim
  } catch (error) {
    console.error("Veriler alınırken bir hata oluştu:", error);
  }
};

ogrenciNotlariAsync();

//!sınava giren öğrencilerin bilgilerini panele yazdırdım
function datatableVerileriGoster(veriListesi) {
  const tbody = document.getElementById("dataTableBody");
  const tbodyFilter = document.getElementById("dataTableBodyFilter")
  tbody.innerHTML = "";
  tbodyFilter.innerHTML = "";
  //*panelde öğrenci notlarını iki farklı yerde gösterdim
  //*ana sayfada ve öğrenci filtreleme alanın, data tableyi yazarken
  //*aynı işlevleri kullanacağım için bir parametre oluşturdum ve hemen aşşağıda parametreye
  //*değerler gönderdim
  function dataTableLists(tbodyParametr,ogrenciClass) {
    veriListesi.forEach((veri) => {
      for (const i of veri.sinavSonuclar) {
        if (i.quizBilgi.cozulduMu == true) {
          const row = document.createElement("tr");

          const quizNameCell = document.createElement("td");
          quizNameCell.textContent = i.quizBilgi.name;
          // console.log(i.quizBilgi);
          row.appendChild(quizNameCell);

          const nameSurnameCell = document.createElement("td");
          nameSurnameCell.textContent = veri.OgrenciBilgiler.kullaniciAdi;
          row.appendChild(nameSurnameCell);

          const sinavSonucCell = document.createElement("td");
          sinavSonucCell.textContent = i.quizBilgi.puan;
          //*parametre tanımsız dönerse boş at dönmezse ogrenciNotu adında class ver!
          sinavSonucCell.className = `${ogrenciClass==undefined ? "" : ogrenciClass}`;
          row.appendChild(sinavSonucCell);

          const grupNameCell = document.createElement("td");
          grupNameCell.textContent = veri.OgrenciBilgiler.grupName;
          row.appendChild(grupNameCell);

          tbodyParametr.append(row);
        }
      }
    });
  }
  dataTableLists(tbody)
  dataTableLists(tbodyFilter,"ogrenciNotu")

  //*datatableye verileri bastım
  $('#dataTableFilter').DataTable({
    language: {
      "url": "https://cdn.datatables.net/plug-ins/1.13.6/i18n/tr.json"
    },
    pageLength: 10,
    lengthMenu: [5, 10, 25, 50, 100, 500, 1000],
    // paging: true,
    // scrollCollapse: true,
    // scrollY: '300px'
  });
  $('#dataTable').DataTable({
    language: {
      "url": "https://cdn.datatables.net/plug-ins/1.13.6/i18n/tr.json"
    },
    pageLength: 10,
    lengthMenu: [5, 10, 25, 50, 100],
    // paging: true,
    // scrollCollapse: true,
    // scrollY: '300px'
  });

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
    let quizGenelKategori = document.querySelector(".quizGenelKategori").value
    quizEtiket = quizEtiket.split(",");

    const db = getDatabase();
    set(ref(db, "sinavlar/" + quizTitle), {
      quizBilgi: {
        name: quizTitle,
        quizContentBody: quizContentBody,
        quizEtiket: quizEtiket,
        quizCategory: quizGenelKategori,
        cozulduMu: false,
        puan: 0
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