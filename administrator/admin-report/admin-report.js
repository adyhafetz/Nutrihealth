document.addEventListener('DOMContentLoaded', function() {
    let originalUserTableRows = [];
    let originalHealthExpertTableRows = [];

    fetch('admin-report.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalUsers').textContent = data.totalUsers;
            document.getElementById('totalHealthExperts').textContent = data.totalHealthExperts;

            const userTableBody = document.querySelector('#userTable tbody');
            const healthExpertTableBody = document.querySelector('#healthExpertTable tbody');

            // Populate user table
            data.users.forEach((user, index) => {
                const row = createUserTableRow(user, index);
                userTableBody.appendChild(row);
                originalUserTableRows.push(row.cloneNode(true));
            });

            // Populate health expert table
            data.healthExperts.forEach((expert, index) => {
                const row = createHealthExpertTableRow(expert, index);
                healthExpertTableBody.appendChild(row);
                originalHealthExpertTableRows.push(row.cloneNode(true));
            });

            function createUserTableRow(user, index) {
                const row = document.createElement('tr');
                const bmiStatus = getBMIStatus(user.userBMI);

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.userName}</td>
                    <td>${user.userEmail}</td>
                    <td>${user.userTel}</td>
                    <td>${user.userDOB}</td>
                    <td>${user.userBMI}</td>
                    <td>${bmiStatus}</td>
                `;
                return row;
            }

            function createHealthExpertTableRow(expert, index) {
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
                return row;
            }

            function getBMIStatus(bmi) {
                if (bmi < 18.5) {
                    return 'Underweight';
                } else if (bmi >= 18.5 && bmi < 25) {
                    return 'Normal Weight';
                } else if (bmi >= 25 && bmi < 30) {
                    return 'Overweight';
                } else if (bmi >= 30){
                    return 'Obese';
                }
            }

            // Reset function for both user and health expert tables
            function resetTable(tableBody, originalRows) {
                tableBody.innerHTML = '';
                originalRows.forEach(row => tableBody.appendChild(row.cloneNode(true)));
            }

            // Store original rows immediately after populating
            const originalUserRows = Array.from(userTableBody.children);
            const originalExpertRows = Array.from(healthExpertTableBody.children);

            // Search functionality for users
            document.getElementById('userSearch').addEventListener('input', function() {
                const searchValue = this.value.toLowerCase().trim();
                if (searchValue === '') {
                    resetTable(userTableBody, originalUserRows);
                } else {
                    searchTable(userTableBody, searchValue, 1, originalUserTableRows, 'No user found.');
                }
            });

            // Filter functionality for users by BMI
            document.getElementById('userFilterBtn').addEventListener('click', function() {
                const filterCode = prompt(`ENTER BMI STATUS:
        1 - Underweight
        2 - Normal Weight
        3 - Overweight
        4 - Obese

        Enter 'R' to clear filters.`);

            let bmiCategory = '';

                if (filterCode === 'R') {
                    document.getElementById('userSearch').value = ''; // Reset search input
                    resetTable(userTableBody, originalUserRows);
                    return;
                }

                switch(filterCode) {
                    case '1':
                        bmiCategory = 'Underweight';
                        break;
                    case '2':
                        bmiCategory = 'Normal Weight';
                        break;
                    case '3':
                        bmiCategory = 'Overweight';
                        break;
                    case '4':
                        bmiCategory = 'Obese';
                        break;
                    default:
                        alert('Invalid BMI code');
                        return;
                }

                filterTableByBMI(userTableBody, bmiCategory, originalUserTableRows, 'No user found.');
            });

            // Search functionality for health experts
            document.getElementById('expertFilterBtn').addEventListener('click', function() {
                const filterCode = prompt(`ENTER HEALTH EXPERT TYPE:
        1 - Nutritionist
        2 - Physical Trainer

        Enter 'R' to clear filters.`);

                let expertType = '';

                if (filterCode === 'R') {
                    document.getElementById('expertSearch').value = ''; // Reset search input
                    resetTable(healthExpertTableBody, originalExpertRows);
                    return;
                }

                switch(filterCode) {
                    case '1':
                        expertType = 'Nutritionist';
                        break;
                    case '2':
                        expertType = 'Physical Trainer';
                        break;
                    default:
                        alert('Invalid expert type code');
                        return;
                }

                filterTableByType(healthExpertTableBody, expertType, originalHealthExpertTableRows, 'No Health Expert found.');
            });

            // Function to filter a table by BMI
            function filterTableByBMI(tableBody, filterValue, originalRows, notFoundMessage) {
                tableBody.innerHTML = '';

                let found = false;
                originalRows.forEach(row => {
                    const bmiValue = parseFloat(row.cells[5].textContent); // Assuming BMI value is in the 5th cell
                    const bmiStatus = getBMIStatus(bmiValue);
                    if (bmiStatus === filterValue) {
                        tableBody.appendChild(row.cloneNode(true));
                        found = true;
                    }
                });

                if (!found) {
                    tableBody.innerHTML = `<tr><td colspan="7">${notFoundMessage}</td></tr>`;
                }
            }




            // Function to filter a table by type
            function filterTableByType(tableBody, filterValue, originalRows, notFoundMessage) {
                tableBody.innerHTML = '';

                let found = false;
                originalRows.forEach(row => {
                    const expertType = row.cells[5].textContent.toLowerCase(); // Assuming expert type is in the 5th cell
                    if (expertType.includes(filterValue.toLowerCase())) {
                        tableBody.appendChild(row.cloneNode(true));
                        found = true;
                    }
                });

                if (!found) {
                    tableBody.innerHTML = `<tr><td colspan="7">${notFoundMessage}</td></tr>`;
                }
            }
        })
        .catch(error => {
            console.error('Error fetching report data:', error);
            document.getElementById('totalUsers').textContent = 'Error loading data';
            document.getElementById('totalHealthExperts').textContent = 'Error loading data';
        });

    // General function to search a table
    function searchTable(tableBody, searchValue, columnIndex, originalRows, notFoundMessage) {
        tableBody.innerHTML = '';

        let found = false;
        originalRows.forEach(row => {
            const cellValue = row.cells[columnIndex].textContent.toLowerCase();
            if (cellValue.includes(searchValue)) {
                tableBody.appendChild(row.cloneNode(true));
                found = true;
            }
        });

        if (!found && searchValue !== '') {
            tableBody.innerHTML = `<tr><td colspan="${originalRows[0].cells.length}">${notFoundMessage}</td></tr>`;
        }

        if (searchValue === '') {
            resetTable(tableBody, originalRows);
        }
    }
});
