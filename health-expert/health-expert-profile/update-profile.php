<?php
session_start();

// Check if health expert is logged in
if (!isset($_SESSION['expertID'])) {
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
$expertID = $_SESSION['expertID']; // Assume expertID is stored in session
$name = $mysqli->real_escape_string($_POST['name']);
$email = $mysqli->real_escape_string($_POST['email']);
$dob = $mysqli->real_escape_string($_POST['dob']);
$tel = $mysqli->real_escape_string($_POST['tel']);
$type = $mysqli->real_escape_string($_POST['type']);
$qualification = $mysqli->real_escape_string($_POST['qualification']);
$bio = $mysqli->real_escape_string($_POST['bio']);

$query = "UPDATE HEALTH_EXPERT SET expertName='$name', expertEmail='$email', expertDOB='$dob', expertTel='$tel', expertType='$type', expertQualification='$qualification', expertBio='$bio' WHERE expertID='$expertID'";

if ($mysqli->query($query) === TRUE) {
    echo "Profile updated successfully";
    header('Location: http://localhost/dashboard/Test/health-expert/health-expert-profile/health-expert-profile.html');
} else {
    echo "Error: " . $query . "<br>" . $mysqli->error;
}

$mysqli->close();
?>
