document.addEventListener('DOMContentLoaded', function() {
    fetchAppointments();
});

function fetchAppointments() {
    fetch('retrieve-appointment.php')
    .then(response => response.json())
    .then(appointments => {
        const list = document.getElementById('appointmentsList');
        list.innerHTML = ''; // Clear the list before appending new items
        appointments.forEach(appointment => {
            // Calculate days until the appointment
            const today = new Date();
            const appointmentDate = new Date(appointment.appointmentDate);
            const daysUntilAppointment = Math.ceil((appointmentDate - today) / (1000 * 60 * 60 * 24));
            
            // Determine status and days remaining
            let status = '';
            let statusClass = '';
            let daysRemaining = '';
            if (daysUntilAppointment < 0) {
                status = 'Finished';
                statusClass = 'finished';
                daysRemaining = '0 days remaining';
            } else {
                status = 'Upcoming';
                statusClass = 'upcoming';
                daysRemaining = `${daysUntilAppointment} days remaining`;
            }

            // Create appointment div
            const div = document.createElement('div');
            div.innerHTML = `
                <h3 class="user-name">${appointment.userName}</h3>
                <p class="date-time">
                    <span class="date">Date: ${appointment.appointmentDate}</span>
                    <span class="time">Time: ${appointment.appointmentTime}</span>
                </p>
                <p class="days-remaining">${daysRemaining}</p>
                <p class="status ${statusClass}">Status: ${status}</p>
                <button class="info-button"><i class="fas fa-info-circle"></i></button>
            `;
            list.appendChild(div);

            // Add event listener for info button in each appointment div
            const infoButton = div.querySelector('.info-button');
            infoButton.addEventListener('click', function() {
                alert(`Appointment Details:\n${appointment.appointmentDetails}`);
            });
        });
    })
    .catch(error => console.error('Error:', error));
}

