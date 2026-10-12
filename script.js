// ==========================================
// GET USERS FROM LOCAL STORAGE
// ==========================================

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}


// ==========================================
// SAVE USERS
// ==========================================

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}


// ==========================================
// SHA-256 PASSWORD HASHING
// ==========================================

async function hashPassword(password) {

    const encoder = new TextEncoder();

    const data = encoder.encode(password);

    const hashBuffer =
        await crypto.subtle.digest("SHA-256", data);

    const hashArray =
        Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


// ==========================================
// REGISTER
// ==========================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const username =
            document.getElementById("registerUsername")
            .value
            .trim();

        const password =
            document.getElementById("registerPassword")
            .value;

        const message =
            document.getElementById("registerMessage");


        // Check empty fields

        if (username === "" || password === "") {

            message.textContent =
                "Please fill in all fields.";

            message.className = "error";

            return;
        }


        // Password validation
        // Minimum 8 characters
        // At least 1 number

        const passwordPattern =
            /^(?=.*[0-9]).{8,}$/;

        if (!passwordPattern.test(password)) {

            message.textContent =
                "Password must contain at least 8 characters and 1 number.";

            message.className = "error";

            return;
        }


        // Get existing users

        const users = getUsers();


        // Check duplicate username/email

        const existingUser =
            users.find(function(user) {

                return user.username.toLowerCase() ===
                    username.toLowerCase();

            });


        if (existingUser) {

            message.textContent =
                "Username or email already exists.";

            message.className = "error";

            return;
        }


        // Hash password

        const passwordHash =
            await hashPassword(password);


        // Create new user

        const newUser = {

            username: username,

            passwordHash: passwordHash
        };


        // Add user

        users.push(newUser);

        saveUsers(users);


        message.textContent =
            "Registration successful!";

        message.className = "success";


        // Clear form

        registerForm.reset();


        // Go to login page

        setTimeout(function() {

            window.location.href = "login.html";

        }, 1000);

    });
}


// ==========================================
// LOGIN
// ==========================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const username =
            document.getElementById("loginUsername")
            .value
            .trim();

        const password =
            document.getElementById("loginPassword")
            .value;

        const message =
            document.getElementById("loginMessage");


        // Check empty fields

        if (username === "" || password === "") {

            message.textContent =
                "Please enter username and password.";

            message.className = "error";

            return;
        }


        // Get users

        const users = getUsers();


        // Find user

        const user =
            users.find(function(item) {

                return item.username.toLowerCase() ===
                    username.toLowerCase();

            });


        // Incorrect username

        if (!user) {

            message.textContent =
                "Invalid username or password.";

            message.className = "error";

            return;
        }


        // Hash entered password

        const enteredPasswordHash =
            await hashPassword(password);


        // Check password

        if (enteredPasswordHash !== user.passwordHash) {

            message.textContent =
                "Invalid username or password.";

            message.className = "error";

            return;
        }


        // Create session

        localStorage.setItem(
            "loggedInUser",
            user.username
        );


        message.textContent =
            "Login successful!";

        message.className = "success";


        // Open dashboard

        setTimeout(function() {

            window.location.href =
                "dashboard.html";

        }, 700);

    });
}


// ==========================================
// PROTECT DASHBOARD
// ==========================================

if (
    window.location.pathname.endsWith("dashboard.html")
) {

    const loggedInUser =
        localStorage.getItem("loggedInUser");


    // If not logged in, go to login

    if (!loggedInUser) {

        window.location.href = "login.html";

    } else {

        const welcomeMessage =
            document.getElementById("welcomeMessage");

        if (welcomeMessage) {

            welcomeMessage.textContent =
                "Welcome, " + loggedInUser + "!";
        }
    }
}


// ==========================================
// LOGOUT
// ==========================================

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", function() {

        // Clear session

        localStorage.removeItem("loggedInUser");

        // Redirect to login

        window.location.href = "login.html";

    });
}