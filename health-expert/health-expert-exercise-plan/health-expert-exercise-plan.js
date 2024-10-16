document.addEventListener('DOMContentLoaded', function() {
    const exerciseForm = document.getElementById('exerciseForm');
    const submitButton = document.getElementById('submitButton');
    const exercisePlansTable = document.getElementById('exercisePlansTable').getElementsByTagName('tbody')[0];
    let isEditing = false;

    // Function to fetch and display exercise plans
    function fetchExercisePlans() {
        fetch('retrieve-exercise-plan.php')
            .then(response => response.json())
            .then(data => {
                exercisePlansTable.innerHTML = ''; // Clear table
                data.forEach(plan => {
                    const row = exercisePlansTable.insertRow();
                    row.insertCell(0).textContent = plan.exerciseType;
                    row.insertCell(1).textContent = plan.exerciseName;
                    row.insertCell(2).textContent = plan.exerciseDescription;
                    row.insertCell(3).textContent = plan.exerciseCalories;
                    row.insertCell(4).textContent = plan.exerciseDuration;

                    const editCell = row.insertCell(5);
                    const editButton = document.createElement('button');
                    editButton.classList.add('edit-button');
                    editButton.innerHTML = '<i class="fas fa-edit"></i>';
                    editButton.addEventListener('click', function() {
                        editExercisePlan(plan);
                    });
                    editCell.appendChild(editButton);

                    const deleteCell = row.insertCell(6);
                    const deleteButton = document.createElement('button');
                    deleteButton.classList.add('delete-button');
                    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                    deleteButton.addEventListener('click', function() {
                        deleteExercisePlan(plan.exerciseID);
                    });
                    deleteCell.appendChild(deleteButton);
                });
            });
    }

    // Function to delete an exercise plan
    function deleteExercisePlan(exerciseID) {
        if (confirm("Are you sure you want to delete this exercise plan?")) {
            fetch('delete-exercise-plan.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'exerciseID=' + encodeURIComponent(exerciseID)  // Ensure proper URL encoding
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Exercise plan deleted successfully');
                    fetchExercisePlans(); // Refresh the table
                } else {
                    alert('Failed to delete exercise plan');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the exercise plan.');
            });
        }
    }

    // Function to edit an exercise plan
    function editExercisePlan(plan) {
        document.getElementById('exerciseID').value = plan.exerciseID;
        document.getElementById('exerciseType').value = plan.exerciseType;
        document.getElementById('exerciseName').value = plan.exerciseName;
        document.getElementById('exerciseDescription').value = plan.exerciseDescription;
        document.getElementById('exerciseCalories').value = plan.exerciseCalories;
        document.getElementById('exerciseDuration').value = plan.exerciseDuration;
        submitButton.textContent = '<i class="fas fa-fire"></i>';
        isEditing = true;
    }

    // Handle form submission
    exerciseForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        const formData = new FormData(exerciseForm);
        const url = isEditing ? 'update-exercise-plan.php' : 'create-exercise-plan.php';

        fetch(url, {
            method: 'POST',
            body: new URLSearchParams(formData)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Exercise plan ' + (isEditing ? 'updated' : 'created') + ' successfully');
                fetchExercisePlans();
                exerciseForm.reset();
                submitButton.innerHTML = '<i class="fas fa-fire"></i>'; // Restore button text and icon
                isEditing = false;
            } else {
                alert('Failed to ' + (isEditing ? 'update' : 'create') + ' exercise plan');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while ' + (isEditing ? 'updating' : 'creating') + ' the exercise plan.');
        });
    });


    // Fetch and display exercise plans when the page loads
    fetchExercisePlans();
});