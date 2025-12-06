async function register() {
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/auth/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ fullName, email, password })
    });

    if (res.status === 200) {
        alert("Registered successfully");
        window.location.href = "login.html";
    } else {
        alert("Registration failed (maybe email already exists)");
    }
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    });

    const token = await res.text();

    if (token.startsWith("ey")) {
        localStorage.setItem("token", token);
        alert("Login successful");
        window.location.href = "index.html"; // your dashboard
    } else {
        alert("Invalid email or password");
    }
}
