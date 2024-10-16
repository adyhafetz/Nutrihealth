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

$expertID = $_SESSION['expertID'];

// Fetch exercise plans for the logged-in expert
$sql = "SELECT * FROM EXERCISE_PLAN WHERE expertID = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $expertID);
$stmt->execute();
$result = $stmt->get_result();

$exercisePlans = [];
while ($row = $result->fetch_assoc()) {
    $exercisePlans[] = $row;
}

echo json_encode($exercisePlans);

$stmt->close();
$mysqli->close();
?>
