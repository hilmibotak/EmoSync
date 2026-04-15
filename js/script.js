// Emotion data
const emotions = [
  { emoji: "😊", name: "Bahagia", value: "happy" },
  { emoji: "😢", name: "Sedih", value: "sad" },
  { emoji: "😠", name: "Marah", value: "angry" },
  { emoji: "😰", name: "Cemas", value: "anxious" },
  { emoji: "😴", name: "Lelah", value: "tired" },
  { emoji: "🤗", name: "Dicintai", value: "loved" },
  { emoji: "😕", name: "Bingung", value: "confused" },
  { emoji: "🎉", name: "Bersemangat", value: "excited" },
]

// Global variables
let selectedEmotion = ""
let emotionIntensity = 5
const emotionNote = ""
let userName = ""

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  const storedName = localStorage.getItem("userName")
  if (storedName) {
    userName = storedName
    showMainContent()
  } else {
    showNameSection()
  }

  // Initialize emotion grid
  initializeEmotionGrid()

  // Initialize intensity slider
  initializeIntensitySlider()
}

function showNameSection() {
  document.getElementById("nameSection").style.display = "block"
  document.getElementById("mainContent").style.display = "none"
}

function showMainContent() {
  document.getElementById("nameSection").style.display = "none"
  document.getElementById("mainContent").style.display = "block"
  document.getElementById("welcomeText").textContent = `Halo, ${userName}! Bagaimana perasaanmu hari ini?`
}

function saveName() {
  const nameInput = document.getElementById("nameInput")
  const name = nameInput.value.trim()

  if (name) {
    userName = name
    localStorage.setItem("userName", name)
    showMainContent()
  }
}

function initializeEmotionGrid() {
  const emotionGrid = document.getElementById("emotionGrid")
  emotionGrid.innerHTML = ""

  emotions.forEach((emotion) => {
    const emotionBtn = document.createElement("button")
    emotionBtn.className = "emotion-btn"
    emotionBtn.onclick = () => selectEmotion(emotion.value)

    emotionBtn.innerHTML = `
            <span class="emotion-emoji">${emotion.emoji}</span>
            <span class="emotion-name">${emotion.name}</span>
        `

    emotionGrid.appendChild(emotionBtn)
  })
}

function selectEmotion(emotionValue) {
  selectedEmotion = emotionValue

  // Update UI
  document.querySelectorAll(".emotion-btn").forEach((btn) => {
    btn.classList.remove("selected")
  })

  event.target.closest(".emotion-btn").classList.add("selected")

  // Show intensity section
  document.getElementById("intensitySection").style.display = "block"
  document.getElementById("noteSection").style.display = "block"

  // Enable save button
  document.getElementById("saveEmotionBtn").disabled = false
}

function initializeIntensitySlider() {
  const slider = document.getElementById("intensitySlider")
  const valueDisplay = document.getElementById("intensityValue")

  slider.addEventListener("input", function () {
    emotionIntensity = Number.parseInt(this.value)
    valueDisplay.textContent = emotionIntensity
  })
}

function saveEmotion() {
  if (!selectedEmotion) return

  const note = document.getElementById("emotionNote").value.trim()

  const emotionData = {
    emotion: selectedEmotion,
    intensity: emotionIntensity,
    note: note,
    timestamp: new Date().toISOString(),
    id: Date.now(),
  }

  // Save to localStorage
  const existingEmotions = JSON.parse(localStorage.getItem("emotions") || "[]")
  existingEmotions.push(emotionData)
  localStorage.setItem("emotions", JSON.stringify(existingEmotions))

  // Check for tension (high intensity negative emotions)
  const negativeEmotions = ["sad", "angry", "anxious", "confused"]
  if (negativeEmotions.includes(selectedEmotion) && emotionIntensity >= 7) {
    localStorage.setItem("needsReflection", "true")
  }

  // Redirect to dashboard
  window.location.href = "dashboard.html"
}

// Navigation functions
function goToDashboard() {
  window.location.href = 'dashboard.html';
}

function goToQuiz() {
  window.location.href = 'quiz.html';
}

function goToSafeChat() {
  window.location.href = 'safechat.html';
}

function goToReport() {
  window.location.href = 'report.html';
}

function goToReflection() {
  window.location.href = 'reflection.html';
}

function goToHome() {
  window.location.href = 'index.html';
}
