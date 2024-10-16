// health-expert-profile.js
document.addEventListener('DOMContentLoaded', function() {
    // Fetch and populate health expert data
    fetch('retrieve-profile.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById('name').value = data.expertName;
            document.getElementById('email').value = data.expertEmail;
            document.getElementById('dob').value = data.expertDOB;
            document.getElementById('tel').value = data.expertTel;
            document.getElementById('type').value = data.expertType;
            document.getElementById('qualification').value = data.expertQualification;
            document.getElementById('bio').value = data.expertBio;
        });
});
