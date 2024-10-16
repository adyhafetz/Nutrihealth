<?php
session_start();

// Check if health expert is logged in
if (!isset($_SESSION['expertID'])) {
    header('Location: ../login/login.html');
    exit();
}

// Connect to the database
$mysqli = new mysqli("localhost", "root", "", "nutriHealth");

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Get expert info
$expertID = $_SESSION['expertID'];
$query = "SELECT expertName, expertEmail, expertDOB, expertTel, expertType, expertQualification, expertBio FROM HEALTH_EXPERT WHERE expertID='$expertID'";
$result = $mysqli->query($query);

if ($result->num_rows > 0) {
    $expert = $result->fetch_assoc();
    header('Content-Type: application/json');
    echo json_encode($expert);
} else {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Health expert not found']);
}

$mysqli->close();
?>
