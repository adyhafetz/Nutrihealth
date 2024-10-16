document.addEventListener('DOMContentLoaded', function() {
    fetch('admin-health-expert.php')
        .then(response => response.json())
        .then(data => {
            // Populate the table as before
            const healthExpertTableBody = document.querySelector('#healthExpertTable tbody');
            healthExpertTableBody.innerHTML = ''; // Clear existing content

            data.forEach((expert, index) => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${expert.expertName}</td>
                    <td>${expert.expertEmail}</td>
                    <td>${expert.expertTel}</td>
                    <td>${expert.expertDOB}</td>
                    <td>${expert.expertType}</td>
                    <td>${expert.expertQualification}</td>
                `;

                healthExpertTableBody.appendChild(row);
            });

            // Generate pie chart
            generatePieChart(data);
        })
        .catch(error => {
            console.error('Error fetching health expert data:', error);
            const healthExpertTableBody = document.querySelector('#healthExpertTable tbody');
            healthExpertTableBody.innerHTML = '<tr><td colspan="6">Error loading data</td></tr>';
        });

    function generatePieChart(data) {
        const expertTypes = {
            'Nutritionist': 0,
            'Physical Trainer': 0
        };

        data.forEach(expert => {
            if (expert.expertType === 'Nutritionist') {
                expertTypes['Nutritionist']++;
            } else if (expert.expertType === 'Physical Trainer') {
                expertTypes['Physical Trainer']++;
            }
        });

        const expertTypeChartCanvas = document.getElementById('expertTypeChart').getContext('2d');
        const expertTypeChart = new Chart(expertTypeChartCanvas, {
            type: 'pie',
            data: {
                labels: ['Nutritionist', 'Physical Trainer'], // Ensure labels are in desired order
                datasets: [{
                    label: 'Health Expert Types',
                    data: [expertTypes['Nutritionist'], expertTypes['Physical Trainer']], // Match order with labels
                    backgroundColor: [
                        'rgba(67, 182, 71, 0.8)', // Green for Nutritionist
                        'rgba(217, 83, 79, 0.8)' // Red for Physical Trainer
                    ],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom'
                }
            }
        });
    }
});