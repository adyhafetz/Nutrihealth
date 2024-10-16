<?php
session_start();

if (!isset($_SESSION['adminID'])) {
    header('Location: http://localhost/dashboard/Test/login/login.html');
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

// Fetch total number of health experts
$healthExpertResult = $mysqli->query("SELECT COUNT(*) AS totalHealthExperts FROM HEALTH_EXPERT");
$healthExpertData = $healthExpertResult->fetch_assoc();
$totalHealthExperts = $healthExpertData['totalHealthExperts'];

// Return the data as JSON
header('Content-Type: application/json');
echo json_encode([
    'totalUsers' => $totalUsers,
    'totalHealthExperts' => $totalHealthExperts
]);

$mysqli->close();
?>
