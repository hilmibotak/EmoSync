// Rule-Based System untuk intervensi emosi
// emotion: string (misal: "sedih", "marah", "cemas", "senang", dst)
// intensity: int (1-10)
function getIntervensi(emotion, intensity) {
  emotion = emotion.toLowerCase();
  let saran = "";

  if (emotion === "sedih") {
    if (intensity >= 7) {
      saran = "Cobalah berbicara dengan teman dekat atau konselor. Luangkan waktu untuk self-care dan jangan ragu meminta bantuan.";
    } else if (intensity >= 4) {
      saran = "Luangkan waktu untuk menulis jurnal atau refleksi. Dengarkan musik yang menenangkan dan lakukan aktivitas yang kamu sukai.";
    } else {
      saran = "Ambil napas dalam-dalam, lakukan aktivitas ringan, dan beri waktu untuk dirimu sendiri.";
    }
  } else if (emotion === "marah") {
    if (intensity >= 7) {
      saran = "Segera ambil jeda, jauhi sumber kemarahan, dan lakukan teknik relaksasi seperti pernapasan dalam.";
    } else if (intensity >= 4) {
      saran = "Coba ekspresikan kemarahan dengan cara sehat, misal menulis atau olahraga ringan.";
    } else {
      saran = "Alihkan perhatian ke hal positif dan lakukan aktivitas yang menenangkan.";
    }
  } else if (emotion === "cemas") {
    if (intensity >= 7) {
      saran = "Cobalah teknik grounding, bicara dengan orang yang dipercaya, atau konsultasi ke profesional jika perlu.";
    } else if (intensity >= 4) {
      saran = "Lakukan latihan pernapasan, meditasi, atau jalan santai di luar ruangan.";
    } else {
      saran = "Fokus pada hal yang bisa dikontrol dan lakukan aktivitas ringan.";
    }
  } else if (emotion === "senang" || emotion === "bahagia") {
    if (intensity >= 7) {
      saran = "Bagikan kebahagiaanmu dengan orang lain dan rayakan pencapaianmu!";
    } else {
      saran = "Syukuri momen positif ini dan catat di jurnal harian.";
    }
  } else if (emotion === "takut") {
    if (intensity >= 7) {
      saran = "Ceritakan ketakutanmu pada orang yang dipercaya dan lakukan teknik relaksasi.";
    } else {
      saran = "Identifikasi sumber ketakutan dan hadapi secara perlahan.";
    }
  } else {
    saran = "Kenali dan terima emosimu. Lakukan aktivitas yang membuatmu nyaman dan jangan ragu mencari dukungan jika diperlukan.";
  }

  return saran;
}

// ===== Naive Bayes sederhana untuk klasifikasi emosi =====
// Dataset kecil contoh (emosi: sedih, marah, senang, cemas)
const nbDataset = [
  {text: "aku merasa sangat sedih dan ingin menangis", label: "sedih"},
  {text: "hari ini aku kecewa dan murung", label: "sedih"},
  {text: "aku marah sekali dengan teman", label: "marah"},
  {text: "aku kesal dan emosi karena tugas menumpuk", label: "marah"},
  {text: "aku bahagia sekali hari ini", label: "senang"},
  {text: "aku merasa sangat gembira dan bersyukur", label: "senang"},
  {text: "aku cemas menghadapi ujian besok", label: "cemas"},
  {text: "aku khawatir dan takut gagal", label: "cemas"},
];

// Preprocessing: tokenisasi sederhana
function tokenize(text) {
  return text.toLowerCase().replace(/[^a-zA-Z\u00C0-\u017F\s]/g, '').split(/\s+/).filter(Boolean);
}

// Training Naive Bayes
const nbClasses = {};
const nbVocab = new Set();
let nbTotalDocs = 0;

function trainNaiveBayes(dataset) {
  dataset.forEach(({text, label}) => {
    nbTotalDocs++;
    if (!nbClasses[label]) {
      nbClasses[label] = {docCount: 0, wordCount: 0, wordFreq: {}};
    }
    nbClasses[label].docCount++;
    const tokens = tokenize(text);
    tokens.forEach(token => {
      nbVocab.add(token);
      nbClasses[label].wordCount++;
      nbClasses[label].wordFreq[token] = (nbClasses[label].wordFreq[token] || 0) + 1;
    });
  });
}

trainNaiveBayes(nbDataset);

// Fungsi klasifikasi
function classify_emotion(text) {
  const tokens = tokenize(text);
  let bestLabel = null;
  let bestScore = -Infinity;
  const vocabSize = nbVocab.size;

  for (const label in nbClasses) {
    // Prior log-probability
    let logProb = Math.log(nbClasses[label].docCount / nbTotalDocs);
    // Likelihood log-probability
    tokens.forEach(token => {
      const wordFreq = nbClasses[label].wordFreq[token] || 0;
      // Laplace smoothing
      logProb += Math.log((wordFreq + 1) / (nbClasses[label].wordCount + vocabSize));
    });
    if (logProb > bestScore) {
      bestScore = logProb;
      bestLabel = label;
    }
  }
  return bestLabel;
}

// Contoh penggunaan:
// const saran = getIntervensi("sedih", 8);
// console.log(saran);

// const emosi = classify_emotion("aku merasa takut dan cemas");
// console.log(emosi); // Output: "cemas"
