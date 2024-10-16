<?php
// Connect to the database
$mysqli = new mysqli("localhost", "root", "", "nutriHealth");

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);
$userID = $data['userID'];
$mealID = $data['mealID'];
$planStatus = $data['planStatus'];

$sql = "UPDATE user_meal_plan SET planStatus = '$planStatus' WHERE userID = '$userID' AND mealID = '$mealID'";
if ($mysqli->query($sql) === TRUE) {
    echo json_encode(['message' => 'Plan status updated successfully']);
} else {
    echo json_encode(['message' => 'Error updating plan status: ' . $mysqli->error]);
}

$mysqli->close();
?>
