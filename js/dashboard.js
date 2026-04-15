// Global variables
let emotions = []
let userName = ""

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  initializeDashboard()
})

function initializeDashboard() {
  // Load data from localStorage
  emotions = JSON.parse(localStorage.getItem("emotions") || "[]")
  const storedUserName = localStorage.getItem("userName")
  userName = storedUserName || "Pengguna"

  // Update welcome message
  document.getElementById("welcomeBack").textContent = `Selamat datang kembali, ${userName}!`

  // Check for reflection alert
  checkReflectionAlert()

  // Update summary cards
  updateSummaryCards()

  // Initialize chart
  initializeChart()

  // Update emotion history
  updateEmotionHistory()
}

function checkReflectionAlert() {
  const needsReflection = localStorage.getItem("needsReflection") === "true"
  const alertElement = document.getElementById("reflectionAlert")

  if (needsReflection) {
    alertElement.style.display = "block"
  }
}

function startReflection() {
  localStorage.removeItem("needsReflection")
  window.location.href = "reflection.html"
}

function updateSummaryCards() {
  updateLatestEmotion()
  updateMostFrequent()
  updateTotalEntries()
}

function updateLatestEmotion() {
  const container = document.getElementById("latestEmotion")

  if (emotions.length === 0) {
    container.innerHTML = '<p class="no-data">Belum ada data emosi</p>'
    return
  }

  const latest = emotions[emotions.length - 1]
  const emotion = getEmotionData(latest.emotion)

  container.innerHTML = `
        <div class="emotion-display">
            <span class="emoji">${emotion.emoji}</span>
            <span class="name">${emotion.name}</span>
        </div>
        <p class="intensity-text">Intensitas: ${latest.intensity}/10</p>
        <p class="timestamp-text">${formatDate(latest.timestamp)}</p>
    `
}

function updateMostFrequent() {
  const container = document.getElementById("mostFrequent")

  if (emotions.length === 0) {
    container.innerHTML = '<p class="no-data">Belum ada data emosi</p>'
    return
  }

  const emotionCounts = {}
  emotions.forEach((emotion) => {
    emotionCounts[emotion.emotion] = (emotionCounts[emotion.emotion] || 0) + 1
  })

  const mostFrequent = Object.entries(emotionCounts).reduce((a, b) =>
    emotionCounts[a[0]] > emotionCounts[b[0]] ? a : b,
  )

  const emotion = getEmotionData(mostFrequent[0])

  container.innerHTML = `
        <div class="emotion-display">
            <span class="emoji">${emotion.emoji}</span>
            <span class="name">${emotion.name}</span>
        </div>
        <p class="intensity-text">${mostFrequent[1]} kali tercatat</p>
    `
}

function updateTotalEntries() {
  const container = document.getElementById("totalEntries")

  container.innerHTML = `
        <div class="stat-number">${emotions.length}</div>
        <p class="stat-description">Emosi yang tercatat</p>
    `
}

