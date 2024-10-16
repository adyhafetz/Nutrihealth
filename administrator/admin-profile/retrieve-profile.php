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

// Get admin info
$adminID = $_SESSION['adminID'];
$query = "SELECT adminName, adminEmail, adminDOB, adminTel FROM ADMINISTRATOR WHERE adminID='$adminID'";
$result = $mysqli->query($query);

if ($result->num_rows > 0) {
    $admin = $result->fetch_assoc();
    header('Content-Type: application/json');
    echo json_encode($admin);
} else {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Admin not found']);
}

$mysqli->close();
?>
