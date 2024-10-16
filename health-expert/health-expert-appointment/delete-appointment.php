<?php
session_start();

// Check if expert is logged in
if (!isset($_SESSION['expertID'])) {
    header('Location: ../login/login.html');
    exit();
}

header('Content-Type: application/json');
$mysqli = new mysqli("localhost", "root", "", "nutriHealth");

// Check connection
if ($mysqli->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $mysqli->connect_error]);
    exit();
}

$expertID = $_SESSION['expertID'];

// Get the input data
$input = json_decode(file_get_contents('php://input'), true);
$appointmentID = $mysqli->real_escape_string($input['appointmentID']);

// Prepare and execute the delete query
$stmt = $mysqli->prepare("DELETE FROM APPOINTMENT WHERE appointmentID = ? AND expertID = ?");
$stmt->bind_param("ii", $appointmentID, $expertID);
$stmt->execute();

if ($stmt->error) {
    echo json_encode(['error' => $stmt->error]);
} else {
    echo json_encode(['success' => 'Appointment deleted successfully']);
}

$stmt->close();
$mysqli->close();
?>
