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
$mealType = $mysqli->real_escape_string($_POST['mealType']);
$mealName = $mysqli->real_escape_string($_POST['mealName']);
$mealDescription = $mysqli->real_escape_string($_POST['mealDescription']);
$mealCalories = $mysqli->real_escape_string($_POST['mealCalories']);
$mealDuration = $mysqli->real_escape_string($_POST['mealDuration']);

$query = "INSERT INTO MEAL_PLAN (mealType, mealName, mealDescription, mealCalories, mealDuration, expertID) VALUES ('$mealType', '$mealName', '$mealDescription', '$mealCalories', '$mealDuration', '$expertID')";

if ($mysqli->query($query) === TRUE) {
    echo json_encode(['success' => true, 'message' => 'Meal plan created successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $query . '<br>' . $mysqli->error]);
}

$mysqli->close();
?>
