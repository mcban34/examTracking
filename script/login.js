import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
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

//!girişi olan kullanıcı admine giremez, admin sayfasına yönlendirildi
onAuthStateChanged(auth, (user) => {
  console.log(user);
  if (user) {
    window.location.href = "admin.html";
  }
});


//!kullanıcın bilgilerine göre giriş işlemini gerçekleştirir
document.querySelector(".login").addEventListener("click", function () {
  let email = document.querySelector(".loginEmail").value;
  let password = document.querySelector(".loginPass").value;
  if(email=="test@test.com"){
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        window.location.href = "admin.html";
      })
      .catch((error) => {
        console.error(error);
        console.log("giriş başarısız");
      });
  }
  console.log("yönetici değilsin!");
});
