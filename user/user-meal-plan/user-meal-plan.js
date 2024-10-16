document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const typeFilterBtn = document.getElementById('typeFilterBtn');

    searchInput.addEventListener('input', filterMealPlans);
    typeFilterBtn.addEventListener('click', filterMealPlansByType);

    fetchMealPlans();
    fetchUserMealPlans();

    function fetchMealPlans() {
        fetch('retrieve-meal-plan.php')
            .then(response => response.json())
            .then(data => {
                // Sort data array by mealName alphabetically
                data.sort((a, b) => a.mealName.localeCompare(b.mealName));

                const mealPlansTable = document.getElementById('mealPlansTable').getElementsByTagName('tbody')[0];
                mealPlansTable.innerHTML = ''; // Clear table
                data.forEach(plan => {
                    renderMealPlanRow(mealPlansTable, plan);
                });
            });
    }

    function fetchUserMealPlans() {
        fetch('retrieve-user-meal-plan.php')
            .then(response => response.json())
            .then(data => {
                // Sort data array by mealName alphabetically
                data.sort((a, b) => a.mealName.localeCompare(b.mealName));

                const userMealPlansTable = document.getElementById('userMealPlansTable').getElementsByTagName('tbody')[0];
                userMealPlansTable.innerHTML = ''; // Clear table

                if (data.length === 0) {
                    const noMealPlansRow = userMealPlansTable.insertRow();
                    const noMealPlansCell = noMealPlansRow.insertCell();
                    noMealPlansCell.colSpan = 7; // Span across all columns
                    noMealPlansCell.textContent = 'No meal plans added.';
                } else {
                    data.forEach(plan => {
                        renderUserMealPlanRow(userMealPlansTable, plan);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching user meal plans:', error);
                // Handle error fetching meal plans (e.g., display an error message)
                const userMealPlansTable = document.getElementById('userMealPlansTable').getElementsByTagName('tbody')[0];
                userMealPlansTable.innerHTML = '<tr><td colspan="7">Error fetching meal plans. Please try again later.</td></tr>';
            });
    }

    function renderMealPlanRow(table, plan) {
        const row = table.insertRow();
        row.insertCell(0).textContent = plan.mealType;
        row.insertCell(1).textContent = plan.mealName;
        row.insertCell(2).textContent = plan.mealDescription;
        row.insertCell(3).textContent = plan.mealCalories;
        row.insertCell(4).textContent = plan.mealDuration;
        const actionCell = row.insertCell(5);
        const addButton = document.createElement('button');
        addButton.className = 'add-button';
        addButton.innerHTML = '<i class="fas fa-plus"></i>'; // Use FontAwesome plus icon
        addButton.onclick = function() {
            createUserMealPlan(plan.mealID);
        };
        actionCell.appendChild(addButton);
    }

    function renderUserMealPlanRow(table, plan) {
        const row = table.insertRow();
        row.insertCell(0).textContent = plan.mealType;
        row.insertCell(1).textContent = plan.mealName;
        row.insertCell(2).textContent = plan.mealDescription;
        row.insertCell(3).textContent = plan.mealCalories;
        row.insertCell(4).textContent = plan.mealDuration;

        const statusCell = row.insertCell(5);
        const statusToggle = document.createElement('label');
        statusToggle.className = 'switch';
        const statusInput = document.createElement('input');
        statusInput.type = 'checkbox';
        statusInput.checked = plan.planStatus === 'on';
        statusInput.onchange = function() {
            updateUserMealPlan(plan.userID, plan.mealID, statusInput.checked ? 'on' : 'off');
        };
        const statusSlider = document.createElement('span');
        statusSlider.className = 'slider round';
        statusToggle.appendChild(statusInput);
        statusToggle.appendChild(statusSlider);
        statusCell.appendChild(statusToggle);

        const removeCell = row.insertCell(6);
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-button';
        removeButton.innerHTML = '<i class="fas fa-trash"></i>'; // Use FontAwesome bin icon
        removeButton.onclick = function() {
            deleteUserMealPlan(plan.userID, plan.mealID);
        };
        removeCell.appendChild(removeButton);
    }

    function createUserMealPlan(mealID) {
        fetch('create-user-meal-plan.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mealID: mealID })
        })
        .then(response => response.json())
        .then(() => {
            fetchUserMealPlans();
        });
    }

    function updateUserMealPlan(userID, mealID, newStatus) {
        fetch('update-user-meal-plan.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userID: userID, mealID: mealID, planStatus: newStatus })
        })
        .then(response => response.json())
        .then(() => {
            fetchUserMealPlans();
        });
    }

    function deleteUserMealPlan(userID, mealID) {
        fetch('delete-user-meal-plan.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userID: userID, mealID: mealID })
        })
        .then(response => response.json())
        .then(() => {
            fetchUserMealPlans();
        });
    }

    function filterMealPlans() {
        const filterValue = searchInput.value.trim().toUpperCase();
        const mealPlansTable = document.getElementById('mealPlansTable').getElementsByTagName('tbody')[0];
        let found = false;

        // Filter Available Meal Plans Table
        Array.from(mealPlansTable.rows).forEach(row => {
            const mealNameCell = row.cells[1];
            if (mealNameCell) {
                const mealNameText = mealNameCell.textContent.toUpperCase();
                if (mealNameText.indexOf(filterValue) > -1) {
                    row.style.display = '';
                    found = true;
                } else {
                    row.style.display = 'none';
                }
            }
        });

        // Display 'Meal not found' message if no matching meals
        if (!found && filterValue !== '') {
            mealPlansTable.innerHTML = '<tr><td colspan="6">Meal not found.</td></tr>';
        } else if (filterValue === '') {
            fetchMealPlans(); // Reload all meal plans
        }
    }

    function filterMealPlansByType() {
        const mealTypeInput = prompt(`ENTER MEAL TYPE:
    1 - Breakfast
    2 - Lunch
    3 - Dinner
    4 - Snack

    Enter 'R' to clear filters.`);

        if (mealTypeInput === null) {
            return; // If user cancels, do nothing
        }

        const mealType = mealTypeInput.trim();

        if (mealType === 'R') {
            searchInput.value = ''; // Reset search input
            fetchMealPlans(); // Reload all meal plans
            return;
        }

        const mealTypeText = getMealTypeText(mealType);
        if (!mealTypeText) {
            alert("Invalid meal type entered.");
            return;
        }

        const mealPlansTable = document.getElementById('mealPlansTable').getElementsByTagName('tbody')[0];
        mealPlansTable.innerHTML = ''; // Clear the table
        let found = false;

        fetch('retrieve-meal-plan.php')
            .then(response => response.json())
            .then(data => {
                // Sort data array by mealName alphabetically
                data.sort((a, b) => a.mealName.localeCompare(b.mealName));

                data.forEach(plan => {
                    if (plan.mealType === mealTypeText) {
                        renderMealPlanRow(mealPlansTable, plan);
                        found = true;
                    }
                });

                // Display 'Meal not found' message if no matching meals
                if (!found) {
                    mealPlansTable.innerHTML = '<tr><td colspan="6">Meal not found.</td></tr>';
                }
            });
    }

    function getMealTypeText(mealType) {
        switch (mealType) {
            case '1':
                return 'Breakfast';
            case '2':
                return 'Lunch';
            case '3':
                return 'Dinner';
            case '4':
                return 'Snack';
            default:
                return null;
        }
    }
});
