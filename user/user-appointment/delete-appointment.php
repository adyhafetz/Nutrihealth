<?php
session_start();

if (!isset($_SESSION['userID'])) {
    header('Location: ../login/login.html');
    exit();
}

header('Content-Type: application/json');

$mysqli = new mysqli("localhost", "root", "", "nutriHealth");

if ($mysqli->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $mysqli->connect_error]);
    exit();
}

$userID = $_SESSION['userID'];

$input = json_decode(file_get_contents('php://input'), true);
$appointmentID = $mysqli->real_escape_string($input['appointmentID']);

$stmt = $mysqli->prepare("DELETE FROM APPOINTMENT WHERE appointmentID = ? AND userID = ?");
$stmt->bind_param("ii", $appointmentID, $userID);
$stmt->execute();

if ($stmt->error) {
    echo json_encode(['error' => $stmt->error]);
} else {
    echo json_encode(['success' => 'Appointment deleted successfully']);
}

$stmt->close();
$mysqli->close();
?>