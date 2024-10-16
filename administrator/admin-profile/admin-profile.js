document.addEventListener('DOMContentLoaded', function() {
    // Fetch and populate admin data
    fetch('retrieve-profile.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById('name').value = data.adminName;
            document.getElementById('email').value = data.adminEmail;
            document.getElementById('dob').value = data.adminDOB;
            document.getElementById('tel').value = data.adminTel;
        });
});