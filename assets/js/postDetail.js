document.addEventListener('DOMContentLoaded', () => {
    // Extract sharingId from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const sharingId = urlParams.get('sharingId');
    console.log("sharingId is: ", sharingId);

    if (!sharingId) {
        console.error('sharingId not found in query parameters.');
        return;
    }

    // Save sharingId in sessionStorage
    sessionStorage.setItem('sharingId', sharingId);

    // Function to fetch post details and populate the page
    function fetchAndPopulatePostDetails() {
        fetch(`../../api/sharing.php?action=listById&sharingId=${sharingId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.data) {
                    const post = data.data;
                    // Update post details on the page
                    document.getElementById('post-title').textContent = post.title;
                    document.getElementById('post-description').textContent = post.titleDescription;
                    document.getElementById('main-image').src = 'data:image/jpeg;base64,' + post.image;
                    console.log("categoryName is", post.categoryName);
                    
                    // Populate the edit modal with existing data
                    document.getElementById('title').value = post.title;
                    document.getElementById('description').value = post.titleDescription;

                    // Map category name to the select option value
                    const categorySelect = document.getElementById('category');
                    for (let i = 0; i < categorySelect.options.length; i++) {
                        if (categorySelect.options[i].text === post.categoryName) {
                            categorySelect.options[i].selected = true;
                            break;
                        }
                    }

                    // Display the fetched image in the modal
                    const imagePreview = document.getElementById('image-preview');
                    imagePreview.src = 'data:image/jpeg;base64,' + post.image;
                    imagePreview.style.display = 'block'; // Show the image preview element
                } else {
                    console.error('No data found for the given sharingId.');
                }
            })
            .catch(error => {
                console.error('Error fetching post details:', error);
            });
    }

    // Fetch post details and populate the page on DOMContentLoaded
    fetchAndPopulatePostDetails();

    // Edit button event listener
    document.getElementById('editButton').addEventListener('click', () => {
        // Open the edit modal and use sharingId from sessionStorage
        openModal();
    });

    // Save button event listener
    document.querySelector('.save-button').addEventListener('click', () => {
        // Update post details and close the modal
        updatePostDetails();
    });
});

// Function to fetch post details and populate the edit modal fields
function openModal() {
    // Retrieve sharingId from sessionStorage
    const sharingId = sessionStorage.getItem('sharingId');
    if (!sharingId) {
        console.error('sharingId not found in sessionStorage.');
        return;
    }

    const editModal = document.getElementById('editPostModal');
    editModal.style.display = 'flex';

    // Fetch post details and populate the edit modal fields
    fetch(`../../api/sharing.php?action=listById&sharingId=${sharingId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.data) {
                const post = data.data;
                // Populate edit modal fields with post details
                document.getElementById('title').value = post.title;
                document.getElementById('description').value = post.titleDescription;

                // Map category name to the select option value
                const categorySelect = document.getElementById('category');
                for (let i = 0; i < categorySelect.options.length; i++) {
                    if (categorySelect.options[i].text === post.categoryName) {
                        categorySelect.options[i].selected = true;
                        break;
                    }
                }

                // Display the fetched image in the modal
                const imagePreview = document.getElementById('image-preview');
                imagePreview.src = 'data:image/jpeg;base64,' + post.image;
                imagePreview.style.display = 'block'; // Show the image preview element
            } else {
                console.error('No data found for the given sharingId.');
            }
        })
        .catch(error => {
            console.error('Error fetching post details:', error);
        });
}

function updatePostDetails() {
    const sharingId = sessionStorage.getItem('sharingId');
    if (!sharingId) {
        console.error('sharingId not found in sessionStorage.');
        return;
    }

    const title = document.getElementById('title').value;
    const titleDescription = document.getElementById('description').value;
    const categoryId = document.getElementById('category').value;
    const imageInput = document.getElementById('image');
    let image;

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            image = e.target.result.split(',')[1]; // Get base64 string of the image
            sendUpdateRequest(sharingId, title, titleDescription, categoryId, image);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        image = document.getElementById('image-preview').src.split(',')[1]; // Use the existing image if no new image is uploaded
        sendUpdateRequest(sharingId, title, titleDescription, categoryId, image);
    }
}

function sendUpdateRequest(sharingId, title, titleDescription, categoryId, image) {
    const requestData = {
        title: title,
        titleDescription: titleDescription,
        categoryId: categoryId,
        image: image
    };

    fetch(`../../api/sharing.php?action=listById&sharingId=${sharingId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.message === "Updated successfully.") {
            // Update successful, redirect to profileMember.html
            window.location.href = '../member/profileMember.html';
        } else {
            console.error('Update failed:', data.error);
        }
    })
    .catch(error => {
        console.error('Error updating post details:', error);
    });
}

function deletePost() {
    const sharingId = getSharingIdFromURL(); // Adjust to get sharingId as needed

    if (!sharingId) {
        alert("Cannot delete post: sharingId not found.");
        return;
    }

    if (confirm("Are you sure you want to delete this post?")) {
        const url = `../../api/sharing.php?action=delete&sharingId=${sharingId}`;

        fetch(url, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message); // Alert success or error message

            // Redirect to profileMember.html after successful deletion
            window.location.href = '../member/profileMember.html'; // Adjust URL as needed
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete post.');
        });
    }
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


function getSharingIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('sharingId');
}
