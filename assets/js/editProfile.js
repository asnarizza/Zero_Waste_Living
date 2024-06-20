document.addEventListener("DOMContentLoaded", function() {
    const userId = localStorage.getItem('userId');

    if (userId) {
        fetch(`../../api/auth/profile.php?userId=${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data && !data.error) {
                    document.getElementById('profileImage').src = `data:image/jpeg;base64,${data.image}`;
                    document.getElementById('name').value = data.name;
                    document.getElementById('email').value = data.email;
                    document.getElementById('password').value = data.password;
                    document.getElementById('gender').value = data.gender;
                    document.getElementById('dob').value = data.birthDate;
                } else {
                    console.error("Error fetching profile data:", data.error);
                }
            })
            .catch(error => {
                console.error("Error fetching profile data:", error);
            });

        document.getElementById("editProfileForm").addEventListener("submit", function(event) {
            event.preventDefault();

            const formData = {
                userId: userId,
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
                gender: document.getElementById("gender").value,
                birthDate: document.getElementById("dob").value,
                image: document.getElementById("profileImage").src.split(',')[1] // Extract base64 part only
            };

            const fileInput = document.getElementById('profileImageUpload');
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    const base64Image = e.target.result.split(',')[1]; // Extract base64 part only
                    formData.image = base64Image;
                    updateProfile(formData);
                };
                reader.readAsDataURL(file);
            } else {
                updateProfile(formData);
            }
        });
    } else {
        console.error("No userId found in localStorage");
    }
});

function updateProfile(formData) {
    fetch('../../api/auth/profile.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.message) {
            alert(data.message);
            window.location.href = "../member/profileMember.html";
        } else {
            console.error("Error updating profile data:", data.error);
        }
    })
    .catch(error => {
        console.error("Error updating profile data:", error);
    });
}

// Image upload change event
document.getElementById('profileImageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profileImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Toggle password visibility function
function togglePasswordVisibility(id) {
    const passwordField = document.getElementById(id);
    const type = passwordField.type === "password" ? "text" : "password";
    passwordField.type = type;
}

// Toggle hamburger menu function
function toggleHamburgerMenu() {
    const menu = document.getElementById("hamburgerMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}
