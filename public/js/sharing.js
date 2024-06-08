document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "http://localhost/Zero_Waste_Living/api/sharing.php"; // Replace with your actual API endpoint

    async function fetchSharingData() {
        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.data) {
                displaySharingData(data.data);
            } else {
                console.error("No data found:", data.error);
            }
        } catch (error) {
            console.error("Failed to fetch sharing data:", error);
        }
    }

    function displaySharingData(sharingData) {
        const mainElement = document.querySelector("main");
        mainElement.innerHTML = ""; // Clear existing content

        sharingData.forEach(item => {
            const card = document.createElement("div");
            card.className = "card";
            card.addEventListener("click", () => {
                window.location.href = "detailPage.html";
            });

            const overlay = document.createElement("div");
            overlay.className = "overlay";

            const title = document.createElement("h2");
            title.textContent = item.title;
            overlay.appendChild(title);

            if (item.image) {
                const img = document.createElement("img");
                img.src = item.image;
                img.alt = item.title;
                overlay.appendChild(img);
            }

            const exploreLink = document.createElement("a");
            exploreLink.href = "detailPage.html";
            exploreLink.textContent = "Explore";
            overlay.appendChild(exploreLink);

            card.appendChild(overlay);
            mainElement.appendChild(card);
        });
    }

    fetchSharingData();
});
