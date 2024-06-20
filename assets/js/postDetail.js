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
