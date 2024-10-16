<?php
session_start();

// Check if expert is logged in
if (!isset($_SESSION['expertID'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

// Connect to the database
$mysqli = new mysqli("localhost", "root", "", "nutriHealth");

// Check connection
if ($mysqli->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

// Retrieve data from POST
$expertID = $_SESSION['expertID'];
$exerciseType = $mysqli->real_escape_string($_POST['exerciseType']);
$exerciseName = $mysqli->real_escape_string($_POST['exerciseName']);
$exerciseDescription = $mysqli->real_escape_string($_POST['exerciseDescription']);
$exerciseCalories = $mysqli->real_escape_string($_POST['exerciseCalories']);
$exerciseDuration = $mysqli->real_escape_string($_POST['exerciseDuration']);

$query = "INSERT INTO EXERCISE_PLAN (exerciseType, exerciseName, exerciseDescription, exerciseCalories, exerciseDuration, expertID) VALUES ('$exerciseType', '$exerciseName', '$exerciseDescription', '$exerciseCalories', '$exerciseDuration', '$expertID')";

if ($mysqli->query($query) === TRUE) {
    echo json_encode(['success' => true, 'message' => 'Exercise plan created successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $query . '<br>' . $mysqli->error]);
}

$mysqli->close();
?>
