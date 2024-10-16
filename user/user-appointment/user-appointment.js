document.addEventListener('DOMContentLoaded', function() {
    fetchExperts();
    fetchAppointments();

    document.getElementById('bookingForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const appointmentID = document.getElementById('appointmentID').value;
        if (appointmentID) {
            updateAppointment(appointmentID);
        } else {
            bookAppointment();
        }
    });

    document.getElementById('close-button').addEventListener('click', function() {
        hideFormAndReset();
    });
});

function fetchExperts() {
    fetch('retrieve-health-expert.php')
        .then(response => response.json())
        .then(experts => {
            const container = document.getElementById('healthExpertsList');
            container.innerHTML = '';
            experts.forEach(expert => {
                const div = document.createElement('div');
                let icon = '';


                if (expert.expertType === 'Physical Trainer') {
                    icon = '<i class="fas fa-dumbbell"></i>';
                    textColorClass = 'text-trainer';
                } else if (expert.expertType === 'Nutritionist') {
                    icon = '<i class="fas fa-apple-alt"></i>';
                    textColorClass = 'text-nutritionist';
                }

                div.innerHTML = `
                    <h3>${expert.expertName}</h3>
                    <h4 class="${textColorClass}">${icon} ${expert.expertType}</h4>
                    <p>${expert.expertQualification}</p>
                    <button class="book-button" onclick='selectExpert(${JSON.stringify(expert)})'><i class="fas fa-bookmark"></i></button>
                `;
                container.appendChild(div);
            });
        });
}

window.selectExpert = function selectExpert(expert) {
    document.getElementById('appointmentID').value = '';
    document.getElementById('expertName').textContent = expert.expertName;
    document.getElementById('expertEmail').textContent = expert.expertEmail;
    document.getElementById('expertTel').textContent = expert.expertTel;
    document.getElementById('expertBio').textContent = expert.expertBio;
    document.getElementById('appointmentForm').style.display = 'block';
};

function fetchAppointments() {
    fetch('retrieve-appointment.php', {
        cache: 'no-cache'
    })
    .then(response => response.json())
    .then(appointments => {
        const appointmentsTable = document.getElementById('appointmentsTable').getElementsByTagName('tbody')[0];
        appointmentsTable.innerHTML = '';

        if (appointments.length === 0) {

            appointmentsTable.innerHTML = '<tr><td colspan="6">No appointment booked.</td></tr>';
        } else {

            appointments.forEach(appointment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${appointment.expertName}</td>
                    <td>${appointment.appointmentDate}</td>
                    <td>${appointment.appointmentTime}</td>
                    <td class="details-column">${appointment.appointmentDetails}</td>
                    <td><button onclick="editAppointment(${appointment.appointmentID}, '${appointment.appointmentDetails}', '${appointment.appointmentDate}', '${appointment.appointmentTime}', '${appointment.expertName}', '${appointment.expertEmail}', '${appointment.expertTel}', '${appointment.expertBio}')" class="edit-button"><i class="fas fa-edit"></i></button></td>
                    <td><button onclick="deleteAppointment(${appointment.appointmentID})" class="delete-button"><i class="fas fa-trash"></i></button></td>
                `;
                appointmentsTable.appendChild(row);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching appointments:', error);

        const appointmentsTable = document.getElementById('appointmentsTable').getElementsByTagName('tbody')[0];
        appointmentsTable.innerHTML = '<tr><td colspan="6">Error fetching appointments. Please try again later.</td></tr>';
    });
}



function bookAppointment() {
    const details = document.getElementById('appointmentDetails').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const expertEmail = document.getElementById('expertEmail').textContent;

    fetch('create-appointment.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            expertEmail: expertEmail,
            details: details,
            date: date,
            time: time
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Appointment booked successfully!');
        } else {
            alert('Failed to book appointment: ' + result.error);
        }
        fetchExperts();
        fetchAppointments();
        hideFormAndReset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while booking the appointment.');
    });
}

function editAppointment(appointmentID, details, date, time, expertName, expertEmail, expertTel, expertBio) {

    document.getElementById('appointmentID').value = appointmentID;
    document.getElementById('appointmentDetails').value = details;
    document.getElementById('appointmentDate').value = date;
    document.getElementById('appointmentTime').value = time;
    document.getElementById('expertName').textContent = expertName;
    document.getElementById('expertEmail').textContent = expertEmail;
    document.getElementById('expertTel').textContent = expertTel;
    document.getElementById('expertBio').textContent = expertBio;
    document.getElementById('appointmentForm').style.display = 'block';
}

function updateAppointment(appointmentID) {
    const details = document.getElementById('appointmentDetails').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;

    fetch('update-appointment.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            appointmentID: appointmentID,
            details: details,
            date: date,
            time: time
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Appointment updated successfully!');
            fetchAppointments();
        } else {
            alert('Failed to update appointment: ' + result.error);
        }
        hideFormAndReset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the appointment.');
    });
}

function deleteAppointment(appointmentID) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        fetch('delete-appointment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                appointmentID: appointmentID
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Appointment deleted successfully!');
                fetchAppointments();
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

function hideFormAndReset() {
    document.getElementById('bookingForm').reset();
    document.getElementById('appointmentID').value = '';
    document.getElementById('expertName').textContent = '';
    document.getElementById('expertEmail').textContent = '';
    document.getElementById('expertTel').textContent = '';
    document.getElementById('expertBio').textContent = '';
    document.getElementById('appointmentForm').style.display = 'none';
}