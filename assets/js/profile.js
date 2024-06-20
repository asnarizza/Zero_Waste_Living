document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('userId')) {
        const userId = localStorage.getItem('userId');

        // Fetch user sharings
        fetch(`../../api/sharing.php?action=listByUserId&userId=${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.data) {
                    const sharings = data.data;
                    const container = document.getElementById('postGrid');
                    container.innerHTML = '';

                    sharings.forEach(sharing => {
                        const sharingItem = document.createElement('a');
                        sharingItem.href = 'postDetail.html?sharingId=' + sharing.sharingId;
                        sharingItem.className = 'post-item';

                        const imageSrc = `data:image/jpeg;base64,${sharing.image}`;
                        sharingItem.innerHTML = `
                            <img src="${imageSrc}" alt="${sharing.title}">
                            <p>${sharing.title}</p>
                        `;
                        container.appendChild(sharingItem);
                    });
                } else {
                    console.log('No sharings found.');
                }
            })
            .catch(error => {
                console.error('Error fetching sharing data:', error);
            });

        // Fetch user profile
        fetch(`../../api/auth/profile.php?userId=${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Get the response as JSON
            })
            .then(userData => {
                if (userData) {
                    console.log('Parsed user data:', userData); // Log the parsed user data
                    // Check if the expected properties are present
                    if (userData.name && userData.email) {
                        document.getElementById('name').textContent = userData.name;
                        document.getElementById('email').textContent = userData.email;
                        // Add CSS class to profileIconImage for styling
                        const profileIconImage = document.getElementById('profileIconImage');
                        profileIconImage.src = 'data:image/jpeg;base64,' + userData.image.replace(/\\\//g, '/'); // Replace escaped slashes
                        profileIconImage.classList.add('avatar-image'); // Add CSS class
                        // Add CSS class to profileHeaderImage for styling
                        const profileHeaderImage = document.getElementById('profileHeaderImage');
                        profileHeaderImage.src = 'data:image/jpeg;base64,' + userData.image.replace(/\\\//g, '/'); // Replace escaped slashes
                        profileHeaderImage.classList.add('avatar-image'); // Add CSS class
                    } else {
                        console.error('Expected properties not found in user data');
                    }
                } else {
                    console.log('User data not found.');
                }
            })
            .catch(error => {
                console.error('Error fetching user profile data:', error);
            });

    } else {
        console.log('userId not found in local storage.');
    }
});
