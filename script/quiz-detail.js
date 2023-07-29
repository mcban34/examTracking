import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

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

let quizs;

//!tıklanılan quizin adını aldım
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get("id");

const db = getDatabase();
const countRef = ref(db, "sinavlar/");
onValue(countRef, (snapshot) => {
  let data = snapshot.val();

  const questionsArray = Object.keys(data).map((key, index) => {
    return {
      id: index,
      ...data[key],
    };
  });

  //*hangi quizin geleceği filtreledim
  const quizDetail = questionsArray.find((value) => value.id == quizId);

  //*öğrenciye hangi quizi çözdüğünü disabled olarak inputda gösterdim
  document.querySelector(".quizName").value = quizDetail.quizBilgi.name;

  //*quiz detayında gelen o quize ait bütün soruları obje haline çevirdim
  quizs = Object.values(quizDetail.sorular);
});

const rstGetQuiz = () => {
  let rstQuizIndex = Math.floor(Math.random() * quizs.length);
  let rstQuiz = quizs[rstQuizIndex];
  quizs.splice(rstQuizIndex, 1);
  return rstQuiz;
  // if (quizs.length != 0) {
  //   return rstQuiz;
  // }
};

let ogrenciBilgileri = {};

//!sınava başla butonu
document.querySelector(".quizNext").addEventListener("click", function () {
  let quizName = document.querySelector(".quizName").value;
  let quizStartNameSurName = document.querySelector(
    ".quizStartNameSurName"
  ).value;

  ogrenciBilgileri["ogrenciIsimSoyisim"] = quizStartNameSurName;
  ogrenciBilgileri["quizName"] = quizName;

  document.querySelector(".quizStart").style.display = "none";
  document.querySelector(".quiz").style.display = "block";

  let gelenSoru
  function yeniSoru() {
    gelenSoru = rstGetQuiz();
    console.log(gelenSoru);
    document.querySelector(".soru").innerHTML = gelenSoru.soru;

    let cevapButtons = document.querySelectorAll(".cevapButton");

    for (let i = 0; i < cevapButtons.length; i++) {
      cevapButtons[i].innerHTML = gelenSoru.cevaplar[i];
    }
    console.log(cevapButtons);
  }
  yeniSoru();

  const cevapButtons = document.querySelectorAll(".cevapButton");
  cevapButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const cevapIndex = parseInt(button.dataset.cevap, 10);
      cevapla(cevapIndex);
    });
  });

  let dogruSayi = 0;
  function cevapla(cevapIndex) {
    // const suankiSoru = sorular[suankiSoruIndex];
    if (cevapIndex === gelenSoru.dogruCevap) {
      // Doğru cevap verildi, kullanıcıya geri bildirim verilebilir
      dogruSayi++;
      console.log("dogru bildin!", dogruSayi);
    } else {
      // Yanlış cevap verildi, kullanıcıya geri bildirim verilebilir
    }

    // Sonraki soruya geç
    // suankiSoruIndex++;
    yeniSoru();
  }

  // const quizHTML = () => {
  //   let gelenQuiz = rstGetQuiz()
  //   const quizContent = document.querySelector(".quizContent");
  //   document.querySelector(".quizTitle").innerHTML = gelenQuiz.soru;
  //   Object.entries(gelenQuiz).forEach(([anahtar, deger]) => {
  //     if (anahtar.includes("cevap")) {
  //       const button = document.createElement("button");
  //       button.className = "cevap";
  //       button.textContent = deger;
  //       quizContent.append(button);
  //     }
  //   });
  // };
  // quizHTML()

  // let cevaplar = document.querySelectorAll(".cevap");
  // for (const i of cevaplar) {
  //   i.addEventListener("click", () => {
  //     quizHTML()
  //   });
  // }

  //!öğrenciden bilgileri aldım şuanda kayıt yapılıyor
  //*yapmam gereken tam olarak şu şuanda doğrudan öğrenci adı ve quizname yüklemek yanlış
  //*çünkü öğrencinin aldığı puanıda eklemem gerekiyor dbye (üzerinde güncelleme yapabiliyorsak olabilir)
  //*ilk olarak yapılması gerek "quizs" değişkeni içerisinde sorular mevcut ve rstgele sorular çekmek istiyorum
});
