// auth.js
// Sederhana: simpan user di localStorage

function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function setCurrentUser(username) {
    localStorage.setItem('currentUser', username);
}

function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
}

// Login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const users = getUsers();
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            setCurrentUser(username);
            // Set userName untuk ditampilkan di halaman
            localStorage.setItem('userName', username);
            window.location.href = 'index.html';        } else {
            const errorDiv = document.getElementById('loginError');
            errorDiv.textContent = 'Username atau password salah!';
            errorDiv.style.display = 'block';
        }
    }
}

// Register
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        let users = getUsers();        if (users.find(u => u.username === username)) {
            const errorDiv = document.getElementById('registerError');
            errorDiv.textContent = 'Username sudah terdaftar!';
            errorDiv.style.display = 'block';
            return;
        }
        users.push({ username, password });
        saveUsers(users);        
        // Tampilkan pesan sukses
        const errorDiv = document.getElementById('registerError');
        if (errorDiv) errorDiv.style.display = 'none';
        
        const successElement = document.getElementById('registerSuccess');
        if (successElement) {
            successElement.style.display = 'block';
        }
        
        // Arahkan ke login setelah 2 detik
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }
}

// Cek login di halaman lain
if (!['/login.html', '/register.html', '/index.html'].some(p => window.location.pathname.endsWith(p))) {
    if (!getCurrentUser()) {
        window.location.href = 'login.html';
    }
}

// Logout button handler
window.handleLogout = logout;
