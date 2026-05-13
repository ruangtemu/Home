// 1. FIREBASE CONFIG & MODULES
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCvjgllRIJIxvhGPJ8IGFfj4ouoYDtcDc8",
  authDomain: "fela-rizki.firebaseapp.com",
  databaseURL: "https://fela-rizki-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "fela-rizki",
  storageBucket: "fela-rizki.firebasestorage.app",
  messagingSenderId: "1024896895863",
  appId: "1:1024896895863:web:4cdcbadfce0fd88a7faf72"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/**
 * FUNGSI UTAMA: MEMBUKA UNDANGAN
 */
window.bukaUndangan = function() {
    const wrapper = document.querySelector('.mobile-wrapper');
    const pages = ['page2', 'page3', 'page4', 'page5', 'page6', 'page7', 'page8', 'page9', 'page10', 'page11'];
    const audio = document.getElementById('bg-video'); 
    const tombol = document.getElementById('btn-open');
    
    if (wrapper) {
        wrapper.classList.add('unlocked');
    }
    
    pages.forEach(id => {
        const pg = document.getElementById(id);
        if (pg) {
            pg.classList.remove('hidden');
            pg.style.display = "block";
        }
    });
    
    const page2 = document.getElementById('page2');
    if (page2) {
        void page2.offsetWidth; 
        page2.classList.add('tampilkan-animasi');
        page2.scrollIntoView({ behavior: 'smooth' });
    }
    
    if (audio) {
        audio.play().catch(e => console.log("Musik butuh interaksi pengguna"));
    }
    
    if (tombol) {
        tombol.classList.add('fade-out');
        setTimeout(() => {
            tombol.style.setProperty('display', 'none', 'important');
        }, 500);
    }

    // PENTING: Observasi dimulai setelah tombol ditekan agar elemen terpantau saat scroll
    mulaiObservasi();
}

/**
 * FUNGSI TOAST NOTIFICATION
 */
