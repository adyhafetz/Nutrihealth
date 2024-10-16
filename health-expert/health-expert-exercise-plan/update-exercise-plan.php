<?php
session_start();

// Check if expert is logged in
if (!isset($_SESSION['expertID'])) {
    header('Location: ../login/login.html');
    exit();
}

// Set header for JSON response
header('Content-Type: application/json');

// Connect to the database
$mysqli = new mysqli("localhost", "root", "", "nutriHealth");

// Check connection
if ($mysqli->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $mysqli->connect_error]);
    exit();
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the posted data
    $exerciseID = $_POST['exerciseID'];
    $exerciseType = $_POST['exerciseType'];
    $exerciseName = $_POST['exerciseName'];
    $exerciseDescription = $_POST['exerciseDescription'];
    $exerciseCalories = $_POST['exerciseCalories'];
    $exerciseDuration = $_POST['exerciseDuration'];

    // Prepare the SQL update statement
    $sql = "UPDATE EXERCISE_PLAN SET exerciseType = ?, exerciseName = ?, exerciseDescription = ?, exerciseCalories = ?, exerciseDuration = ? WHERE exerciseID = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("sssiii", $exerciseType, $exerciseName, $exerciseDescription, $exerciseCalories, $exerciseDuration, $exerciseID);

    // Execute the statement and check if it was successful
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Update failed: ' . $stmt->error]);
    }

    // Close the statement
    $stmt->close();
}

// Close the database connection
$mysqli->close();
?>
