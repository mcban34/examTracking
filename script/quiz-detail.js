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

//!tıklanılan quizin adını aldım
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get("id");
console.log(quizId);

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
  const quizDetail = questionsArray.find(value => value.id==quizId)
  
  //*öğrenciye hangi quizi çözdüğünü disabled olarak inputda gösterdim 
  document.querySelector(".quizName").value = quizDetail.quizBilgi.name

  //*quiz detayında gelen o quize ait bütün soruları obje haline çevirdim
  let quizs = Object.values(quizDetail.sorular)
  console.log(quizs);

});


document.querySelector(".quizStartBtn").addEventListener("click",function(){
    let quizName = document.querySelector(".quizName").value
    let quizStartNameSurName = document.querySelector(".quizStartNameSurName").value
    
    const db = getDatabase();
    set(ref(db, 'ogrenciler/' + quizStartNameSurName + quizName) , {
        quizName : quizName,
        quizStartNameSurName : quizStartNameSurName
    })
})
