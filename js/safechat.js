// Supportive responses
const supportiveResponses = [
  "Terima kasih sudah berbagi. Perasaanmu sangat valid dan penting.",
  "Aku mendengarkan. Ceritakan lebih lanjut jika kamu merasa nyaman.",
  "Kamu sangat berani karena mau terbuka tentang perasaanmu.",
  "Ingat bahwa kamu tidak sendirian dalam menghadapi ini.",
  "Setiap langkah kecil menuju penyembuhan adalah kemajuan yang berarti.",
  "Perasaanmu wajar dan manusiawi. Tidak apa-apa merasa seperti ini.",
  "Kamu sudah melakukan yang terbaik dalam situasi yang sulit.",
  "Terima kasih sudah mempercayai ruang ini untuk berbagi.",
  "Kekuatanmu lebih besar dari yang kamu kira.",
  "Hari ini mungkin sulit, tapi kamu mampu melewatinya.",
]

// Global variables
let messages = []
let isTyping = false

// Initialize chat
document.addEventListener("DOMContentLoaded", () => {
  initializeChat()
})

function initializeChat() {
  // Load existing messages
  const savedMessages = JSON.parse(localStorage.getItem("safeChatMessages") || "[]")

  if (savedMessages.length === 0) {
    // Add welcome message
    const welcomeMessage = {
      id: Date.now(),
      text: "Selamat datang di Safe Chat! Ini adalah ruang aman untuk berbagi perasaan dan pikiranmu. Semua yang kamu tulis di sini akan dijaga kerahasiaannya. Ceritakan apa yang ada di hatimu.",
      timestamp: new Date().toISOString(),
      isUser: false,
    }
    messages = [welcomeMessage]
  } else {
    messages = savedMessages
  }

  renderMessages()
  setupMessageInput()
}

function renderMessages() {
  const container = document.getElementById("messagesContainer")
  
  // Clear empty state if exists
  const emptyState = container.querySelector('.empty-state')
  if (emptyState) {
    emptyState.remove()
  }

  if (messages.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💬</div>
        <p>Mulai percakapan dengan mengetik pesan di bawah...</p>
      </div>
    `
    return
  }

  container.innerHTML = ""

  messages.forEach((message, index) => {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${message.isUser ? "user" : "bot"}`
    
    const messageTime = new Date(message.timestamp).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })

    messageDiv.innerHTML = `
      <div>${message.text}</div>
      <div class="message-time">${messageTime}</div>
    `
      // Add stagger animation
    messageDiv.style.animationDelay = `${index * 0.1}s`
    
    container.appendChild(messageDiv)
  })

  // Scroll to bottom smoothly
  setTimeout(() => {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    })
  }, 100)

  // Add typing indicator if needed
  if (isTyping) {
    const typingDiv = document.createElement("div")
    typingDiv.className = "message bot typing"
    typingDiv.innerHTML = `
      <div class="typing-indicator">
        <span></span>        <span></span>
        <span></span>
      </div>
    `
    container.appendChild(typingDiv)
  }

  // Auto scroll to bottom
  container.scrollTop = container.scrollHeight

  // Save messages
  localStorage.setItem("safeChatMessages", JSON.stringify(messages))
}

function setupMessageInput() {
  const messageInput = document.getElementById("messageInput")
  const sendBtn = document.getElementById("sendBtn")

  messageInput.addEventListener("input", () => {
    const text = messageInput.value.trim()
    sendBtn.disabled = !text || isTyping
  })

  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  })
}

function sendMessage() {
  const messageInput = document.getElementById("messageInput")
  const sendBtn = document.getElementById("sendBtn")
  const text = messageInput.value.trim()

  if (!text || isTyping) return

  // Add user message
  const userMessage = {
    id: Date.now(),
    text: text,
    timestamp: new Date().toISOString(),
    isUser: true,
  }

  messages.push(userMessage)
  messageInput.value = ""
  sendBtn.disabled = true
  isTyping = true

  renderMessages()

  // Simulate AI response (contextual)
  setTimeout(
    () => {
      const aiMessage = {
        id: Date.now() + 1,
        text: generateContextualResponse(text), // Respons kontekstual
        timestamp: new Date().toISOString(),
        isUser: false,
      }

      messages.push(aiMessage)
      isTyping = false
      renderMessages()
    },
    1000 + Math.random() * 500,
  )
}