function showToast(message) {
    const existingToast = document.querySelector('.toast-notif');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notif';
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => { toast.classList.add('show'); }, 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

/**
 * FUNGSI SALIN NOMOR REKENING & VOUCHER
 */
window.copyNorek = function() {
    const norekElement = document.getElementById('norek');
    if (norekElement) {
        const norek = norekElement.innerText;
        navigator.clipboard.writeText(norek).then(() => {
            showToast("Nomor rekening\nberhasil disalin! ✨");
        }).catch(err => {
            showToast("Gagal menyalin manual. 🙏");
        });
    }
}

window.copyVoucher = function() {
    const codeElement = document.querySelector('.voucher-box .code');
    if (codeElement) {
        navigator.clipboard.writeText(codeElement.innerText).then(() => {
            showToast("Kode promo tersalin! ✨");
        });
    }
}

/**
 * FUNGSI KIRIM UCAPAN (Firebase)
 */
window.kirimUcapan = function() {
    const namaInput = document.getElementById('nama');
    const pesanInput = document.getElementById('pesan');
    const kehadiranInput = document.getElementById('status-kehadiran');
    const btnKirim = document.getElementById('btnKirim');

    if (namaInput.value && pesanInput.value && kehadiranInput.value) {
        btnKirim.disabled = true;
        btnKirim.innerText = "Mengirim...";

        const msgRef = ref(db, 'ucapan');
        const newMsgRef = push(msgRef);
        
        set(newMsgRef, {
            nama: namaInput.value,
            pesan: pesanInput.value,
            kehadiran: kehadiranInput.value,
            timestamp: Date.now()
        }).then(() => {
            namaInput.value = '';
            pesanInput.value = '';
            kehadiranInput.selectedIndex = 0;
            btnKirim.disabled = false;
            btnKirim.innerText = "Kirim Ucapan";
            showToast("Terima kasih,\nucapan Anda telah tersimpan! ✨");
        }).catch((error) => {
            btnKirim.disabled = false;
            btnKirim.innerText = "Kirim Ucapan";
            showToast("Gagal mengirim pesan. 🙏");
        });
    } else {
        showToast("Mohon lengkapi Nama,\nKehadiran, dan Pesan. 😊");
    }
}

/**
 * SISTEM REALTIME & COUNTDOWN
 */
const wishContainer = document.getElementById('wish-container');
const totalPesanEl = document.getElementById('total-pesan');
const totalHadirEl = document.getElementById('total-hadir');
const totalAbsenEl = document.getElementById('total-absen');

onValue(ref(db, 'ucapan'), (snapshot) => {
    const data = snapshot.val();
    if (!data) {
        if(wishContainer) wishContainer.innerHTML = '<p style="text-align:center; color:#888;">Belum ada ucapan.</p>';
        return;
    }
    let countHadir = 0, countAbsen = 0, listHtml = '';
    const entries = Object.values(data).reverse();
    entries.forEach(item => {
        if (item.kehadiran === "Hadir") countHadir++;
        else countAbsen++;
        const badgeClass = item.kehadiran === "Hadir" ? "badge-hadir" : "badge-absen";
        listHtml += `<div class="wish-item"><h4>${item.nama} <span class="badge-status ${badgeClass}">${item.kehadiran}</span></h4><p>${item.pesan}</p></div>`;
    });
    if(wishContainer) wishContainer.innerHTML = listHtml;
    if(totalPesanEl) totalPesanEl.innerText = entries.length;
    if(totalHadirEl) totalHadirEl.innerText = countHadir;
    if(totalAbsenEl) totalAbsenEl.innerText = countAbsen;
});

function updateCountdown() {
    const targetDate = new Date("June 14, 2026 09:00:00").getTime();
    const now = new Date().getTime();
    const gap = targetDate - now;
    if (gap > 0) {
        const d = Math.floor(gap / (1000 * 60 * 60 * 24));
        const h = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((gap % (1000 * 60)) / 1000);
        if (document.getElementById("days")) {
            document.getElementById("days").innerText = d < 10 ? "0" + d : d;
            document.getElementById("hours").innerText = h < 10 ? "0" + h : h;
            document.getElementById("minutes").innerText = m < 10 ? "0" + m : m;
            document.getElementById("seconds").innerText = s < 10 ? "0" + s : s;
        }
    } else if (document.getElementById("countdown")) {
        document.getElementById("countdown").innerText = "Acara Telah Berlangsung";
    }
}
setInterval(updateCountdown, 1000);

/**
 * SISTEM ANIMASI SCROLL (OBSERVER)
 * Diperbarui untuk mendukung animasi Page 10 (.active)
 */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { 
        if (entry.isIntersecting) {
            // Gunakan class 'muncul' untuk elemen umum
            entry.target.classList.add('muncul'); 
            // Tambahkan class 'active' khusus untuk page-container (Page 10)
            if (entry.target.classList.contains('page-container')) {
                entry.target.classList.add('active');
            }
        } 
    });
}, { threshold: 0.2 }); // threshold 0.2 agar lebih responsif

function mulaiObservasi() {
    // Daftar elemen yang ingin dianimasikan
    const animItems = document.querySelectorAll('.mempelai-card, .divider-ampersand, .animasi-scroll-quotes, #page4, #page5, .timeline-item, #page6, #page7, .gallery-item, #page8, #page9, .page-container, #page11, .gift-card, .wish-form, .wish-list, .stat-item, .hero-content');
    animItems.forEach(item => { if (item) observer.observe(item); });
}

/**
 * LOGIKA NAMA TAMU DARI URL
 */
const urlParams = new URLSearchParams(window.location.search);
const namaTamu = urlParams.get('to');
const guestElement = document.getElementById('guest-name');
if (namaTamu && guestElement) {
    guestElement.innerText = namaTamu;
}

// Fungsi untuk menghilangkan preloader saat halaman selesai dimuat
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    
    // Memberikan waktu delay 3 detik agar animasi terlihat sebentar
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('fade-out');
        }
    }, 3000); 
});

// Inisialisasi awal
updateCountdown();
// Kita panggil juga di awal seandainya ada elemen yang terlihat di viewport sebelum tombol diklik
mulaiObservasi(); 
