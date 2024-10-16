document.addEventListener('DOMContentLoaded', function() {
    fetch('admin-user.php')
        .then(response => response.json())
        .then(data => {
            const userTableBody = document.querySelector('#userTable tbody');
            userTableBody.innerHTML = ''; // Clear existing content

            const bmiCategories = {
                'Underweight': 0,
                'Normal': 0,
                'Overweight': 0,
                'Obese': 0
            };

            data.forEach((user, index) => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.userName}</td>
                    <td>${user.userEmail}</td>
                    <td>${user.userTel}</td>
                    <td>${user.userDOB}</td>
                    <td>${user.userWeight}</td>
                    <td>${user.userHeight}</td>
                    <td>${user.userBMI}</td>
                    <td>${user.userTargetCalories}</td>
                `;

                userTableBody.appendChild(row);

                // Classify BMI
                const bmi = parseFloat(user.userBMI);
                if (bmi < 18.5) {
                    bmiCategories['Underweight']++;
                } else if (bmi >= 18.5 && bmi < 25) {
                    bmiCategories['Normal']++;
                } else if (bmi >= 25 && bmi < 30) {
                    bmiCategories['Overweight']++;
                } else if (bmi >= 30) {
                    bmiCategories['Obese']++;
                }
            });

            // Generate BMI bar chart
            generateBmiChart(bmiCategories);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            const userTableBody = document.querySelector('#userTable tbody');
            userTableBody.innerHTML = '<tr><td colspan="9">Error loading data</td></tr>';
        });

    function generateBmiChart(bmiCategories) {
        const bmiChartCanvas = document.getElementById('bmiChart').getContext('2d');
        const bmiChart = new Chart(bmiChartCanvas, {
            type: 'bar',
            data: {
                labels: Object.keys(bmiCategories),
                datasets: [{
                    data: Object.values(bmiCategories),
                    backgroundColor: [
                        'rgba(0, 183, 255, 0.8)', // Blue for Underweight
                        'rgba(67, 182, 71, 0.8)', // Green for Normal
                        'rgba(255, 191, 14, 0.8)', // Yellow for Overweight
                        'rgba(217, 83, 79, 0.8)' // Red for Obese
                    ],
                    borderColor: [
                        'rgba(0, 183, 255, 1)', // Blue for Underweight
                        'rgba(67, 182, 71, 1)', // Green for Normal
                        'rgba(255, 191, 14, 1)', // Yellow for Overweight
                        'rgba(217, 83, 79, 1)' // Red for Obese
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        stepSize: 1,
                        min: 0,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: label,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                strokeStyle: data.datasets[0].borderColor[i],
                                lineWidth: 1,
                            }));
                        }
                    }
                }
            }
        });
    }
});
