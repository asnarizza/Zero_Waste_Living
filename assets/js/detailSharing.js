// Function to handle form submission
function submitForm() {
    // Get form data
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    
    // Retrieve userId from query parameters in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    
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
    
            console.log(requestData);
    
            // Send data to server
            fetch('../../api/sharing.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            })
            .then(response => {
                console.log(response); // Log the response for debugging
                if (response.ok) {
                    console.log("berjaya");
                    window.location.href = '../../View/member/homepageMember.html';
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

// Event listener for form submission
document.addEventListener('DOMContentLoaded', function() {
    const createButton = document.querySelector('.create-button');
    createButton.addEventListener('click', function(event) {
        event.preventDefault();
        submitForm();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve userId from localStorage
    const userId = localStorage.getItem('userId');

    if (userId) {
        // Fetch user profile data using userId
        fetch(`../../api/auth/profile.php?userId=${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse response as JSON
            })
            .then(userData => {
                if (userData && userData.image) {
                    console.log('Parsed user data:', userData);

                    // Update profile image for profile-icon
                    const profileIcon = document.getElementById('profileIcon');
                    profileIcon.textContent = ''; // Clear existing content ('A')

                    const profileImage = document.createElement('img');
                    profileImage.src = 'data:image/jpeg;base64,' + userData.image;
                    profileImage.alt = 'Profile Image'; // Add alt text for accessibility
                    profileImage.classList.add('avatar-image'); // Optionally add a class for styling

                    profileIcon.appendChild(profileImage); // Append the image to profileIcon div
                } else {
                    console.log('User data or profile image not found.');
                }
            })
            .catch(error => {
                console.error('Error fetching user profile data:', error);
            });
    } else {
        console.log('userId not found in local storage.');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const sharingId = params.get('sharingId');
    const userId = params.get('userId');

    if (sharingId) {
        fetch(`../../api/sharing.php?action=listById&sharingId=${sharingId}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.data) {
                    const post = data.data;
                    document.getElementById('post-title').textContent = post.title;
                    document.getElementById('post-description').textContent = post.titleDescription;
                    document.getElementById('main-image').src = 'data:image/jpeg;base64,' + post.image;

                    // Fetch comments
                    fetch(`../../api/comment.php?sharingId=${sharingId}`)
                        .then(response => response.json())
                        .then(commentData => {
                            if (commentData && commentData.data) {
                                const commentsSection = document.querySelector('.comments-section');
                                commentsSection.innerHTML = '<h2>Comments</h2>'; // Clear existing comments
                                commentData.data.forEach(comment => {
                                    const commentDiv = document.createElement('div');
                                    commentDiv.className = 'comment';
                                    
                                    const commentAuthor = document.createElement('span');
                                    commentAuthor.className = 'comment-author';
                                    commentAuthor.textContent = comment.name; // User's name
                                    
                                    const commentText = document.createElement('p');
                                    commentText.textContent = comment.comment;
                                    
                                    const commentTime = document.createElement('span');
                                    commentTime.className = 'comment-time';
                                    commentTime.textContent = '2w'; // Placeholder for comment time

                                    const likeButton = document.createElement('button');
                                    likeButton.className = 'like-button';
                                    likeButton.textContent = '👍 8'; // Placeholder for like count

                                    commentDiv.appendChild(commentAuthor);
                                    commentDiv.appendChild(commentText);
                                    commentDiv.appendChild(commentTime);
                                    commentDiv.appendChild(likeButton);
                                    
                                    commentsSection.appendChild(commentDiv);
                                });
                            } else {
                                console.error('No comments found.');
                            }
                        })
                        .catch(error => console.error('Error fetching comments:', error));
                } else {
                    console.error('No record found.');
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    } else {
        console.error('No sharingId provided in URL.');
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const commentForm = document.getElementById('commentForm');
    commentForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get input values
        const commentInput = document.getElementById('commentInput').value.trim(); // Trim any whitespace

        const params = new URLSearchParams(window.location.search);
        const sharingId = params.get('sharingId');

        const userId = localStorage.getItem('userId');


        // Validate comment input
        if (commentInput === '') {
            alert('Please enter a comment.'); // You can implement a better UI feedback
            return;
        }

        // Prepare data to send
        const data = {
            comment: commentInput,
            userId: userId,
            sharingId: sharingId
        };

        // Send comment data to server
        fetch('../../api/comment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful response
            console.log('Success:', data);
            // Clear comment input after successful submission (optional)
            document.getElementById('commentInput').value = '';
            // You can update the UI to show the new comment dynamically
            // For simplicity, reload the page or update comments section after successful submission
            location.reload(); // Example: Reload the page
        })
        .catch((error) => {
            // Handle error
            console.error('Error:', error);
            alert('Failed to post comment. Please try again.'); // You can implement a better UI feedback
        });
    });
});


function openModal() {
    document.getElementById('createPostModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('createPostModal').style.display = 'none';
}