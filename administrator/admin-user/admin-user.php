<?php
session_start();

// Check if admin is logged in
if (!isset($_SESSION['adminID'])) {
    header('Location: ../login/login.html');
    exit();
}

// Connect to the database
$mysqli = new mysqli("localhost", "root", "", "nutriHealth");

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Fetch user details
$query = "SELECT userID, userName, userEmail, userTel, userDOB, userWeight, userHeight, userBMI, userTargetCalories FROM USER";
$result = $mysqli->query($query);

$users = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

// Return the data as JSON
header('Content-Type: application/json');
echo json_encode($users);

$mysqli->close();
?>
