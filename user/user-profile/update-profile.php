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

// Retrieve data from POST
$userID = $_SESSION['userID'];
$name = $mysqli->real_escape_string($_POST['name']);
$email = $mysqli->real_escape_string($_POST['email']);
$dob = $mysqli->real_escape_string($_POST['dob']);
$tel = $mysqli->real_escape_string($_POST['tel']);
$bio = $mysqli->real_escape_string($_POST['bio']);
$weight = $mysqli->real_escape_string($_POST['weight']);
$height = $mysqli->real_escape_string($_POST['height']);
$targetCalories = $mysqli->real_escape_string($_POST['targetCalories']);
$bmi = $mysqli->real_escape_string($_POST['bmi']);

$query = "UPDATE USER SET userName='$name', userEmail='$email', userDOB='$dob', userTel='$tel', userBio='$bio', userWeight='$weight', userHeight='$height', userTargetCalories='$targetCalories', userBMI='$bmi' WHERE userID='$userID'";

if ($mysqli->query($query) === TRUE) {
    echo "Profile updated successfully";
    header('Location: user-profile.html');
} else {
    echo "Error: " . $query . "<br>" . $mysqli->error;
}

$mysqli->close();

?>