// Fungsi untuk menghasilkan respons kontekstual
function generateContextualResponse(input) {
  const msg = input.toLowerCase()
  if (msg.includes('bahagia') || msg.includes('senang') || msg.includes('gembira') || msg.includes('excited')) {
    return "Bagus sekali! Senang mendengarnya kamu sangat bahagia hari ini. Semoga kebahagiaanmu terus berlanjut!";
  }
  if (msg.includes('sedih') || msg.includes('kecewa') || msg.includes('galau')) {
    return "Aku turut merasakan kesedihanmu. Tidak apa-apa merasa sedih, semoga perasaanmu segera membaik. Jika ingin bercerita lebih banyak, aku siap mendengarkan.";
  }
  if (msg.includes('marah') || msg.includes('kesal') || msg.includes('emosi')) {
    return "Perasaan marah itu wajar, yang penting kamu bisa mengekspresikannya dengan cara yang sehat. Semoga setelah ini perasaanmu lebih baik.";
  }
  if (msg.includes('cemas') || msg.includes('khawatir') || msg.includes('takut') || msg.includes('panik')) {
    return "Rasa cemas dan khawatir memang tidak nyaman. Cobalah tarik napas dalam-dalam dan tenangkan dirimu. Kamu tidak sendirian.";
  }
  if (msg.includes('capek') || msg.includes('lelah') || msg.includes('letih') || msg.includes('burnout')) {
    return "Kamu sudah berusaha dengan baik. Jangan lupa istirahat dan rawat dirimu. Semoga energi positif segera kembali.";
  }
  if (msg.includes('bingung') || msg.includes('dilema')) {
    return "Saat bingung, tidak apa-apa untuk mengambil waktu berpikir. Jika ingin diskusi atau curhat, aku siap mendengarkan.";
  }
  if (msg.includes('sendiri') || msg.includes('kesepian') || msg.includes('lonely')) {
    return "Merasa sendiri itu berat, tapi kamu tidak benar-benar sendirian. Aku di sini untuk menemanimu.";
  }
  if (msg.includes('putus') || msg.includes('patah hati') || msg.includes('mantan')) {
    return "Patah hati memang menyakitkan. Semoga kamu bisa segera pulih dan menemukan kebahagiaan baru.";
  }
  if (msg.includes('keluarga') || msg.includes('orangtua')) {
    return "Masalah keluarga memang kadang rumit. Semoga hubunganmu dengan keluarga bisa membaik. Jika ingin cerita, aku siap mendengarkan.";
  }
  if (msg.includes('sekolah') || msg.includes('kuliah') || msg.includes('kerja') || msg.includes('tugas')) {
    return "Tekanan dari sekolah, kuliah, atau pekerjaan memang bisa berat. Jangan lupa luangkan waktu untuk dirimu sendiri juga.";
  }
  if (msg.includes('terima kasih') || msg.includes('makasih') || msg.includes('thanks')) {
    return "Sama-sama! Aku senang bisa membantu dan mendengarkan ceritamu.";
  }
  if (msg.length < 10) {
    return "Boleh ceritakan lebih detail? Aku siap mendengarkan apapun yang ingin kamu sampaikan.";
  }
  // Default
  return "Terima kasih sudah berbagi. Aku akan selalu siap mendengarkan dan mendukungmu. Ceritakan saja apapun yang kamu rasakan.";
}

function clearChat() {
  messages = []
  localStorage.removeItem("safeChatMessages")

  // Add welcome message again
  const welcomeMessage = {
    id: Date.now(),
    text: "Chat telah dibersihkan. Ini adalah ruang aman untuk berbagi perasaan dan pikiranmu. Ceritakan apa yang ada di hatimu.",
    timestamp: new Date().toISOString(),
    isUser: false,
  }

  messages = [welcomeMessage]
  renderMessages()
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
