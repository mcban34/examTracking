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
console.log(app);

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
          <a href="#">
            <div class="quizCard">
              <h2>${value.quizBilgi.name}</h2>
              <p>${value.quizBilgi.quizContentBody}</p>
            </div>
          </a>
        </div>
      `;
    });
    document.querySelector(".quizsContent").innerHTML =
      questionsArrayHTML.join("");
  });
};

document.addEventListener("DOMContentLoaded", function(){
  
});
document.addEventListener("DOMContentLoaded", getQuizs());
