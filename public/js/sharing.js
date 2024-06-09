document.addEventListener('DOMContentLoaded', function() {
    // Assuming you're fetching all data initially
    fetch('http://localhost/Zero_Waste_Living/api/sharing.php?action=listAll')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (data && data.data && data.data.length > 0) {
                const container = document.getElementById('card-container');
                data.data.forEach(item => {
                    const card = document.createElement('div');
                    card.classList.add('card');

                    const overlay = document.createElement('div');
                    overlay.classList.add('overlay');

                    const title = document.createElement('h2');
                    title.textContent = item.title;

                    const image = document.createElement('img');
                    // Decode base64 image data
                    image.src = 'data:image/jpeg;base64,' + item.image;
                    
                    // Add event listener to each card
                    card.addEventListener('click', function() {
                        // Redirect to detail page with the specific item ID and user ID
                        window.location.href = 'detailPage.html?sharingId=' + item.sharingId + '&userId=' + item.userId;
                    });
                    

                    // Append elements to construct the card
                    overlay.appendChild(image);
                    overlay.appendChild(title);
                    card.appendChild(overlay);
                    container.appendChild(card);
                });
            } else {
                console.error('No records found.');
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});

document.addEventListener('DOMContentLoaded', function() {
    // Event listener for form submission
    const createButton = document.getElementById('createButton');
    console.log('Create button:', createButton); // Debugging statement
    if (createButton) {
        createButton.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Create button clicked'); // Debugging statement
            submitForm();
        });
    } else {
        console.error('Create button not found');
    }
});

// Function to handle form submission
function submitForm() {
    // Get form data
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    // Retrieve userId from localStorage
    const userId = localStorage.getItem('userId');
    console.log(userId);

    // Get the main image file input element
    const imageInput = document.getElementById('image');

    // Check if a file is selected
    if (imageInput.files.length > 0) {
        const file = imageInput.files[0];

        // Create a FileReader to read the selected file
        const reader = new FileReader();

        // Define what to do when the file has been loaded
        reader.onload = function(e) {
            // Get the base64-encoded image data
            const imageBase64 = e.target.result.split(',')[1]; // Remove the Data URL prefix

            // Construct request body
            const requestData = {
                title: title,
                titleDescription: description,
                image: imageBase64,
                userId: userId,
                categoryId: category
            };

            console.log('Request Data:', requestData); // Log requestData for debugging

            // Send data to server
            fetch('http://localhost/Zero_Waste_Living/api/sharing.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            })
            .then(response => {
                console.log('Response:', response); // Log the response for debugging
                if (response.ok) {
                    console.log("Submission successful");
                    window.location.href = '../member/homepageMember.html';
                } else {
                    console.error('Failed to submit form');
                }
            })
            .catch(error => {
                // Handle error
                console.error('There was a problem with the fetch operation:', error);
                // You can add further error handling here, like showing an error message to the user
            });
        };

        // Read the selected file as a data URL
        reader.readAsDataURL(file);
    } else {
        // If no file is selected, handle the case accordingly (e.g., display an error message)
        console.error('No image file selected');
    }
}


function openModal() {
    document.getElementById('createPostModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('createPostModal').style.display = 'none';
}