function updateEmotionHistory() {
  const container = document.getElementById("emotionHistory")

  if (emotions.length === 0) {
    container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #6b7280;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
                <p>Belum ada riwayat emosi</p>
                <p style="font-size: 0.875rem;">Mulai mencatat emosi untuk melihat riwayat</p>
            </div>
        `
    return
  }

  const recentEmotions = emotions.slice(-10).reverse()

  container.innerHTML = recentEmotions
    .map((emotion) => {
      const emotionData = getEmotionData(emotion.emotion)
      const intensityClass = getIntensityClass(emotion.intensity)

      return `
            <div class="history-item">
                <div class="history-emoji">${emotionData.emoji}</div>
                <div class="history-content">
                    <div class="history-emotion">
                        <span class="history-name">${emotionData.name}</span>
                        <span class="history-intensity ${intensityClass}">${emotion.intensity}/10</span>
                    </div>
                    ${emotion.note ? `<p class="history-note">"${emotion.note}"</p>` : ""}
                    <p class="history-timestamp">${formatDateTime(emotion.timestamp)}</p>
                </div>
            </div>
        `
    })
    .join("")
}

function initializeChart() {
  const canvas = document.getElementById("emotionChart")
  const tooltip = document.getElementById("chartTooltip")

  if (emotions.length === 0) {
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw empty state
    ctx.fillStyle = "#6b7280"
    ctx.font = "16px Inter"
    ctx.textAlign = "center"
    ctx.fillText("Belum ada data untuk ditampilkan", canvas.width / 2, canvas.height / 2 - 20)
    ctx.font = "14px Inter"
    ctx.fillText("Mulai mencatat emosi untuk melihat grafik", canvas.width / 2, canvas.height / 2 + 10)
    return
  }

  drawChart(canvas)

  // Add mouse event listeners
  canvas.addEventListener("mousemove", (e) => handleChartMouseMove(e, canvas, tooltip))
  canvas.addEventListener("mouseleave", () => hideTooltip(tooltip))
}

function drawChart(canvas) {
  const ctx = canvas.getContext("2d")
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()

  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const width = rect.width
  const height = rect.height
  const padding = 60

  // Clear canvas with gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, "#f8fafc")
  gradient.addColorStop(1, "#f1f5f9")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Get last 14 days of data
  const last14Days = emotions.slice(-14)
  const maxIntensity = 10
  const stepX = (width - 2 * padding) / Math.max(last14Days.length - 1, 1)
  const stepY = (height - 2 * padding) / maxIntensity

  // Draw grid lines
  ctx.strokeStyle = "#e2e8f0"
  ctx.lineWidth = 1
  ctx.setLineDash([2, 2])

  // Horizontal grid lines
  for (let i = 0; i <= maxIntensity; i += 2) {
    const y = height - padding - i * stepY
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(width - padding, y)
    ctx.stroke()
  }

  // Vertical grid lines
  ctx.setLineDash([1, 3])
  ctx.strokeStyle = "#f1f5f9"
  for (let i = 0; i < last14Days.length; i++) {
    const x = padding + i * stepX
    ctx.beginPath()
    ctx.moveTo(x, padding)
    ctx.lineTo(x, height - padding)
    ctx.stroke()
  }

  ctx.setLineDash([])

  // Draw axes
  ctx.strokeStyle = "#475569"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, height - padding)
  ctx.lineTo(width - padding, height - padding)
  ctx.stroke()

  // Draw area under curve
  if (last14Days.length > 1) {
    const areaGradient = ctx.createLinearGradient(0, padding, 0, height - padding)
    areaGradient.addColorStop(0, "rgba(59, 130, 246, 0.1)")
    areaGradient.addColorStop(1, "rgba(59, 130, 246, 0.02)")

    ctx.fillStyle = areaGradient
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)

    last14Days.forEach((emotion, index) => {
      const x = padding + index * stepX
      const y = height - padding - emotion.intensity * stepY
      ctx.lineTo(x, y)
    })

    ctx.lineTo(padding + (last14Days.length - 1) * stepX, height - padding)
    ctx.closePath()
    ctx.fill()
  }

  // Draw line chart
  if (last14Days.length > 1) {
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()

    last14Days.forEach((emotion, index) => {
      const x = padding + index * stepX
      const y = height - padding - emotion.intensity * stepY

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        const prevX = padding + (index - 1) * stepX
        const prevY = height - padding - last14Days[index - 1].intensity * stepY
        const cpX = (prevX + x) / 2
        ctx.quadraticCurveTo(cpX, prevY, x, y)
      }
    })
    ctx.stroke()
  }

  // Draw data points
  last14Days.forEach((emotion, index) => {
    const x = padding + index * stepX
    const y = height - padding - emotion.intensity * stepY
    const color = getEmotionColor(emotion.emotion)

    // Outer glow
    ctx.shadowColor = color
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    // Point circle
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, 6, 0, 2 * Math.PI)
    ctx.fill()

    // Reset shadow
    ctx.shadowBlur = 0

    // Point border
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 3
    ctx.stroke()

    // Inner dot
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(x, y, 2, 0, 2 * Math.PI)
    ctx.fill()
  })

  // Draw labels
  ctx.fillStyle = "#64748b"
  ctx.font = "12px Inter"
  ctx.textAlign = "right"

  // Y-axis labels
  for (let i = 0; i <= maxIntensity; i += 2) {
    const y = height - padding - i * stepY
    ctx.fillText(i.toString(), padding - 15, y + 4)
  }

  // Y-axis title
  ctx.save()
  ctx.translate(20, height / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.textAlign = "center"
  ctx.fillStyle = "#475569"
  ctx.font = "14px Inter"
  ctx.fillText("Intensitas", 0, 0)
  ctx.restore()

  // X-axis labels
  ctx.textAlign = "center"
  ctx.fillStyle = "#64748b"
  ctx.font = "11px Inter"

  last14Days.forEach((emotion, index) => {
    const x = padding + index * stepX
    const date = new Date(emotion.timestamp)
    const today = new Date()
    const diffTime = today.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    let label = ""
    if (diffDays === 0) {
      label = "Hari ini"
    } else if (diffDays === 1) {
      label = "Kemarin"
    } else {
      label = date.toLocaleDateString("id-ID", {
        month: "short",
        day: "numeric",
      })
    }

    ctx.fillText(label, x, height - padding + 20)

    // Add emoji
    ctx.font = "16px Arial"
    const emotionData = getEmotionData(emotion.emotion)
    ctx.fillText(emotionData.emoji, x, height - padding + 40)
  })

  // X-axis title
  ctx.textAlign = "center"
  ctx.fillStyle = "#475569"
  ctx.font = "14px Inter"
  ctx.fillText("Waktu", width / 2, height - 10)
}

function handleChartMouseMove(event, canvas, tooltip) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const padding = 60
  const last14Days = emotions.slice(-14)
  const stepX = (rect.width - 2 * padding) / Math.max(last14Days.length - 1, 1)
  const stepY = (rect.height - 2 * padding) / 10

  let nearestPoint = null
  let minDistance = Number.POSITIVE_INFINITY

  last14Days.forEach((emotion, index) => {
    const pointX = padding + index * stepX
    const pointY = rect.height - padding - emotion.intensity * stepY
    const distance = Math.sqrt((x - pointX) ** 2 + (y - pointY) ** 2)

    if (distance < 20 && distance < minDistance) {
      minDistance = distance
      nearestPoint = { emotion, index, pointX, pointY }
    }
  })

  if (nearestPoint) {
    showTooltip(tooltip, nearestPoint.emotion, nearestPoint.pointX, nearestPoint.pointY)
    canvas.style.cursor = "pointer"
  } else {
    hideTooltip(tooltip)
    canvas.style.cursor = "default"
  }
}

function showTooltip(tooltip, emotion, x, y) {
  const emotionData = getEmotionData(emotion.emotion)

  tooltip.innerHTML = `
        <div class="tooltip-emotion">
            <span class="emoji">${emotionData.emoji}</span>
            <span class="name">${emotionData.name}</span>
        </div>
        <div class="tooltip-intensity">Intensitas: ${emotion.intensity}/10</div>
        <div class="tooltip-date">${formatDateTime(emotion.timestamp)}</div>
        ${
          emotion.note
            ? `
            <div class="tooltip-note">
                <div class="tooltip-note-label">Catatan:</div>
                "${emotion.note}"
            </div>
        `
            : ""
        }
    `

  tooltip.style.left = x + "px"
  tooltip.style.top = y - 10 + "px"
  tooltip.style.transform = "translate(-50%, -100%)"
  tooltip.classList.add("visible")
}

function hideTooltip(tooltip) {
  tooltip.classList.remove("visible")
}

// Utility functions
function getEmotionData(emotionValue) {
  const emotionMap = {
    happy: { emoji: "😊", name: "Bahagia" },
    sad: { emoji: "😢", name: "Sedih" },
    angry: { emoji: "😠", name: "Marah" },
    anxious: { emoji: "😰", name: "Cemas" },
    tired: { emoji: "😴", name: "Lelah" },
    loved: { emoji: "🤗", name: "Dicintai" },
    confused: { emoji: "😕", name: "Bingung" },
    excited: { emoji: "🎉", name: "Bersemangat" },
  }
  return emotionMap[emotionValue] || { emoji: "😐", name: emotionValue }
}

function getEmotionColor(emotion) {
  const colorMap = {
    happy: "#10b981",
    sad: "#3b82f6",
    angry: "#ef4444",
    anxious: "#f59e0b",
    tired: "#6b7280",
    loved: "#ec4899",
    confused: "#8b5cf6",
    excited: "#f97316",
  }
  return colorMap[emotion] || "#6b7280"
}

function getIntensityClass(intensity) {
  if (intensity <= 3) return "intensity-low"
  if (intensity <= 6) return "intensity-medium"
  return "intensity-high"
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDateTime(timestamp) {
  return new Date(timestamp).toLocaleString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Navigation functions
function goToHome() {
  window.location.href = "index.html"
}

function goToQuiz() {
  window.location.href = "quiz.html"
}

function goToSafeChat() {
  window.location.href = "safechat.html"
}

function goToReport() {
  window.location.href = "report.html"
}

function goToReflection() {
  window.location.href = "reflection.html"
}
