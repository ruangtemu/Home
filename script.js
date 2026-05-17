/* ==========================================
   1. ANIMASI TEKS BERGANTI (HERO SECTION)
   ========================================== */
const words = ["Elegan", "Custom","Ekslusif", "Personal"]; // PERBAIKAN: 'Const' diubah menjadi 'const' agar tidak error
let currentWordIndex = 0;
const textContainer = document.getElementById("changing-text");

function splitTextIntoLetters(text) {
    return text
        .split("")
        .map(letter => letter === " " ? "&nbsp;" : `<span class="particle-letter">${letter}</span>`)
        .join("");
}

// Inisialisasi awal pemisahan huruf teks di HTML
if (textContainer) {
    textContainer.innerHTML = splitTextIntoLetters(textContainer.innerText);
    // Set perspektif 3D agar putarannya nyata
    gsap.set(textContainer, { perspective: 400 });
    setTimeout(changeWord, 2500);
}

function changeWord() {
    const letters = textContainer.querySelectorAll(".particle-letter");

    // 1. Huruf berputar ke atas dan menghilang
    gsap.to(letters, {
        duration: 0.5,
        opacity: 0,
        rotationX: -90,
        y: -15,
        stagger: 0.03,
        ease: "power2.in",
        onComplete: () => {
            currentWordIndex = (currentWordIndex + 1) % words.length;
            textContainer.innerHTML = splitTextIntoLetters(words[currentWordIndex]);
            
            const newLetters = textContainer.querySelectorAll(".particle-letter");

            // 2. Huruf baru muncul berputar dari bawah (Efek Membal Lembut)
            gsap.fromTo(newLetters, 
                { opacity: 0, rotationX: 90, y: 15 },
                { 
                    duration: 0.7, 
                    opacity: 1, 
                    rotationX: 0, 
                    y: 0, 
                    stagger: 0.04,
                    ease: "back.out(2)", // Efek membal yang bikin estetik
                    onComplete: () => {
                        setTimeout(changeWord, 2500);
                    }
                }
            );
        }
    });
}


/* ==========================================
   2. FUNGSI NAVIGASI TAB TEMA (HALAMAN 3)
   ========================================== */
function filterTema(category, element) {
    // 1. Hapus class active dari semua tombol tab
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // 2. Pasang langsung class active ke tombol yang sedang diklik
    if (element) {
        element.classList.add('active');
    }

    // 3. Filter grid tema berdasarkan kategori data-category
    const boxes = document.querySelectorAll('.tema-box');
    boxes.forEach(box => {
        const itemCategory = box.getAttribute('data-category');
        if (category === 'semua' || itemCategory === category) {
            box.style.display = 'flex'; // Tampilkan jika cocok
        } else {
            box.style.display = 'none';  // Sembunyikan jika tidak cocok
        }
    });
}
element.classList.add('active');
