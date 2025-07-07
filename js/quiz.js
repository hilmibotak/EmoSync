// Quiz questions
const quizQuestions = [
  {
    id: 1,
    question: "Apa yang sebaiknya dilakukan ketika merasa sangat marah?",
    options: [
      "Langsung mengungkapkan kemarahan kepada orang lain",
      "Menarik napas dalam-dalam dan menghitung sampai 10",
      "Mengabaikan perasaan marah tersebut",
      "Menyalahkan orang lain atas kemarahan kita",
    ],
    correctAnswer: 1,
    explanation:
      "Menarik napas dalam dan menghitung dapat membantu menenangkan sistem saraf dan memberikan waktu untuk berpikir jernih sebelum bereaksi.",
  },
  {
    id: 2,
    question: "Manakah yang merupakan cara sehat untuk mengatasi kesedihan?",
    options: [
      "Menyendiri dan tidak berbicara dengan siapa pun",
      "Mengalihkan perhatian dengan aktivitas yang berlebihan",
      "Berbagi perasaan dengan teman atau keluarga yang dipercaya",
      "Menyimpan semua perasaan untuk diri sendiri",
    ],
    correctAnswer: 2,
    explanation:
      "Berbagi perasaan dengan orang yang dipercaya dapat membantu memproses emosi dan mendapatkan dukungan yang dibutuhkan.",
  },
  {
    id: 3,
    question: "Apa yang dimaksud dengan kecerdasan emosional?",
    options: [
      "Kemampuan untuk tidak pernah merasa sedih atau marah",
      "Kemampuan untuk mengenali, memahami, dan mengelola emosi",
      "Kemampuan untuk selalu terlihat bahagia",
      "Kemampuan untuk mengontrol emosi orang lain",
    ],
    correctAnswer: 1,
    explanation:
      "Kecerdasan emosional adalah kemampuan untuk mengenali, memahami, dan mengelola emosi diri sendiri serta memahami emosi orang lain.",
  },
  {
    id: 4,
    question: "Teknik mana yang paling efektif untuk mengurangi kecemasan?",
    options: [
      "Menghindari semua situasi yang membuat cemas",
      "Teknik pernapasan dan mindfulness",
      "Mengkonsumsi kafein untuk meningkatkan energi",
      "Begadang untuk menghindari mimpi buruk",
    ],
    correctAnswer: 1,
    explanation:
      "Teknik pernapasan dan mindfulness terbukti efektif untuk mengurangi kecemasan dengan menenangkan sistem saraf.",
  },
  {
    id: 5,
    question: "Bagaimana cara terbaik untuk meningkatkan mood yang sedang buruk?",
    options: [
      "Melakukan aktivitas fisik ringan seperti jalan kaki",
      "Menonton TV seharian",
      "Makan makanan manis dalam jumlah banyak",
      "Tidur sepanjang hari",
    ],
    correctAnswer: 0,
    explanation:
      "Aktivitas fisik ringan dapat melepaskan endorfin yang secara alami meningkatkan mood dan mengurangi stres.",
  },
]

// Global variables
let currentQuestion = 0
let selectedAnswer = null
let score = 0
let answers = []

// Initialize quiz
document.addEventListener("DOMContentLoaded", () => {
  initializeQuiz()
})

function initializeQuiz() {
  currentQuestion = 0
  selectedAnswer = null
  score = 0
  answers = []

  showQuestion()
  updateProgress()
}

function showQuestion() {
  const question = quizQuestions[currentQuestion]
  document.getElementById("questionText").textContent = question.question

  const optionsContainer = document.getElementById("optionsContainer")
  optionsContainer.innerHTML = ""

  question.options.forEach((option, index) => {
    const optionBtn = document.createElement("button")
    optionBtn.className = "option-button"
    optionBtn.onclick = () => selectAnswer(index)
    optionBtn.textContent = option

    optionsContainer.appendChild(optionBtn)
  })

  // Update next button text
  const nextBtn = document.getElementById("nextBtn")
  nextBtn.textContent = currentQuestion < quizQuestions.length - 1 ? "Pertanyaan Selanjutnya" : "Selesai"
  nextBtn.disabled = true
}

function selectAnswer(answerIndex) {
  selectedAnswer = answerIndex

  // Update UI
  document.querySelectorAll(".option-button").forEach((btn, index) => {
    btn.classList.remove("selected")
    if (index === answerIndex) {
      btn.classList.add("selected")
    }
  })

  // Enable next button
  document.getElementById("nextBtn").disabled = false
}

function handleNext() {
  if (selectedAnswer === null) return

  // Save answer
  answers.push(selectedAnswer)

  // Check if correct
  if (selectedAnswer === quizQuestions[currentQuestion].correctAnswer) {
    score++
  }

  // Move to next question or show results
  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion++
    selectedAnswer = null
    showQuestion()
    updateProgress()
  } else {
    showResults()
  }
}

function updateProgress() {
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100
  document.getElementById("progressText").textContent = `Pertanyaan ${currentQuestion + 1} dari ${quizQuestions.length}`
  document.getElementById("progressPercent").textContent = `${Math.round(progress)}%`
  document.getElementById("progressFill").style.width = `${progress}%`
}

function showResults() {
  // Save quiz result
  const quizResult = {
    score: score,
    total: quizQuestions.length,
    timestamp: new Date().toISOString(),
    answers: answers,
  }

  const existingResults = JSON.parse(localStorage.getItem("quizResults") || "[]")
  existingResults.push(quizResult)
  localStorage.setItem("quizResults", JSON.stringify(existingResults))

  // Hide quiz content and show results
  document.getElementById("progressSection").style.display = "none"
  document.getElementById("quizContent").style.display = "none"
  document.getElementById("resultsContent").style.display = "block"
  // Update results display
  const percentage = (score / quizQuestions.length) * 100
  document.getElementById("scoreNumber").textContent = `${score}/${quizQuestions.length}`
  document.getElementById("scorePercentage").textContent = `Skor: ${percentage.toFixed(0)}%`

  // Show appropriate message
  let message = ""
  if (percentage >= 80) {
    message = "🎉 Luar biasa! Anda memiliki pemahaman yang sangat baik tentang manajemen emosi. Terus pertahankan dan kembangkan kemampuan ini!"
  } else if (percentage >= 60) {
    message = "👍 Bagus! Anda memiliki pemahaman yang cukup baik tentang emosi. Masih ada ruang untuk terus belajar dan berkembang."
  } else {
    message = "💪 Terus belajar! Ada banyak ruang untuk meningkatkan pemahaman tentang emosi. Jangan menyerah, setiap langkah adalah kemajuan!"
  }

  // --- Integrasi intervensi rule-based ---
  // Contoh: jika skor rendah, sarankan intervensi
  let intervensi = ""
  if (percentage < 60) {
    // Misal, jika skor rendah, anggap emosi dominan "sedih" dan intensitas tinggi
    if (typeof getIntervensi === "function") {
      intervensi = getIntervensi("sedih", 8)
    } else {
      intervensi = "Cobalah refleksi diri dan lakukan aktivitas positif untuk meningkatkan pemahaman emosi.";
    }
    message += `\n\nSaran Intervensi: ${intervensi}`
  }
  document.getElementById("scoreMessage").textContent = message
}

function resetQuiz() {
  document.getElementById("progressSection").style.display = "block"
  document.getElementById("quizContent").style.display = "block"
  document.getElementById("resultsContent").style.display = "none"

  initializeQuiz()
}

// Navigation functions
function goToDashboard() {
  window.location.href = "dashboard.html"
}

function goToHome() {
  window.location.href = "index.html"
}
