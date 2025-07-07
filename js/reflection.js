// Reflection questions
const reflectionQuestions = [
  "Apa yang memicu emosi kuat yang kamu rasakan hari ini?",
  "Bagaimana tubuhmu bereaksi ketika merasakan emosi tersebut?",
  "Apa yang kamu pelajari tentang dirimu dari pengalaman emosi ini?",
  "Jika kamu bisa memberikan nasihat kepada diri sendiri, apa yang akan kamu katakan?",
  "Apa tiga hal yang bisa kamu syukuri hari ini, meskipun dalam situasi sulit?",
  "Bagaimana kamu ingin menangani emosi serupa di masa depan?",
  "Siapa atau apa yang bisa memberikan dukungan ketika kamu merasa kewalahan?",
  "Apa aktivitas kecil yang bisa membuatmu merasa lebih baik sekarang?",
]

// Global variables
let currentQuestionIndex = 0
let reflectionEntries = []

// Initialize reflection
document.addEventListener("DOMContentLoaded", () => {
  initializeReflection()
})

function initializeReflection() {
  // Load existing reflection entries
  reflectionEntries = JSON.parse(localStorage.getItem("reflectionEntries") || "[]")

  currentQuestionIndex = 0
  showQuestion()
  updateProgress()
  setupAnswerInput()
}

function showQuestion() {
  document.getElementById("questionText").textContent = reflectionQuestions[currentQuestionIndex]

  // Update save button text
  const saveBtn = document.getElementById("saveBtn")
  saveBtn.textContent = currentQuestionIndex < reflectionQuestions.length - 1 ? "💾 Simpan & Lanjut" : "✅ Selesai"

  // Clear previous answer
  document.getElementById("reflectionAnswer").value = ""
  document.getElementById("saveBtn").disabled = true
}

function updateProgress() {
  const progress = ((currentQuestionIndex + 1) / reflectionQuestions.length) * 100
  document.getElementById("progressText").textContent = `Pertanyaan ${currentQuestionIndex + 1} dari ${
    reflectionQuestions.length
  }`
  document.getElementById("progressPercent").textContent = `${Math.round(progress)}%`
  document.getElementById("progressFill").style.width = `${progress}%`
}

function setupAnswerInput() {
  const answerInput = document.getElementById("reflectionAnswer")

  answerInput.addEventListener("input", () => {
    const saveBtn = document.getElementById("saveBtn")
    saveBtn.disabled = !answerInput.value.trim()
  })
}

function saveReflection() {
  const answerInput = document.getElementById("reflectionAnswer")
  const answer = answerInput.value.trim()

  if (!answer) return

  // Save current reflection
  const newEntry = {
    id: Date.now(),
    question: reflectionQuestions[currentQuestionIndex],
    answer: answer,
    timestamp: new Date().toISOString(),
  }

  reflectionEntries.push(newEntry)
  localStorage.setItem("reflectionEntries", JSON.stringify(reflectionEntries))

  // Move to next question or complete
  if (currentQuestionIndex < reflectionQuestions.length - 1) {
    currentQuestionIndex++
    showQuestion()
    updateProgress()
  } else {
    completeReflection()
  }
}

function skipQuestion() {
  if (currentQuestionIndex < reflectionQuestions.length - 1) {
    currentQuestionIndex++
    showQuestion()
    updateProgress()
  } else {
    completeReflection()
  }
}

function completeReflection() {
  // Clear the reflection flag
  localStorage.removeItem("needsReflection")

  // Hide reflection content and show completion
  document.getElementById("progressSection").style.display = "none"
  document.getElementById("reflectionContent").style.display = "none"
  document.getElementById("completionContent").style.display = "block"
}

function startNewReflection() {
  document.getElementById("progressSection").style.display = "block"
  document.getElementById("reflectionContent").style.display = "block"
  document.getElementById("completionContent").style.display = "none"

  initializeReflection()
}

// Navigation functions
function goToDashboard() {
  window.location.href = "dashboard.html"
}

function goToHome() {
  window.location.href = "index.html"
}
