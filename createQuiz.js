// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmwJkuxoy2JEUbHzSAL7SQnuGOjWQ71FQ",
  authDomain: "sinavtakip-24a93.firebaseapp.com",
  databaseURL: "https://sinavtakip-24a93-default-rtdb.firebaseio.com",
  projectId: "sinavtakip-24a93",
  storageBucket: "sinavtakip-24a93.appspot.com",
  messagingSenderId: "640235953301",
  appId: "1:640235953301:web:a727fa13351c1460914f9c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);

//!dom başlarken select options içerisine quizlerin başlıklarını getirdim
//*quiz1,quiz2
document.addEventListener("DOMContentLoaded", function () {
  let filterQuizs = document.querySelector(".filterQuizs");
  const db = getDatabase();
  const countRef = ref(db, "sinavlar/");
  onValue(countRef, (snapshot) => {
    let data = Object.keys(snapshot.val());
    console.log(data.length);
    for (const i of data) {
      filterQuizs.innerHTML += `
            <option>${i}</option>
        `;
    }
  });
});

//!yeni bir quiz yaratılıyor
document.querySelector(".createQuizBtn").addEventListener("click", function () {
  let soru = document.querySelector(".soru").value;
  let cevap1 = document.querySelector(".cevap1").value;
  let cevap2 = document.querySelector(".cevap2").value;
  let cevap3 = document.querySelector(".cevap3").value;
  let cevap4 = document.querySelector(".cevap4").value;
  let filterQuizs = document.querySelector(".filterQuizs").value;
  const db = getDatabase();

  const queryRef = ref(db, `sinavlar/${filterQuizs}`);
  get(queryRef).then((snapshot) => {

    //?her quizin bir birinden farklı olması için 8 karakterli id ürettim
    let quizId = ""
    for(let i=0;i<8;i++){
      let rstQuizId = Math.floor(Math.random() * 10)
      quizId += rstQuizId 
    }

    set(ref(db, `sinavlar/${filterQuizs}/sorular/${quizId}`), {
        soru: soru,
        cevap1: cevap1,
        cevap2: cevap2,
        cevap3: cevap3,
        cevap4: cevap4,
    });
  });
  //   .catch((error) => {
  //     console.error("Soru sayısı alınırken hata oluştu:", error);
  //   });
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

    // .then(() => {
    //   console.log("Yeni quiz başlığı başarıyla oluşturuldu.");
    // })
    // .catch((error) => {
    //   console.error("Quiz başlığı oluşturulurken hata oluştu:", error);
    // });
  });
