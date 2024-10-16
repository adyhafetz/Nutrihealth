<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['expertID'])) {
    header('Location: ../login/login.html');
    exit();
}

header('Content-Type: application/json');
$mysqli = new mysqli("localhost", "root", "", "nutriHealth");

// Check database connection
if ($mysqli->connect_error) {
    echo json_encode(['error' => 'Database connection failed: ' . $mysqli->connect_error]);
    exit();
}

$expertID = $_SESSION['expertID'];

// Query to retrieve appointments
$query = "SELECT a.appointmentID, a.appointmentDate, a.appointmentTime, a.appointmentDetails, u.userName FROM APPOINTMENT a JOIN USER U ON a.userID = u.userID WHERE a.expertID = ?";
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
