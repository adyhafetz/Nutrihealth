document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const typeFilterBtn = document.getElementById('typeFilterBtn');

    searchInput.addEventListener('input', filterExercisePlans);
    typeFilterBtn.addEventListener('click', filterExercisePlansByType);

    fetchExercisePlans();
    fetchUserExercisePlans();

    function fetchExercisePlans() {
        fetch('retrieve-exercise-plan.php')
            .then(response => response.json())
            .then(data => {
                // Sort data array by ExerciseName alphabetically
                data.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName));

                const exercisePlansTable = document.getElementById('exercisePlansTable').getElementsByTagName('tbody')[0];
                exercisePlansTable.innerHTML = ''; // Clear table
                data.forEach(plan => {
                    renderExercisePlanRow(exercisePlansTable, plan);
                });
            });
    }

    function fetchUserExercisePlans() {
        fetch('retrieve-user-exercise-plan.php')
            .then(response => response.json())
            .then(data => {
                // Sort data array by ExerciseName alphabetically
                data.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName));

                const userExercisePlansTable = document.getElementById('userExercisePlansTable').getElementsByTagName('tbody')[0];
                userExercisePlansTable.innerHTML = ''; // Clear table

                if (data.length === 0) {
                    const noExercisePlansRow = userExercisePlansTable.insertRow();
                    const noExercisePlansCell = noExercisePlansRow.insertCell();
                    noExercisePlansCell.colSpan = 7; // Span across all columns
                    noExercisePlansCell.textContent = 'No exercise plans added.';
                } else {
                    data.forEach(plan => {
                        renderUserExercisePlanRow(userExercisePlansTable, plan);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching user Exercise plans:', error);
                // Handle error fetching Exercise plans (e.g., display an error message)
                const userExercisePlansTable = document.getElementById('userExercisePlansTable').getElementsByTagName('tbody')[0];
                userExercisePlansTable.innerHTML = '<tr><td colspan="7">Error fetching exercise plans. Please try again later.</td></tr>';
            });
    }

    function renderExercisePlanRow(table, plan) {
        const row = table.insertRow();
        row.insertCell(0).textContent = plan.exerciseType;
        row.insertCell(1).textContent = plan.exerciseName;
        row.insertCell(2).textContent = plan.exerciseDescription;
        row.insertCell(3).textContent = plan.exerciseCalories;
        row.insertCell(4).textContent = plan.exerciseDuration;
        const actionCell = row.insertCell(5);
        const addButton = document.createElement('button');
        addButton.className = 'add-button';
        addButton.innerHTML = '<i class="fas fa-plus"></i>'; // Use FontAwesome plus icon
        addButton.onclick = function() {
            createUserExercisePlan(plan.exerciseID);
        };
        actionCell.appendChild(addButton);
    }

    function renderUserExercisePlanRow(table, plan) {
        const row = table.insertRow();
        row.insertCell(0).textContent = plan.exerciseType;
        row.insertCell(1).textContent = plan.exerciseName;
        row.insertCell(2).textContent = plan.exerciseDescription;
        row.insertCell(3).textContent = plan.exerciseCalories;
        row.insertCell(4).textContent = plan.exerciseDuration;

        const statusCell = row.insertCell(5);
        const statusToggle = document.createElement('label');
        statusToggle.className = 'switch';
        const statusInput = document.createElement('input');
        statusInput.type = 'checkbox';
        statusInput.checked = plan.planStatus === 'on';
        statusInput.onchange = function() {
            updateUserExercisePlan(plan.userID, plan.exerciseID, statusInput.checked ? 'on' : 'off');
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
            deleteUserExercisePlan(plan.userID, plan.exerciseID);
        };
        removeCell.appendChild(removeButton);
    }

    function createUserExercisePlan(exerciseID) {
        fetch('create-user-exercise-plan.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ exerciseID: exerciseID })
        })
        .then(response => response.json())
        .then(() => {
            fetchUserExercisePlans();
        });
    }

    function updateUserExercisePlan(userID, exerciseID, newStatus) {
        fetch('update-user-exercise-plan.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userID: userID, exerciseID: exerciseID, planStatus: newStatus })
        })
        .then(response => response.json())
        .then(() => {
            fetchUserExercisePlans();
        });
    }

    function deleteUserExercisePlan(userID, exerciseID) {
        fetch('delete-user-exercise-plan.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userID: userID, exerciseID: exerciseID })
        })
        .then(response => response.json())
        .then(() => {
            fetchUserExercisePlans();
        });
    }

    function filterExercisePlans() {
        const filterValue = searchInput.value.trim().toUpperCase();
        const exercisePlansTable = document.getElementById('exercisePlansTable').getElementsByTagName('tbody')[0];
        let found = false;

        // Filter Available Exercise Plans Table
        Array.from(exercisePlansTable.rows).forEach(row => {
            const exerciseNameCell = row.cells[1];
            if (exerciseNameCell) {
                const exerciseNameText = exerciseNameCell.textContent.toUpperCase();
                if (exerciseNameText.indexOf(filterValue) > -1) {
                    row.style.display = '';
                    found = true;
                } else {
                    row.style.display = 'none';
                }
            }
        });

        // Display 'Exercise not found' message if no matching Exercises
        if (!found && filterValue !== '') {
            exercisePlansTable.innerHTML = '<tr><td colspan="6">Exercise not found.</td></tr>';
        } else if (filterValue === '') {
            fetchExercisePlans(); // Reload all exercise plans
        }
    }

    function filterExercisePlansByType() {
        const exerciseTypeInput = prompt(`Enter exercise type:
1 - Endurance
2 - Strength
3 - Balance
4 - Flexibility

Enter 'R' to clear filters.`);

        if (exerciseTypeInput === null) {
            return; // If user cancels, do nothing
        }

        const exerciseType = exerciseTypeInput.trim();

        if (exerciseType === 'R') {
            searchInput.value = ''; // Reset search input
            fetchExercisePlans(); // Reload all exercise plans
            return;
        }

        const exerciseTypeText = getExerciseTypeText(exerciseType);
        if (!exerciseTypeText) {
            alert("Invalid exercise type entered.");
            return;
        }

        const exercisePlansTable = document.getElementById('exercisePlansTable').getElementsByTagName('tbody')[0];
        exercisePlansTable.innerHTML = ''; // Clear the table
        let found = false;

        fetch('retrieve-exercise-plan.php')
            .then(response => response.json())
            .then(data => {
                // Sort data array by exerciseName alphabetically
                data.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName));

                data.forEach(plan => {
                    if (plan.exerciseType === exerciseTypeText) {
                        renderExercisePlanRow(exercisePlansTable, plan);
                        found = true;
                    }
                });

                // Display 'Exercise not found' message if no matching exercises
                if (!found) {
                    exercisePlansTable.innerHTML = '<tr><td colspan="6">Exercise not found.</td></tr>';
                }
            });
    }

    function getExerciseTypeText(exerciseType) {
        switch (exerciseType) {
            case '1':
                return 'Endurance';
            case '2':
                return 'Strength';
            case '3':
                return 'Balance';
            case '4':
                return 'Flexibility';
            default:
                return null;
        }
    }
});
