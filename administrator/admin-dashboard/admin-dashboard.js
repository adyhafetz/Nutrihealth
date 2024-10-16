document.addEventListener('DOMContentLoaded', function() {
    fetch('admin-dashboard.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalUsers').textContent = data.totalUsers;
            document.getElementById('totalHealthExperts').textContent = data.totalHealthExperts;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('totalUsers').textContent = 'Error loading data';
            document.getElementById('totalHealthExperts').textContent = 'Error loading data';
        });
});
