<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['userID'])) {
    header('Location: ../login/login.html');
    exit();
}

// Connect to the database
$mysqli = new mysqli("localhost", "root", "", "nutriHealth");

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Get user info
$userID = $_SESSION['userID'];
$query = "SELECT userName, userEmail, userDOB, userTel, userBio, userWeight, userHeight, userTargetCalories FROM USER WHERE userID='$userID'";
$result = $mysqli->query($query);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    header('Content-Type: application/json');
    echo json_encode($user);
} else {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'User not found']);
}

$mysqli->close();
?>
