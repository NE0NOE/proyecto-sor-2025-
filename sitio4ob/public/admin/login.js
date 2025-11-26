const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

const API_URL = "/api/admin/login";

// Si ya está logueado → redirigir al dashboard
async function verificarSesion() {
    const resp = await fetch("/api/admin/me");
    if (resp.ok) {
        window.location.href = "dashboard.html";
    }
}
verificarSesion();

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const resp = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await resp.json();

    if (data.ok) {
        // Login correcto → redirect
        window.location.href = "dashboard.html";
    } else {
        errorMsg.textContent = data.message || "Credenciales incorrectas.";
    }
});
