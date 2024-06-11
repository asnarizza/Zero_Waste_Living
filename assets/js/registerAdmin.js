document.addEventListener('DOMContentLoaded', function () {
    // Initialize the application
    init();

    // Function to initialize the application
    function init() {
        setupEventListeners();
    }

    // Function to set up event listeners
    function setupEventListeners() {
        document.getElementById('registerAdmin').addEventListener('submit', registerAdmin);
    }

    // Function to handle cafe owner registration
    async function registerAdmin(event) {
        event.preventDefault(); // Prevent the default form submission

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const gender = document.getElementById('gender').value;
        const birthDate = document.getElementById('birthDate').value;
        const image = document.getElementById('image').value;

        const registrationData = {
            action: "registerAdmin",
            name: name,
            email: email,
            password: password,
            gender: gender,
            birthDate: birthDate,
            image: image
        };

        console.log(registrationData)

        try {
            const response = await fetch("../api/auth/register.php?action=registerAdmin", {
                // Change this URL to your actual endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registrationData)
            });

            const result = await response.json();

            if (response.ok) {
                
                alert('Registration successful!');
                window.location.href = "login.html";
                document.getElementById('registerAdmin').reset();
                console.log(result);
            } else {
                alert('Failed To Register!');
                document.getElementById('registerAdmin').reset();
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('message').innerText = 'An error occurred while registering.';
        }
    }
});

// async function setUserName() {

//     var userData = JSON.parse(sessionStorage.getItem("userData"));
//     var name = userData.name
//     var cafeId = userData.cafe_id;

//     document.querySelector('.user-info span').textContent = name;

//         // Process the returned data
//         if (data.totalDailyDonations && data.totalDailyDonations.totalQuantity !== undefined) {
//             const totalQuantity = data.totalDailyDonations.totalQuantity;
//             // Update the DOM element with the fetched data
//             document.querySelector('.dailyDonation .text p').textContent = totalQuantity;
//         } else {
//             document.querySelector('.dailyDonation .text p').textContent = '0';
//         }
   
// }

// setUserName()