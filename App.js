// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
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

//!databasedeki quizleri çektim
// document.querySelector(".getQuiz").addEventListener("click", function () {

// });

const getQuizs = () => {
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
    console.log(questionsArray);

    const questionsArrayHTML = questionsArray.map((value) => {
      return `
        <div class="col-3">
          <div class="quizCard">
            <h2>${value.name}</h2>
          </div>
        </div>
      `;
    });
    document.querySelector(".quizsContent").innerHTML = questionsArrayHTML.join("")
  });
};

document.addEventListener("DOMContentLoaded", getQuizs());
