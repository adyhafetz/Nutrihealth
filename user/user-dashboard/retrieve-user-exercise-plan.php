<?php
session_start();

if (!isset($_SESSION['userID'])) {
    header('Location: ../login/login.html');
    exit();
}

$mysqli = new mysqli("localhost", "root", "", "nutriHealth");

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$userID = $_SESSION['userID'];

$sql = "SELECT ep.exerciseType, ep.exerciseName, ep.exerciseCalories
        FROM user_exercise_plan uep
        JOIN exercise_plan ep ON uep.exerciseID = ep.exerciseID
        WHERE uep.userID = '$userID'
        AND uep.planStatus = 'on'";
$result = $mysqli->query($sql);
$userExercisePlans = array();

if ($result) {
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $userExercisePlans[] = $row;
        }
    }
    echo json_encode($userExercisePlans);
} else {
    echo "Error: " . $mysqli->error;
}

$mysqli->close();
?>