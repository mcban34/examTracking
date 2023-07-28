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
  console.log(quizs);
});

const rstGetQuiz = () => {
  let rstQuizIndex = Math.floor(Math.random() * quizs.length);
  let rstQuiz = quizs[rstQuizIndex];
  quizs.splice(rstQuizIndex, 1);
  if (quizs.length != 0) {
    return rstQuiz;
  } else {
    return console.log("quizler bitti");
  }
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

  const quizContent = document.querySelector(".quizContent");
  document.querySelector(".quizTitle").innerHTML = quizs[0].soru
  Object.entries(quizs[0]).forEach(([anahtar, deger]) => {
    if (anahtar.includes("cevap")) {
      const button = document.createElement("button");
      button.className = "cevap";
      button.textContent = deger;
      quizContent.append(button);
    }
  });

  let cevaplar = document.querySelectorAll(".cevap")
  for (const i of cevaplar) {
      i.addEventListener("click",() => {
        console.log(i.innerHTML);
      })
  }

  //!öğrenciden bilgileri aldım şuanda kayıt yapılıyor
  //*yapmam gereken tam olarak şu şuanda doğrudan öğrenci adı ve quizname yüklemek yanlış
  //*çünkü öğrencinin aldığı puanıda eklemem gerekiyor dbye (üzerinde güncelleme yapabiliyorsak olabilir)
  //*ilk olarak yapılması gerek "quizs" değişkeni içerisinde sorular mevcut ve rstgele sorular çekmek istiyorum
});
