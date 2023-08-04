import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
    getDatabase,
    set,
    ref,
    onValue,
    get,
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
const auth = getAuth(app);


let sinavlar = []
document.addEventListener("DOMContentLoaded", function () {
    const db = getDatabase();
    //*sinavlar getirildi
    const countRef = ref(db, "sinavlar/");
    onValue(countRef, (snapshot) => {
        let data = Object.values(snapshot.val());
        sinavlar.push(data)
    });
    //*gruplar getirildi
    let registerGrupName = document.querySelector(".registerGrupName")
    const countRefGruplar = ref(db, "gruplar/");
    onValue(countRefGruplar, (snapshot) => {
        let data = Object.keys(snapshot.val());
        for (const i of data) {
            registerGrupName.innerHTML += `
              <option>${i}</option>
          `;
        }
    });
})


function handleRegistrationSuccess(userCredential, registerNameSurname, registerGrupName) {
    // Kullanıcının UID'sini alın
    const uid = userCredential.user.uid;

    // Kullanıcının adı ve diğer bilgileri
    const kullaniciAdi = registerNameSurname;
    const email = userCredential.user.email;

    // Realtime Database bağlantısını alın
    // const database = firebase.database();

    // // Kullanıcının bilgilerini Realtime Database'e kaydedin
    // database.ref("ogrenciler/" + uid).set({
    //     ogrenciBilgi:{
    //         kullaniciAdi: kullaniciAdi,
    //         email: email,
    //     },
    //     sinavlar:sinavlar[0]
    // })

    const db = getDatabase();
    set(ref(db, "ogrenciler/" + uid), {
        ogrenciBilgi: {
            kullaniciAdi: kullaniciAdi,
            email: email,
            grupName: registerGrupName
        },
        sinavlar: sinavlar[0]
    });

}


document.querySelector(".register").addEventListener("click", function () {
    let email = document.querySelector(".registerEmail").value
    let password = document.querySelector(".registerPass").value
    let registerNameSurname = document.querySelector(".registerNameSurname").value
    let registerGrupName = document.querySelector(".registerGrupName").value
    createUserWithEmailAndPassword(auth, email, password, registerNameSurname, registerGrupName)
        .then((userCredential) => {
            console.log("katıt başarılı");
            console.log(sinavlar[0]);
            //*sınavları çektim
            handleRegistrationSuccess(userCredential, registerNameSurname, registerGrupName)

            // const db = getDatabase();
            // set(ref(db, "ogrenciler/" +  registerNameSurname + " " + registerGrupName), {
            //     sinav: {
            //       sinavlar:sinavlar[0]
            //     },
            // });
            window.location.href = "ogrenci-login.html"
        })
        .catch((error) => {
            console.log("hata yakalandı", error)
        })
})