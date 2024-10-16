<?php
// Connect to the database
$mysqli = new mysqli("localhost", "root", "", "nutriHealth");

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$sql = "SELECT * FROM MEAL_PLAN";
$result = $mysqli->query($sql);
$mealPlans = array();

if ($result) {
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $mealPlans[] = $row;
        }
    }
    echo json_encode($mealPlans);
} else {
    echo "Error: " . $mysqli->error;
}

$mysqli->close();
?>