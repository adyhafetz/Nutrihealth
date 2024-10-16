<?php
session_start();

// Check if admin is logged in
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

// Retrieve data from POST
$adminID = $_SESSION['adminID']; // Assume adminID is stored in session
$name = $mysqli->real_escape_string($_POST['name']);
$email = $mysqli->real_escape_string($_POST['email']);
$dob = $mysqli->real_escape_string($_POST['dob']);
$tel = $mysqli->real_escape_string($_POST['tel']);

$query = "UPDATE ADMINISTRATOR SET adminName='$name', adminEmail='$email', adminDOB='$dob', adminTel='$tel' WHERE adminID='$adminID'";

if ($mysqli->query($query) === TRUE) {
    echo "Profile updated successfully";
    header('Location: http://localhost/dashboard/Test/administrator/admin-profile/admin-profile.html');
} else {
    echo "Error: " . $query . "<br>" . $mysqli->error;
}

$mysqli->close();
?>
