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
  // Check if user is logged in and get their name
  const currentUser = localStorage.getItem("currentUser")
  const storedName = localStorage.getItem("userName")
  
  // Hide login/register buttons and show user menu if user is logged in
  updateHeaderButtons(currentUser, storedName)
  
  if (currentUser && storedName) {
    // User is logged in, use their username
    userName = storedName
    showMainContent()
  } else if (storedName) {
    // Fallback to stored name (for backward compatibility)
    userName = storedName
    showMainContent()
  } else {
    // No user logged in and no stored name, show name input
    showNameSection()
  }

  // Initialize emotion grid
  initializeEmotionGrid()

  // Initialize intensity slider
  initializeIntensitySlider()
}

function updateHeaderButtons(currentUser, userName) {
  const loginBtn = document.getElementById("loginBtn")
  const registerBtn = document.getElementById("registerBtn")
  const userMenu = document.getElementById("userMenu")
  
  if (currentUser && userName) {
    // User is logged in - hide login/register, show user menu
    loginBtn.style.display = "none"
    registerBtn.style.display = "none"
    userMenu.style.display = "flex"
  } else {
    // User not logged in - show login/register, hide user menu
    loginBtn.style.display = "inline-block"
    registerBtn.style.display = "inline-block"
    userMenu.style.display = "none"
  }
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

function handleLogout() {
  // Clear user data
  localStorage.removeItem("currentUser")
  localStorage.removeItem("userName")
  
  // Redirect to login page
  window.location.href = "login.html"
}
