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

// Fetch health expert details
$query = "SELECT expertID, expertName, expertEmail, expertTel, expertDOB, expertType, expertQualification FROM HEALTH_EXPERT";
$result = $mysqli->query($query);

$healthExperts = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $healthExperts[] = $row;
    }
}

// Return the data as JSON
header('Content-Type: application/json');
echo json_encode($healthExperts);

$mysqli->close();
?>
