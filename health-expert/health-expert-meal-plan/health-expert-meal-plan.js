document.addEventListener('DOMContentLoaded', function() {
    const mealForm = document.getElementById('mealForm');
    const submitButton = document.getElementById('submitButton');
    const mealPlansTable = document.getElementById('mealPlansTable').getElementsByTagName('tbody')[0];
    let isEditing = false;

    // Function to fetch and display meal plans
    function fetchMealPlans() {
        fetch('retrieve-meal-plan.php')
            .then(response => response.json())
            .then(data => {
                mealPlansTable.innerHTML = ''; // Clear table
                data.forEach(plan => {
                    const row = mealPlansTable.insertRow();
                    row.insertCell(0).textContent = plan.mealType;
                    row.insertCell(1).textContent = plan.mealName;
                    row.insertCell(2).textContent = plan.mealDescription;
                    row.insertCell(3).textContent = plan.mealCalories;
                    row.insertCell(4).textContent = plan.mealDuration;

                    const editCell = row.insertCell(5);
                    const editButton = document.createElement('button');
                    editButton.classList.add('edit-button');
                    editButton.innerHTML = '<i class="fas fa-edit"></i>';
                    editButton.addEventListener('click', function() {
                        editMealPlan(plan);
                    });
                    editCell.appendChild(editButton);

                    const deleteCell = row.insertCell(6);
                    const deleteButton = document.createElement('button');
                    deleteButton.classList.add('delete-button');
                    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                    deleteButton.addEventListener('click', function() {
                        deleteMealPlan(plan.mealID);
                    });
                    deleteCell.appendChild(deleteButton);
                });

            });
    }

    // Function to delete a meal plan
    function deleteMealPlan(mealID) {
        if (confirm("Are you sure you want to delete this meal plan?")) {
            fetch('delete-meal-plan.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'mealID=' + encodeURIComponent(mealID) // Ensure proper URL encoding
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Meal plan deleted successfully');
                    fetchMealPlans(); // Refresh the table
                } else {
                    alert('Failed to delete meal plan');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the meal plan.');
            });
        }
    }

    // Function to edit a meal plan
    function editMealPlan(plan) {
        document.getElementById('mealID').value = plan.mealID;
        document.getElementById('mealType').value = plan.mealType; // Assigning the plan's mealType to the select menu
        document.getElementById('mealName').value = plan.mealName;
        document.getElementById('mealDescription').value = plan.mealDescription;
        document.getElementById('mealCalories').value = plan.mealCalories;
        document.getElementById('mealDuration').value = plan.mealDuration;
        submitButton.textContent = '<i class="fas fa-utensils"></i>';
        isEditing = true;
    }

    // Handle form submission
    mealForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(mealForm);
        const url = isEditing ? 'update-meal-plan.php' : 'create-meal-plan.php';

        fetch(url, {
            method: 'POST',
            body: new URLSearchParams(formData)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Meal plan ' + (isEditing ? 'updated' : 'created') + ' successfully');
                fetchMealPlans();
                mealForm.reset();
                submitButton.innerHTML = '<i class="fas fa-utensils"></i>';
                isEditing = false;
            } else {
                alert('Failed to ' + (isEditing ? 'update' : 'create') + ' meal plan');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while ' + (isEditing ? 'updating' : 'creating') + ' the meal plan.');
        });
    });

    // Fetch and display meal plans when the page loads
    fetchMealPlans();
});
