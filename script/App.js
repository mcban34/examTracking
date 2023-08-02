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
    console.log(data);
    const questionsArray = Object.keys(data).map((key, index) => {
      return {
        id: index,
        ...data[key],
      };
    });

    

    console.log(questionsArray);

    const questionsArrayHTML = questionsArray.map((value) => {
      return `
        <div class="col-lg-3">
          <a href="quiz-detail.html?id=${value.id}">
            <div class="quizCard">
              <h5>${value.quizBilgi.name}</h5>
              <div class="quizCardBody">
                <div class="quizCardImg">
                  <img src="img/quizCard.jpg">
                </div>
                <div class="quizCardEtiket">
                
                </div>
              </div>
            </div>
          </a>
        </div>
      `;
    });
    document.querySelector(".quizsContent").innerHTML =
      questionsArrayHTML.join("");

    //!ana sayfadaki quizlerin etiketleri getirildi
    let quizCardEtiket = document.querySelectorAll(".quizCardEtiket")
    for(let i=0;i<questionsArray.length;i++){
      for(let j=0;j<questionsArray[i].quizBilgi.quizEtiket.length;j++){
        let quizCardEtiketSpan = document.createElement("span")
        quizCardEtiketSpan.className="quizCardEtiketSpan"
        quizCardEtiketSpan.textContent=questionsArray[i].quizBilgi.quizEtiket[j]
        quizCardEtiket[i].append(quizCardEtiketSpan)
      }
      console.log(questionsArray[i].quizBilgi.quizEtiket);
    }
  });




};

document.addEventListener("DOMContentLoaded", function(){
  
});
document.addEventListener("DOMContentLoaded", getQuizs());
