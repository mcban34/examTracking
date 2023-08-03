import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
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
const auth = getAuth(app);
console.log(auth);


const getQuizs = () => {
  const auth = getAuth();
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      document.querySelector(".emailName").innerHTML=user.email

      const db = getDatabase();
      const countRef = ref(db, "ogrenciler/" + user.uid + "/sinavlar/");
      onValue(countRef, (snapshot) => {
        let data = snapshot.val();
        console.log(data);
        const questionsArray = Object.keys(data).map((key, index) => {
          return {
            id: index,
            ...data[key],
          };
        });
        console.log("quisteion",questionsArray);
      const questionsArrayHTML = questionsArray.map((value) => {
      return `
        <div class="col-lg-3 mt-4">
          <a href="quiz-detail.html?id=${value.id}" class="${value.quizBilgi.cozulduMu==true ? "disabledCard" : "" }">
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
    function getCardEtiket() {
      let quizCardEtiket = document.querySelectorAll(".quizCardEtiket")
      for (let i = 0; i < questionsArray.length; i++) {
        for (let j = 0; j < questionsArray[i].quizBilgi.quizEtiket.length; j++) {
          let quizCardEtiketSpan = document.createElement("span")
          quizCardEtiketSpan.className = "quizCardEtiketSpan"
          quizCardEtiketSpan.textContent = questionsArray[i].quizBilgi.quizEtiket[j]
          quizCardEtiket[i].append(quizCardEtiketSpan)
        }
      }
    }
    getCardEtiket()
    });  
        //!ana sayfadaki quiz filtreleme butonları
    let quizsFilterButton = document.querySelectorAll(".quizsFilterButton")
    quizsFilterButton[0].classList.add("activeQuizFilterButton")
    for (const i of quizsFilterButton) {
      i.addEventListener("click", function () {
        var filteredQuizzes = [];

        if (i.innerHTML === "Hepsi") {
          // Tüm sınavları listele
          filteredQuizzes = questionsArray;
        } else {
          // Belirli kategorideki sınavları filtrele
          filteredQuizzes = questionsArray.filter(function (quiz) {
            return quiz.quizBilgi.quizCategory.includes(i.innerHTML);
          });
        }
        // seçilene active class ekle
        for (var j = 0; j < quizsFilterButton.length; j++) {
          quizsFilterButton[j].classList.remove("activeQuizFilterButton");
        }
        i.classList.add("activeQuizFilterButton")
        displayQuizzes(filteredQuizzes);
      })
    }

    //*seçilen quiz btn göre ekrana yazdırma işlemi
    function displayQuizzes(quizzes) {
      var outputDiv = document.querySelector(".quizsContent");
      outputDiv.innerHTML = "";

      if (quizzes.length === 0) {
        outputDiv.textContent = "Bu kategoriye ait sınav bulunamadı.";
      } else {
        const questionsArrayHTML = quizzes.map((value) => {
          return `
            <div class="col-lg-3 mt-4">
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
        let quizCardEtiket = document.querySelectorAll(".quizCardEtiket")
        for (let i = 0; i < quizzes.length; i++) {
          for (let j = 0; j < quizzes[i].quizBilgi.quizEtiket.length; j++) {
            let quizCardEtiketSpan = document.createElement("span")
            quizCardEtiketSpan.className = "quizCardEtiketSpan"
            quizCardEtiketSpan.textContent = quizzes[i].quizBilgi.quizEtiket[j]
            quizCardEtiket[i].append(quizCardEtiketSpan)
          }
        }
      }
    }
    } else {
      // User is signed out
      // ...
      // document.querySelector(".quizsContent").style.display="none"
    }
  }); 
};

document.addEventListener("DOMContentLoaded", getQuizs());


document.querySelector(".quit").addEventListener("click", function () {
  signOut(auth)
    .then(() => {
      console.log("çıkış yapıldı");
    })
    .catch(() => {
      console.log("çıkış yapılamadı!");
    });
});



// const getQuizs = () => {
//   const db = getDatabase();
//   const countRef = ref(db, "sinavlar/");
//   onValue(countRef, (snapshot) => {
//     let data = snapshot.val();
//     const questionsArray = Object.keys(data).map((key, index) => {
//       return {
//         id: index,
//         ...data[key],
//       };
//     });

