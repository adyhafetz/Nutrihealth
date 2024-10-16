document.addEventListener('DOMContentLoaded', function() {
    let userTargetCalories = 0;
    let totalConsumedCalories = 0; // Track the total consumed calories
    let consumedExerciseCalories = 0; // Track the consumed exercise calories

    fetchUserTargetCalories(); // Fetch user's target calories first
    fetchUserMealPlans();
    fetchUserExercisePlans();
    fetchUserAppointments(); // Fetch user's appointments

    function fetchUserTargetCalories() {
        fetch('retrieve-user-target-calories.php')
            .then(response => response.json())
            .then(data => {
                userTargetCalories = data.userTargetCalories;
                updateCalories(userTargetCalories, userTargetCalories); // Initialize with target calories
            });
    }

    function fetchUserMealPlans() {
        fetch('retrieve-user-meal-plan.php')
            .then(response => response.json())
            .then(data => {
                const userMealPlansTable = document.getElementById('userMealPlansTable').getElementsByTagName('tbody')[0];
                userMealPlansTable.innerHTML = ''; // Clear table

                if (data.length === 0) {
                    // If no meal plans are fetched, display a message or handle accordingly
                    const noMealPlansRow = userMealPlansTable.insertRow();
                    const noMealPlansCell = noMealPlansRow.insertCell();
                    noMealPlansCell.colSpan = 3; // Span across all columns
                    noMealPlansCell.textContent = 'No active meal plans.';
                } else {
                    // Display meal plans
                    data.forEach((plan, index) => {
                        const row = userMealPlansTable.insertRow();
                        row.insertCell(0).textContent = plan.mealType;
                        row.insertCell(1).textContent = plan.mealName;
                        const doneCell = row.insertCell(2);

                        const doneButton = document.createElement('button');
                        doneButton.className = 'done-button';
                        doneButton.innerHTML = '<i class="fas fa-check"></i>'; // Use FontAwesome check-circle icon
                        doneButton.addEventListener('click', function() {
                            row.style.display = 'none'; // Hide the row when marked as done
                            updateProgress(plan, true); // Update progress based on plan type
                            const nextRow = row.nextElementSibling;
                            if (nextRow) {
                                nextRow.style.display = 'table-row';
                            }
                            checkAllPlansDone(); // Check if all plans are done
                        });
                        doneCell.appendChild(doneButton);

                        if (index !== 0) {
                            row.style.display = 'none'; // Hide all rows except the first one
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching meal plans:', error);
                // Handle error fetching meal plans (e.g., display an error message)
                const userMealPlansTable = document.getElementById('userMealPlansTable').getElementsByTagName('tbody')[0];
                userMealPlansTable.innerHTML = '<tr><td colspan="3">Error fetching meal plans. Please try again later.</td></tr>';
            });
    }


    function fetchUserExercisePlans() {
        fetch('retrieve-user-exercise-plan.php')
            .then(response => response.json())
            .then(data => {
                const userExercisePlansTable = document.getElementById('userExercisePlansTable').getElementsByTagName('tbody')[0];
                userExercisePlansTable.innerHTML = ''; // Clear table

                if (data.length === 0) {
                    // If no exercise plans are fetched, display a message or handle accordingly
                    const noExercisePlansRow = userExercisePlansTable.insertRow();
                    const noExercisePlansCell = noExercisePlansRow.insertCell();
                    noExercisePlansCell.colSpan = 3; // Span across all columns
                    noExercisePlansCell.textContent = 'No active exercise plans.';
                } else {
                    // Display exercise plans
                    data.forEach((plan, index) => {
                        const row = userExercisePlansTable.insertRow();
                        row.insertCell(0).textContent = plan.exerciseType;
                        row.insertCell(1).textContent = plan.exerciseName;
                        const doneCell = row.insertCell(2);

                        const doneButton = document.createElement('button');
                        doneButton.className = 'done-button';
                        doneButton.innerHTML = '<i class="fas fa-check"></i>'; // Use FontAwesome check-circle icon
                        doneButton.addEventListener('click', function() {
                            row.style.display = 'none'; // Hide the row when marked as done
                            updateProgress(plan, false); // Update progress based on plan type
                            const nextRow = row.nextElementSibling;
                            if (nextRow) {
                                nextRow.style.display = 'table-row';
                            }
                            checkAllPlansDone(); // Check if all plans are done
                        });
                        doneCell.appendChild(doneButton);

                        if (index !== 0) {
                            row.style.display = 'none'; // Hide all rows except the first one
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching exercise plans:', error);
                // Handle error fetching exercise plans (e.g., display an error message)
                const userExercisePlansTable = document.getElementById('userExercisePlansTable').getElementsByTagName('tbody')[0];
                userExercisePlansTable.innerHTML = '<tr><td colspan="3">Error fetching exercise plans. Please try again later.</td></tr>';
            });
    }

    function fetchUserAppointments() {
        fetch('retrieve-appointment.php')
            .then(response => response.json())
            .then(data => {
                const userAppointmentsTable = document.getElementById('userAppointmentsTable').getElementsByTagName('tbody')[0];
                userAppointmentsTable.innerHTML = ''; // Clear table

                if (data.length === 0) {
                    // If no appointments are fetched, display a message or handle accordingly
                    const noAppointmentsRow = userAppointmentsTable.insertRow();
                    const noAppointmentsCell = noAppointmentsRow.insertCell();
                    noAppointmentsCell.colSpan = 4; // Span across all columns
                    noAppointmentsCell.textContent = 'No latest appointment.';
                } else {
                    // Sort appointments by appointmentDate in ascending order
                    data.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));


                    // Display only the latest appointment
                    const latestAppointment = data[0];

                    const row = userAppointmentsTable.insertRow();
                    row.insertCell(0).textContent = latestAppointment.expertName;
                    row.insertCell(1).textContent = latestAppointment.appointmentDate;
                    row.insertCell(2).textContent = latestAppointment.appointmentTime;
                    const detailsCell = row.insertCell(3);

                    // Create info button with FontAwesome icon
                    const detailsButton = document.createElement('button');
                    detailsButton.className = 'info-button';
                    const icon = document.createElement('i');
                    icon.classList.add('fas', 'fa-info');
                    detailsButton.appendChild(icon);

                    detailsButton.addEventListener('click', function() {
                        alert(`Details: ${latestAppointment.appointmentDetails}`);
                    });
                    detailsCell.appendChild(detailsButton);
                }
            })
            .catch(error => {
                console.error('Error fetching appointments:', error);
                // Handle error fetching appointments (e.g., display an error message)
                const userAppointmentsTable = document.getElementById('userAppointmentsTable').getElementsByTagName('tbody')[0];
                userAppointmentsTable.innerHTML = '<tr><td colspan="4">Error fetching appointments. Please try again later.</td></tr>';
            });
    }




    function updateProgress(plan, isMeal) {
        if (isMeal) {
            totalConsumedCalories += Number(plan.mealCalories); // Increase total consumed calories by meal calories
        } else {
            consumedExerciseCalories += Number(plan.exerciseCalories); // Increase consumed exercise calories by exercise calories
        }

        // Ensure consumed exercise calories doesn't go below zero
        consumedExerciseCalories = Math.max(consumedExerciseCalories, 0);

        const remainingCalories = userTargetCalories - totalConsumedCalories + consumedExerciseCalories;

        if (remainingCalories > userTargetCalories) {
            document.getElementById('progress-fill').style.stroke = '#DC143C';
        } else {
            document.getElementById('progress-fill').style.stroke = '#43B647'; // Change back to green if within target
        }

        if (remainingCalories < 0) {
            document.getElementById('progress-fill').style.stroke = '#DC143C';
        }

        updateCalories(userTargetCalories, remainingCalories); // Update the progress bar and remaining calories
    }

    function updateCalories(target, remaining) {
        const remainingValue = document.getElementById('remaining-calories');
        const remainingLabel = document.getElementById('remaining');
        remainingValue.textContent = remaining;

        const progress = Math.min((target - remaining) / target, 1); // Calculate progress
        const circumference = 2 * Math.PI * 45; // Calculate the circumference of the circle (radius r = 45)
        const offset = circumference * (1 - progress);

        const progressFill = document.getElementById('progress-fill');
        progressFill.style.strokeDasharray = `${circumference}`;
        progressFill.style.strokeDashoffset = `${offset}`;

        if (remaining < 0) {
            // Change label to "Warning" if remaining calories are negative
            remainingLabel.textContent = 'Warning';
            remainingValue.textContent = '+' + Math.abs(remaining);
        } else {
            remainingLabel.textContent = 'Remaining';
        }
    }
});

function checkAllPlansDone() {
    const mealPlansRows = document.querySelectorAll('#userMealPlansTable tbody tr');
    const exercisePlansRows = document.querySelectorAll('#userExercisePlansTable tbody tr');

    const allMealPlansDone = Array.from(mealPlansRows).every(row => row.style.display === 'none');
    const allExercisePlansDone = Array.from(exercisePlansRows).every(row => row.style.display === 'none');

    if (allMealPlansDone) {
        const userMealPlansTable = document.getElementById('userMealPlansTable').getElementsByTagName('tbody')[0];
        userMealPlansTable.innerHTML = '<tr><td colspan="3">No active meal plans.</td></tr>';
    }

    if (allExercisePlansDone) {
        const userExercisePlansTable = document.getElementById('userExercisePlansTable').getElementsByTagName('tbody')[0];
        userExercisePlansTable.innerHTML = '<tr><td colspan="3">No active exercise plans.</td></tr>';
    }
}