document.addEventListener('DOMContentLoaded', function() {
    let verifiedEmail = '';

    document.getElementById('checkEmail').addEventListener('click', function() {
        const email = document.getElementById('email').value;

        fetch('../api/auth/login.php?action=checkEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'checkEmail',
                email: email
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('emailError').style.display = 'block'; // Show the error message
                verifiedEmail = ''; // Reset the verified email
            } else {
                document.getElementById('emailError').style.display = 'none'; // Hide the error message
                verifiedEmail = email;
                document.getElementById('emailSection').style.display = 'none';
                document.getElementById('passwordSection').style.display = 'block';
            }
        })
        .catch(error => console.error('Error:', error));
    });

    document.getElementById('forgotPassword').addEventListener('submit', function(event) {
        event.preventDefault();

        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!verifiedEmail) {
            alert('Please check your email.');
            return;
        }

        if (!newPassword || !confirmPassword) {
            alert('New password and confirm password are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New password and confirm password do not match.');
            return;
        }

        fetch('../api/auth/login.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'login',
                email: verifiedEmail,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Error: ' + data.error);
            } else {
                alert('Success: ' + data.message);
                window.location.href = '../View/Login.html';
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
