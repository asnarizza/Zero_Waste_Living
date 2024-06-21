document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const sharingId = params.get('sharingId');
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage

    if (sharingId) {
        // Fetch the post details
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
                                    // Create a div element for each comment
                                    const commentDiv = document.createElement('div');
                                    commentDiv.className = 'comment';
                                
                                    // Create a span for the comment author's name
                                    const commentAuthor = document.createElement('span');
                                    commentAuthor.className = 'comment-author';
                                    commentAuthor.textContent = comment.name;
                                
                                    // Create a paragraph for the comment text
                                    const commentText = document.createElement('p');
                                    commentText.textContent = comment.comment;
                                
                                    // Append author name and comment text to the comment div
                                    commentDiv.appendChild(commentAuthor);
                                    commentDiv.appendChild(commentText);
                                
                                    // Check if the comment belongs to the logged-in user
                                    if (String(comment.userId) === String(userId)) {
                                        // Create edit button
                                        const editButton = document.createElement('button');
                                        editButton.textContent = 'Edit';
                                        editButton.addEventListener('click', () => {
                                            // Populate comment in the comment input for editing
                                            document.getElementById('commentInput').value = comment.comment;
                                            // Update commentId data attribute on form for future reference
                                            document.getElementById('commentForm').setAttribute('data-comment-id', comment.commentId);
                                            // Change submit button to update mode
                                            const submitButton = document.querySelector('.comment-form button[type="submit"]');
                                            submitButton.textContent = 'Update Comment';
                                            submitButton.removeEventListener('click', submitNewComment);
                                            submitButton.addEventListener('click', updateComment);
                                        });
                                        commentDiv.appendChild(editButton);
                                
                                        // Create delete button
                                        const deleteButton = document.createElement('button');
                                        deleteButton.textContent = 'Delete';
                                        deleteButton.addEventListener('click', () => {
                                            // Call deleteComment function passing commentId
                                            deleteComment(comment.commentId);
                                        });
                                        commentDiv.appendChild(deleteButton);
                                    }
                                
                                    // Append the comment div to the comments section
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
    
            // Send data to server
            fetch('../../api/sharing.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            })
            .then(response => {
                if (response.ok) {
                    window.location.href = '../../View/member/homepageMember.html';
                } else {
                    console.error('Failed to submit form');
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        };
        
        // Read the selected file as a data URL
        reader.readAsDataURL(file);
    } else {
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

// Function to handle form submission for posting new comment
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
            console.log('Success:', data);
            document.getElementById('commentInput').value = '';
            location.reload(); // Example: Reload the page
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to post comment. Please try again.');
        });
    });
});

// Function to handle updating a comment
function updateComment(event) {
    event.preventDefault();
    const commentId = document.getElementById('commentForm').getAttribute('data-comment-id');
    const updatedComment = document.getElementById('commentInput').value.trim();
    const userId = localStorage.getItem('userId');
    const sharingId = new URLSearchParams(window.location.search).get('sharingId');

    if (!updatedComment) {
        alert('Please enter a valid comment.');
        return;
    }

    const data = {
        comment: updatedComment,
        userId: userId,
        sharingId: sharingId
    };

    fetch(`../../api/comment.php?commentId=${commentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            // Update UI after successful update
            location.reload(); // Reload page to reflect changes
        } else {
            console.error('Failed to update comment');
        }
    })
    .catch(error => console.error('Error updating comment:', error));
}


// Function to handle submitting a new comment
function submitNewComment(event) {
    event.preventDefault();
    const commentInput = document.getElementById('commentInput').value.trim();

    if (!commentInput) {
        alert('Please enter a comment.');
        return;
    }

    const data = {
        comment: commentInput,
        userId: localStorage.getItem('userId'),
        sharingId: new URLSearchParams(window.location.search).get('sharingId')
    };

    fetch('../../api/comment.php?commentId=${commentId}', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('commentInput').value = '';
        location.reload();
    })
    .catch(error => console.error('Error posting new comment:', error));
}

// Function to handle deleting a comment
function deleteComment(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) {
        return;
    }

    fetch(`../../api/comment.php?commentId=${commentId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            location.reload(); // Reload page or update comments section
        } else {
            console.error('Failed to delete comment');
        }
    })
    .catch(error => console.error('Error deleting comment:', error));
}

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


function openModal() {
    document.getElementById('createPostModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('createPostModal').style.display = 'none';
}
