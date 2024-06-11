const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Email: ", email);
    console.log("Password: ", password);

    const data = {
        action: "login", // Make sure to include the action
        email: email,
        password: password,
    };

    console.log("Data: ", data);

    try {
        const response = await fetch('../api/auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Save user data to local storage
            localStorage.setItem("userId", result.userId);
            localStorage.setItem("roleId", result.roleId);
            localStorage.setItem("name", result.name);
            localStorage.setItem("email", result.email);
            localStorage.setItem("gender", result.gender);
            localStorage.setItem("birthDate", result.birthDate);
            if (result.image) {
                localStorage.setItem("image", result.image);
            }

            console.log("User data saved to local storage:", result); // Add print statement to check

            alert("Login successful!");

            // Redirect based on user role
            if (result.roleId == 1) {
                window.location.href = "../View/admin/dashboard.html";
            } else {
                window.location.href = "../View/member/homepageMember.html";
            }
        } else {
            alert(result.error || "An error occurred. Please try again.");
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').innerText = "An error occurred. Please try again.";
    }
});