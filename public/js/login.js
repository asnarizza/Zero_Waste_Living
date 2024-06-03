
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginData = {
        email: email,
        password: password
    };
    console.log(loginData)

    try {
        const response = await fetch('../api/auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();
        


        if (response.ok) {
            console.log("test ok")
            sessionStorage.setItem('userData', JSON.stringify(result));

            console.log(sessionStorage.getItem('userData'))
            // Login successful, handle the response
            //document.getElementById('message').innerText = 'Login successful!';
            console.log(result.roleId);
            // Redirect to another page or perform any other desired actions

            // Check if cafe_id and matric_no are not null
            if (result.roleId == 1) {
                // Redirect to cafeOwnerDashboard
                console.log("ok")
                window.location.href = "../View/member/registerMember.html";
            } else {
                // Redirect to studentDashboard
                window.location.href = "homepage.html";
            }

        } else {
            // Login failed, display the error message
            //document.getElementById('message').innerText = result.error || 'Login failed!';
        }
    } catch (error) {
        console.error('Error:', error);
        //document.getElementById('message').innerText = 'An error occurred while logging in.';
    }
});
