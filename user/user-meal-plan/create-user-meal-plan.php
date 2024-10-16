<?php
session_start();

if (!isset($_SESSION['userID'])) {
    header('Location: ../login/login.html');
    exit();
}

$mysqli = new mysqli("localhost", "root", "", "nutriHealth");

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Retrieve userID from session
$userID = $_SESSION['userID'];

// Add user meal plan to database
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $mealID = $data['mealID'];
    $planStatus = 'on';

    $sql = "INSERT INTO USER_MEAL_PLAN (userID, mealID, planStatus) VALUES ('$userID', '$mealID', '$planStatus')";
    if ($mysqli->query($sql) === TRUE) {
        echo json_encode(['message' => 'Meal plan added successfully']);
    } else {
        echo json_encode(['message' => 'Error adding meal plan: ' . $mysqli->error]);
    }
}

$mysqli->close();
?>
