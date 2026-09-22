function handleRegister(event) {
    event.preventDefault();

    const nameInput = document.getElementById("reg-name");
    const emailInput = document.getElementById("reg-email");
    const passwordInput = document.getElementById("reg-password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";
    const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : "";

    if (!name || !email || !password || !confirmPassword) {
        showToast("Por favor completa todos los campos del formulario.", "error");
        return;
    }

    if (password.length < 6) {
        showToast("La contraseña debe tener al menos 6 caracteres.", "error");
        if (passwordInput) passwordInput.focus();
        return;
    }

    if (password !== confirmPassword) {
        showToast("Las contraseñas no coinciden.", "error");
        if (confirmPasswordInput) confirmPasswordInput.focus();
        return;
    }

    localStorage.setItem("registeredUser", name);
    localStorage.setItem("registeredEmail", email);

    showToast("¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...", "success");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
}

function handleLogin(event) {
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const registeredEmail = localStorage.getItem("registeredEmail");
    const registeredUser = localStorage.getItem("registeredUser");

    if (!registeredEmail || !registeredUser) {
        showToast("Primero debes crear una cuenta.", "error");

        setTimeout(() => {
            window.location.href = "register.html";
        }, 1500);
        return;
    }

    if (email !== registeredEmail) {
        showToast("El correo electrónico no está registrado.", "error");
        emailInput.focus();
        return;
    }

    if (!password) {
        showToast("Por favor escribe tu contraseña.", "error");
        passwordInput.focus();
        return;
    }

    showToast(`¡Bienvenido, ${registeredUser}!`, "success");

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
}

function showRegisteredUser() {
    const registeredUser = localStorage.getItem("registeredUser");

    const registerButton = document.getElementById("register-button");
    const registeredUserElement = document.getElementById("registered-user");

    if (!registerButton || !registeredUserElement) return;

    if (registeredUser) {
        registerButton.style.display = "none";

        registeredUserElement.textContent = `Usuario: ${registeredUser}`;
        registeredUserElement.style.display = "inline-block";
    } else {
        registerButton.style.display = "inline-block";

        registeredUserElement.style.display = "none";
    }
}

function showToast(message, type = "info") {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.innerHTML = `
            <span id="toast-icon"></span>
            <span id="toast-message"></span>
        `;
        document.body.appendChild(toast);
    }

    const toastMessage = document.getElementById("toast-message");
    const toastIcon = document.getElementById("toast-icon");

    const colors = {
        success: "#10b981",
        error: "#ef4444",
        info: "#0f172a"
    };

    const icons = {
        success: "✓",
        error: "⚠",
        info: "i"
    };

    toast.style.position = "fixed";
    toast.style.right = "20px";
    toast.style.bottom = "20px";
    toast.style.background = colors[type] || colors.info;
    toast.style.color = "white";
    toast.style.padding = "14px 20px";
    toast.style.borderRadius = "10px";
    toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
    toast.style.zIndex = "9999";
    toast.style.display = "flex";
    toast.style.gap = "10px";
    toast.style.fontFamily = "Arial, sans-serif";
    toast.style.fontSize = "0.95rem";

    toastMessage.textContent = message;
    toastIcon.textContent = icons[type] || icons.info;

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    showRegisteredUser();
});
 
