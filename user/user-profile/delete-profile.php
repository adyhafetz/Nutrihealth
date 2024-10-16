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

// Get user ID
$userID = $_SESSION['userID'];

// Delete user account
$query = "DELETE FROM USER WHERE userID='$userID'";

if ($mysqli->query($query) === TRUE) {
    // Important: Start output buffering to avoid sending headers after output
    ob_start();
    session_destroy();
    // Correct the redirection path
    header('Location: http://localhost/dashboard/Test/signup-login/signup-login.html');
    ob_end_flush(); // Flush the output buffer and turn off output buffering
    exit();
} else {
    echo "Error: " . $query . "<br>" . $mysqli->error;
}

$mysqli->close();
?>
