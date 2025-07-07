// Global variables
let emotions = []
let reportPeriod = "weekly"
let filteredEmotions = []

// Initialize report
document.addEventListener("DOMContentLoaded", () => {
  initializeReport()
})

function initializeReport() {
  emotions = JSON.parse(localStorage.getItem("emotions") || "[]")
  filterEmotionsByPeriod()
  updateReport()
}

function changePeriod() {
  const select = document.getElementById("periodSelect")
  reportPeriod = select.value
  filterEmotionsByPeriod()
  updateReport()
}

function filterEmotionsByPeriod() {
  const now = new Date()
  let startDate

  switch (reportPeriod) {
    case "weekly":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case "monthly":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case "yearly":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
  }

  filteredEmotions = emotions.filter((emotion) => new Date(emotion.timestamp) >= startDate)
}

function updateReport() {
  if (filteredEmotions.length === 0) {
    showNoData()
    return
  }

  hideNoData()
  updateStats()
  updateBreakdown()
  updateRecentEntries()

  // Enable download button
  document.getElementById("downloadBtn").disabled = false
}

function showNoData() {
  document.getElementById("statsSection").style.display = "none"
  document.getElementById("breakdownSection").style.display = "none"
  document.getElementById("entriesSection").style.display = "none"
  document.getElementById("noDataSection").style.display = "block"
  document.getElementById("downloadBtn").disabled = true
}

function hideNoData() {
  document.getElementById("statsSection").style.display = "grid"
  document.getElementById("breakdownSection").style.display = "block"
  document.getElementById("entriesSection").style.display = "block"
  document.getElementById("noDataSection").style.display = "none"
}

