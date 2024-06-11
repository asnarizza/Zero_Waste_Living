document.addEventListener('DOMContentLoaded', function () {
    // Initialize the application
    init();

    // Function to initialize the application
    function init() {
        setupEventListeners();
    }

    // Function to set up event listeners
    function setupEventListeners() {
        document.getElementById('registerMember').addEventListener('submit', registerMember);
    }

    // Function to handle cafe owner registration
    async function registerMember(event) {
        event.preventDefault(); // Prevent the default form submission

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const gender = document.getElementById('gender').value;
        const birthDate = document.getElementById('birthDate').value;
        //const image = document.getElementById('image').value;
        const imageInput = document.getElementById('image');

        // Check if a file is selected
        if (imageInput.files.length > 0) {
            const imageFile = imageInput.files[0];

            // Create a new FileReader object
            const reader = new FileReader();

            // Event listener for when FileReader has read the file
            reader.onload = async function(event) {
                // event.target.result contains the binary data of the file
                const imageBinaryData = event.target.result;
                // Convert binary data to Base64
            const base64Image = btoa(imageBinaryData);

            // Display the Base64-encoded image data
            console.log(base64Image);
            
                // Prepare registration data including the image binary data
                const registrationData = {
                    action: "registerMember",
                    name: name,
                    email: email,
                    password: password,
                    gender: gender,
                    birthDate: birthDate,
                    image: base64Image // Include the image binary data
                };
                console.log(registrationData)
                try {
                    const response = await fetch("../../api/auth/register.php?action=registerMember", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(registrationData)
                    });

                    const result = await response.json();

                    if (response.ok) {
                        alert('Registration successful!');
                        window.location.href = "../login.html";
                        document.getElementById('registerMember').reset();
                        console.log(result);
                    } else {
                        alert('Failed To Register!');
                        document.getElementById('registerMember').reset();
                    }
                } catch (error) {
                    console.error('Error:', error);
                    document.getElementById('message').innerText = 'An error occurred while registering.';
                }
            };

            // Read the image file as binary data
            reader.readAsArrayBuffer(imageFile);
        } else {
            // If no file is selected, handle the case accordingly (e.g., display an error message)
            console.error('No image file selected');
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