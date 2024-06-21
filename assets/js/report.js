document.addEventListener('DOMContentLoaded', function() {
    const apiUrlSharings = 'http://localhost/Zero_Waste_Living/api/report.php?action=fetchSharings';
    const apiUrlUsers = 'http://localhost/Zero_Waste_Living/api/report.php?action=fetchUsers';

    const categoryNames = {
        1: 'Food Waste',
        2: 'Resource Conservation',
        3: 'Plastic and Packaging',
        4: 'Personal Care'
    };

    // Function to fetch and display sharings
    function fetchSharings() {
        fetch(apiUrlSharings)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error fetching sharings:', data.error);
                } else {
                    displaySharingsChart(data);
                    displaySharingTotal(data.length);
                }
            })
            .catch(error => console.error('Error fetching sharings:', error));
    }

    // Function to fetch and display users
    function fetchUsers() {
        fetch(apiUrlUsers)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error fetching users:', data.error);
                } else {
                    displayUsersChart(data);
                    displayUserTotal(data.length); 
                }
            })
            .catch(error => console.error('Error fetching users:', error));
    }

    // Function to display sharings chart
    function displaySharingsChart(sharings) {
        const ctx = document.getElementById('sharingsChart').getContext('2d');
        const categoryCounts = sharings.reduce((acc, sharing) => {
            acc[sharing.categoryId] = (acc[sharing.categoryId] || 0) + 1;
            return acc;
        }, {});

        const categoryLabels = Object.keys(categoryCounts).map(key => categoryNames[key]);

        const sharingsChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categoryLabels,
                datasets: [{
                    label: 'Sharings by Category',
                    data: Object.values(categoryCounts),
                    backgroundColor: ['#FFA500', '#228B22', '#FFA07A', '#32CD32'] // Orange and green colors
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    datalabels: {
                        formatter: (value, ctx) => {
                            let sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            let percentage = (value * 100 / sum).toFixed(2) + "%";
                            return percentage;
                        },
                        color: '#fff',
                    }
                }
            }
        });

        document.getElementById('downloadSharingsChart').addEventListener('click', () => {
            downloadChartAsPDF(sharingsChart, 'Sharings by Category');
        });
    }

    // Function to display users chart
    function displayUsersChart(users) {
        const ctx = document.getElementById('usersChart').getContext('2d');
        const genderCounts = users.reduce((acc, user) => {
            acc[user.gender] = (acc[user.gender] || 0) + 1;
            return acc;
        }, {});

        const genderLabels = Object.keys(genderCounts);
        const genderData = Object.values(genderCounts);

        const usersChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: genderLabels,
                datasets: [{
                    label: 'Users by Gender',
                    data: genderData,
                    backgroundColor: ['#FFA500', '#228B22'] // Orange and green colors
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    datalabels: {
                        formatter: (value, ctx) => {
                            let sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            let percentage = (value * 100 / sum).toFixed(2) + "%";
                            return percentage;
                        },
                        color: '#fff',
                    }
                }
            }
        });

        document.getElementById('downloadUsersChart').addEventListener('click', () => {
            downloadChartAsPDF(usersChart, 'Users by Gender');
        });
    }

    // Function to display total sharings
    function displaySharingTotal(total) {
        const sharingCountElement = document.getElementById('sharingCount');
        sharingCountElement.textContent = total;
    }

    // Function to display total users
    function displayUserTotal(total) {
        const userCountElement = document.getElementById('userCount');
        userCountElement.textContent = total;
    }

    // Function to download chart as PDF
    function downloadChartAsPDF(chart, title) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        pdf.text(title, 10, 10);
        const canvas = chart.canvas;
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 10, 20, 180, 160);
        pdf.save(`${title}.pdf`);
    }

    // Fetch data when the page is loaded
    fetchSharings();
    fetchUsers();
});
