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

// Retrieve meal plan ID from POST
$mealID = $_POST['mealID'];

// Prepare and execute the delete query
$stmt = $mysqli->prepare("DELETE FROM MEAL_PLAN WHERE mealID = ?");
$stmt->bind_param("i", $mealID);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => 'meal plan deleted successfully']);
} else {
    echo json_encode(['error' => 'Failed to delete meal plan']);
}

$stmt->close();
$mysqli->close();
?>
