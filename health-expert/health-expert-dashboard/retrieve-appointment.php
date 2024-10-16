<?php
session_start();
if (!isset($_SESSION['expertID'])) {
    header('Location: http://localhost/dashboard/Test/login/login.html');
    exit();
}

// Connect to the database
$mysqli = new mysqli("localhost", "root", "", "nutriHealth");

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}
$expertID = $_SESSION['expertID']; // Assuming session holds the expert's ID

$query = "SELECT u.userName, a.appointmentDate, a.appointmentTime, a.appointmentDetails 
          FROM APPOINTMENT a 
          JOIN USER u ON a.userID = u.userID 
          WHERE a.expertID = ?
          ORDER BY a.appointmentDate DESC, a.appointmentTime DESC";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("i", $expertID);

$stmt->execute();
$result = $stmt->get_result();

$appointments = [];
while ($row = $result->fetch_assoc()) {
    $appointments[] = $row;
}

echo json_encode($appointments);

$stmt->close();
$mysqli->close();
?>
