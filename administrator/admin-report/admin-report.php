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

// Fetch total number of users
$userResult = $mysqli->query("SELECT COUNT(*) AS totalUsers FROM USER");
$userData = $userResult->fetch_assoc();
$totalUsers = $userData['totalUsers'];

// Fetch user details
$userDetailsResult = $mysqli->query("SELECT userName, userEmail, userTel, userDOB, userBMI FROM USER");
$users = [];
if ($userDetailsResult->num_rows > 0) {
    while($row = $userDetailsResult->fetch_assoc()) {
        $users[] = $row;
    }
}

// Fetch total number of health experts
$healthExpertResult = $mysqli->query("SELECT COUNT(*) AS totalHealthExperts FROM HEALTH_EXPERT");
$healthExpertData = $healthExpertResult->fetch_assoc();
$totalHealthExperts = $healthExpertData['totalHealthExperts'];

// Fetch health expert details
$healthExpertDetailsResult = $mysqli->query("SELECT expertName, expertEmail, expertTel, expertDOB, expertType, expertQualification FROM HEALTH_EXPERT");
$healthExperts = [];
if ($healthExpertDetailsResult->num_rows > 0) {
    while($row = $healthExpertDetailsResult->fetch_assoc()) {
        $healthExperts[] = $row;
    }
}

// Return the data as JSON
header('Content-Type: application/json');
echo json_encode([
    'totalUsers' => $totalUsers,
    'users' => $users,
    'totalHealthExperts' => $totalHealthExperts,
    'healthExperts' => $healthExperts
]);

$mysqli->close();
?>