//     const questionsArrayHTML = questionsArray.map((value) => {
//       return `
//         <div class="col-lg-3 mt-4">
//           <a href="quiz-detail.html?id=${value.id}">
//             <div class="quizCard">
//               <h5>${value.quizBilgi.name}</h5>
//               <div class="quizCardBody">
//                 <div class="quizCardImg">
//                   <img src="img/quizCard.jpg">
//                 </div>
//                 <div class="quizCardEtiket">
                
//                 </div>
//               </div>
//             </div>
//           </a>
//         </div>
//       `;
//     });
//     document.querySelector(".quizsContent").innerHTML =
//       questionsArrayHTML.join("");

//     //!ana sayfadaki quizlerin etiketleri getirildi
//     function getCardEtiket() {
//       let quizCardEtiket = document.querySelectorAll(".quizCardEtiket")
//       for (let i = 0; i < questionsArray.length; i++) {
//         for (let j = 0; j < questionsArray[i].quizBilgi.quizEtiket.length; j++) {
//           let quizCardEtiketSpan = document.createElement("span")
//           quizCardEtiketSpan.className = "quizCardEtiketSpan"
//           quizCardEtiketSpan.textContent = questionsArray[i].quizBilgi.quizEtiket[j]
//           quizCardEtiket[i].append(quizCardEtiketSpan)
//         }
//       }
//     }
//     getCardEtiket()


//     //!ana sayfadaki quiz filtreleme butonları
//     let quizsFilterButton = document.querySelectorAll(".quizsFilterButton")
//     quizsFilterButton[0].classList.add("activeQuizFilterButton")
//     for (const i of quizsFilterButton) {
//       i.addEventListener("click", function () {
//         var filteredQuizzes = [];

//         if (i.innerHTML === "Hepsi") {
//           // Tüm sınavları listele
//           filteredQuizzes = questionsArray;
//         } else {
//           // Belirli kategorideki sınavları filtrele
//           filteredQuizzes = questionsArray.filter(function (quiz) {
//             return quiz.quizBilgi.quizCategory.includes(i.innerHTML);
//           });
//         }
//         // seçilene active class ekle
//         for (var j = 0; j < quizsFilterButton.length; j++) {
//           quizsFilterButton[j].classList.remove("activeQuizFilterButton");
//         }
//         i.classList.add("activeQuizFilterButton")
//         displayQuizzes(filteredQuizzes);
//       })
//     }

//     //*seçilen quiz btn göre ekrana yazdırma işlemi
//     function displayQuizzes(quizzes) {
//       var outputDiv = document.querySelector(".quizsContent");
//       outputDiv.innerHTML = "";

//       if (quizzes.length === 0) {
//         outputDiv.textContent = "Bu kategoriye ait sınav bulunamadı.";
//       } else {
//         const questionsArrayHTML = quizzes.map((value) => {
//           return `
//             <div class="col-lg-3 mt-4">
//               <a href="quiz-detail.html?id=${value.id}">
//                 <div class="quizCard">
//                   <h5>${value.quizBilgi.name}</h5>
//                   <div class="quizCardBody">
//                     <div class="quizCardImg">
//                       <img src="img/quizCard.jpg">
//                     </div>
//                     <div class="quizCardEtiket">
                    
//                     </div>
//                   </div>
//                 </div>
//               </a>
//             </div>
//           `;
//         });
//         document.querySelector(".quizsContent").innerHTML =
//           questionsArrayHTML.join("");
//         let quizCardEtiket = document.querySelectorAll(".quizCardEtiket")
//         for (let i = 0; i < quizzes.length; i++) {
//           for (let j = 0; j < quizzes[i].quizBilgi.quizEtiket.length; j++) {
//             let quizCardEtiketSpan = document.createElement("span")
//             quizCardEtiketSpan.className = "quizCardEtiketSpan"
//             quizCardEtiketSpan.textContent = quizzes[i].quizBilgi.quizEtiket[j]
//             quizCardEtiket[i].append(quizCardEtiketSpan)
//           }
//         }
//       }
//     }
//   });
// };

// document.addEventListener("DOMContentLoaded", getQuizs());
