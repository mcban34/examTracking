import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
    getDatabase,
    set,
    ref,
    onValue,
    get,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut,
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
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    //!öğrenci girişli değilse panele ulaşamaz!
    if (!user) {
        window.location.href = "ogrenci-login.html";
    }
    document.querySelector("header").classList.add("panelNav")
    document.querySelector(".ogrenciName").innerHTML = `${user.email}`
    const db = getDatabase();
    const countRef = ref(db, "ogrenciler/" + user.uid);
    onValue(countRef, (snapshot) => {
        let data = Object.values(snapshot.val());
        //*çözülmüş sınavlar toparlandı
        const cozulenSinavlar = []
        for (const i of data[1]) {
            if (i.quizBilgi.cozulduMu == true) {
                cozulenSinavlar.push({
                    quizName: i.quizBilgi.name,
                    quizPuan: i.quizBilgi.puan
                })
            }
        }

        //öğrencinin çözdüğü sınavlar data tableye basıldı
        const tbody = document.getElementById("dataTableBody");
        tbody.innerHTML = "";
        cozulenSinavlar.forEach(element => {
            const row = document.createElement("tr");

            const quizNameCell = document.createElement("td");
            quizNameCell.textContent = element.quizName;
            row.appendChild(quizNameCell);

            const quizPuan = document.createElement("td");
            quizPuan.textContent = element.quizPuan;
            row.appendChild(quizPuan);

            tbody.appendChild(row);
        });
        $('#dataTable').DataTable({
            language: {
                "url": "https://cdn.datatables.net/plug-ins/1.13.6/i18n/tr.json"
            },
            pageLength: 10,
            lengthMenu: [5, 10, 25, 50, 100],
            paging: true,
            scrollCollapse: true,
            scrollY: '300px'
        });
        console.log(cozulenSinavlar);


        const totalPoints = cozulenSinavlar.reduce((sum, data) => sum + data.quizPuan, 0);
        const average = totalPoints / cozulenSinavlar.length;

        // Chart.js kullanarak grafik oluşturma
        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: cozulenSinavlar.map(data => data.quizName),
                datasets: [{
                    label: 'Quiz Puanları',
                    data: cozulenSinavlar.map(data => data.quizPuan),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Ortalama',
                    data: Array(cozulenSinavlar.length).fill(average),
                    type: 'line',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'x'
                        },
                        zoom: {
                            enabled: true,
                            mode: 'x'
                        }
                    }
                }
            }
        });
    })
});


//!çıkış butonuna basıldığında çıkışı yaptım
document.querySelector(".quit").addEventListener("click", function () {
    signOut(auth)
      .then(() => {
        console.log("çıkış yapıldı");
        location.reload();
      })
      .catch(() => {
        console.log("çıkış yapılamadı!");
      });
  });
