document.addEventListener('DOMContentLoaded', function() {
    fetch('retrieve-profile.php')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('name').value = data.userName || '';
            document.getElementById('email').value = data.userEmail || '';
            document.getElementById('dob').value = data.userDOB || '';
            document.getElementById('tel').value = data.userTel || '';
            document.getElementById('bio').value = data.userBio || '';
            document.getElementById('weight').value = data.userWeight ? Number(data.userWeight) : '';
            document.getElementById('height').value = data.userHeight ? Number(data.userHeight) : '';
            document.getElementById('targetCalories').value = data.userTargetCalories ? Number(data.userTargetCalories) : '';

            calculateBMI(); // Calculate BMI after data is loaded
        })
        .catch(error => console.error('Error fetching user data:', error));
});

function calculateBMI() {
    let weight = parseFloat(document.getElementById('weight').value);
    let height = parseFloat(document.getElementById('height').value) / 100; // Convert cm to meters
    if (weight > 0 && height > 0) {
        let bmi = weight / (height * height);
        let bmiDisplay = document.getElementById('bmi');
        bmiDisplay.textContent = 'BMI: ' + bmi.toFixed(2);

        // Set the BMI value in the hidden input field
        document.getElementById('bmi-input').value = bmi.toFixed(2);

        let bmiStatus = document.getElementById('bmi-status');
        // Define color and status based on BMI value
        if (bmi < 18.5) {
            bmiDisplay.style.color = '#00b7ff'; // Light red for underweight
            bmiStatus.textContent = 'Underweight';
        } else if (bmi >= 18.5 && bmi < 25) {
            bmiDisplay.style.color = '#43B647'; // Green for normal weight
            bmiStatus.textContent = 'Normal weight';
        } else if (bmi >= 25 && bmi < 30) {
            bmiDisplay.style.color = '#ffbf0e'; // Orange for overweight
            bmiStatus.textContent = 'Overweight';
        } else if (bmi >= 30){
            bmiDisplay.style.color = '#d9534f'; // Darker orange/red for obese
            bmiStatus.textContent = 'Obese';
        }
    } else {
        document.getElementById('bmi').textContent = 'BMI: N/A';
        document.getElementById('bmi').style.color = '#333'; // Default color
        document.getElementById('bmi-status').textContent = ''; // Clear status text
    }
}

document.getElementById('profileForm').addEventListener('submit', function(event) {
    calculateBMI(); // Ensure BMI is calculated before form submission
});


document.getElementById('profileForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    calculateBMI(); // Ensure BMI is calculated before form submission
    alert('Changes saved successfully!');
    this.submit(); // Submit the form programmatically
});