function updateStats() {
  const stats = getEmotionStats()
  const statsContainer = document.getElementById("statsSection")

  statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-header">
                <span class="stat-title">Total Entri</span>
                <span class="stat-icon">📅</span>
            </div>
            <div class="stat-content">
                <div class="stat-number">${stats.totalEntries}</div>
                <p class="stat-description">Emosi yang tercatat</p>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-header">
                <span class="stat-title">Emosi Terbanyak</span>
                <span class="stat-icon">📈</span>
            </div>
            <div class="stat-content">
                <div class="emotion-display">
                    <span class="emoji">${getEmotionEmoji(stats.mostFrequent.emotion)}</span>
                    <span class="name">${getEmotionName(stats.mostFrequent.emotion)}</span>
                </div>
                <p class="stat-description">${stats.mostFrequent.count} kali</p>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-header">
                <span class="stat-title">Rata-rata Intensitas</span>
                <span class="stat-icon">📊</span>
            </div>
            <div class="stat-content">
                <div class="stat-number">${stats.averageIntensity}</div>
                <p class="stat-description">Dari skala 1-10</p>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-header">
                <span class="stat-title">Tren Intensitas</span>
                <span class="stat-icon">📈</span>
            </div>
            <div class="stat-content">
                ${getTrendDisplay(stats.intensityTrend)}
            </div>
        </div>
    `
}

function updateBreakdown() {
  const stats = getEmotionStats()
  const container = document.getElementById("emotionBreakdown")

  container.innerHTML = Object.entries(stats.emotionCounts)
    .map(([emotion, count]) => {
      const percentage = ((count / stats.totalEntries) * 100).toFixed(1)
      return `
            <div class="breakdown-item">
                <div class="breakdown-emoji">${getEmotionEmoji(emotion)}</div>
                <div class="breakdown-content">
                    <div class="breakdown-name">${getEmotionName(emotion)}</div>
                    <div class="breakdown-stats">
                        <span class="breakdown-count">${count} kali</span>
                        <span class="breakdown-percentage">${percentage}%</span>
                    </div>
                </div>
            </div>
        `
    })
    .join("")
}

function updateRecentEntries() {
  const container = document.getElementById("recentEntries")
  const recentEmotions = filteredEmotions.slice(-10).reverse()

  container.innerHTML = recentEmotions
    .map((emotion) => {
      return `
            <div class="recent-entry">
                <div class="entry-emoji">${getEmotionEmoji(emotion.emotion)}</div>
                <div class="entry-content">
                    <div class="entry-emotion">
                        <span class="entry-name">${getEmotionName(emotion.emotion)}</span>
                        <span class="entry-intensity">Intensitas: ${emotion.intensity}/10</span>
                    </div>
                    ${emotion.note ? `<div class="entry-note">"${emotion.note}"</div>` : ""}
                </div>
                <div class="entry-date">
                    <div>${formatDate(emotion.timestamp)}</div>
                    <div>${formatTime(emotion.timestamp)}</div>
                </div>
            </div>
        `
    })
    .join("")
}

function getEmotionStats() {
  const emotionCounts = {}
  filteredEmotions.forEach((emotion) => {
    emotionCounts[emotion.emotion] = (emotionCounts[emotion.emotion] || 0) + 1
  })

  const mostFrequent = Object.entries(emotionCounts).reduce((a, b) =>
    emotionCounts[a[0]] > emotionCounts[b[0]] ? a : b,
  )

  const averageIntensity =
    filteredEmotions.reduce((sum, emotion) => sum + emotion.intensity, 0) / filteredEmotions.length

  const intensityTrend = getIntensityTrend()

  return {
    totalEntries: filteredEmotions.length,
    mostFrequent: { emotion: mostFrequent[0], count: mostFrequent[1] },
    averageIntensity: averageIntensity.toFixed(1),
    emotionCounts,
    intensityTrend,
  }
}

function getIntensityTrend() {
  if (filteredEmotions.length < 2) return "stable"

  const recent = filteredEmotions.slice(-5)
  const older = filteredEmotions.slice(-10, -5)

  if (recent.length === 0 || older.length === 0) return "stable"

  const recentAvg = recent.reduce((sum, e) => sum + e.intensity, 0) / recent.length
  const olderAvg = older.reduce((sum, e) => sum + e.intensity, 0) / older.length

  if (recentAvg > olderAvg + 0.5) return "increasing"
  if (recentAvg < olderAvg - 0.5) return "decreasing"
  return "stable"
}

function getTrendDisplay(trend) {
  switch (trend) {
    case "increasing":
      return `
                <div class="trend-display trend-up">
                    <span class="trend-emoji">📈</span>
                    <div>
                        <div class="trend-label">Meningkat</div>
                        <p class="stat-description">Intensitas naik</p>
                    </div>
                </div>
            `
    case "decreasing":
      return `
                <div class="trend-display trend-down">
                    <span class="trend-emoji">📉</span>
                    <div>
                        <div class="trend-label">Menurun</div>
                        <p class="stat-description">Intensitas turun</p>
                    </div>
                </div>
            `
    default:
      return `
                <div class="trend-display trend-stable">
                    <span class="trend-emoji">📊</span>
                    <div>
                        <div class="trend-label">Stabil</div>
                        <p class="stat-description">Intensitas konsisten</p>
                    </div>
                </div>
            `
  }
}

function downloadReport() {
  const stats = getEmotionStats()

  const reportData = {
    period: reportPeriod,
    generatedAt: new Date().toISOString(),
    summary: {
      totalEntries: stats.totalEntries,
      averageIntensity: stats.averageIntensity,
      mostFrequentEmotion: stats.mostFrequent,
      intensityTrend: stats.intensityTrend,
    },
    emotionBreakdown: stats.emotionCounts,
    detailedEntries: filteredEmotions.map((emotion) => ({
      date: formatDate(emotion.timestamp),
      time: formatTime(emotion.timestamp),
      emotion: getEmotionName(emotion.emotion),
      intensity: emotion.intensity,
      note: emotion.note,
    })),
  }

  const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `emosync-report-${reportPeriod}-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Utility functions
function getEmotionEmoji(emotion) {
  const emojiMap = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    anxious: "😰",
    tired: "😴",
    loved: "🤗",
    confused: "😕",
    excited: "🎉",
  }
  return emojiMap[emotion] || "😐"
}

function getEmotionName(emotion) {
  const nameMap = {
    happy: "Bahagia",
    sad: "Sedih",
    angry: "Marah",
    anxious: "Cemas",
    tired: "Lelah",
    loved: "Dicintai",
    confused: "Bingung",
    excited: "Bersemangat",
  }
  return nameMap[emotion] || emotion
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("id-ID")
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Navigation functions
function goToDashboard() {
  window.location.href = "dashboard.html"
}

function goToHome() {
  window.location.href = "index.html"
}
