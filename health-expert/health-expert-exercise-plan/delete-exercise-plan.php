<?php
session_start();

// Check if expert is logged in
if (!isset($_SESSION['expertID'])) {
    header('Location: ../login/login.html');
    exit();
}

// Set header for JSON response
header('Content-Type: application/json');

// Connect to the database
$mysqli = new mysqli("localhost", "root", "", "nutriHealth");

// Check connection
if ($mysqli->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $mysqli->connect_error]);
    exit();
}

// Retrieve exercise plan ID from POST
$exerciseID = $_POST['exerciseID'];

// Prepare and execute the delete query
$stmt = $mysqli->prepare("DELETE FROM EXERCISE_PLAN WHERE exerciseID = ?");
$stmt->bind_param("i", $exerciseID);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => 'Exercise plan deleted successfully']);
} else {
    echo json_encode(['error' => 'Failed to delete exercise plan']);
}

$stmt->close();
$mysqli->close();
?>
