document.addEventListener('DOMContentLoaded', function() {
    fetchAppointments();
});

function fetchAppointments() {
    fetch('retrieve-appointment.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(appointments => {
            const container = document.getElementById('appointmentsList');
            let tableHTML = `
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th><span>User</span></th>
                            <th><span>Date</span></th>
                            <th><span>Time</span></th>
                            <th><span>Details</span></th>
                            <th><span>Cancel</span></th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            appointments.forEach(appointment => {
                tableHTML += `
                    <tr>
                        <td>${escapeHTML(appointment.userName)}</td>
                        <td>${appointment.appointmentDate}</td>
                        <td>${appointment.appointmentTime}</td>
                        <td><button onclick="showDetails('${escapeHTML(appointment.appointmentDetails)}')" class="info-button"><i class="fas fa-info"></i></button></td>
                        <td><button onclick="deleteAppointment(${appointment.appointmentID})" class="delete-button"><i class="fas fa-trash"></i></button></td>
                    </tr>
                `;
            });
            tableHTML += `
                    </tbody>
                </table>
            </div>
            `;
            container.innerHTML = tableHTML;
        })
        .catch(error => {
            console.error('Error fetching appointments:', error);
            alert('Failed to load appointments.');
        });
}

function deleteAppointment(appointmentID) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        fetch('delete-appointment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ appointmentID })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            if (result.success) {
                alert('Appointment deleted successfully!');
                fetchAppointments(); // Refresh the appointments list
            } else {
                alert('Failed to delete appointment: ' + result.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the appointment.');
        });
    }
}

function showDetails(details) {
    alert(details);
}

function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
