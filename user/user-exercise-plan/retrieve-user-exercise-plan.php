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

$sql = "SELECT ep.exerciseType, ep.exerciseName, ep.exerciseDescription, ep.exerciseCalories, ep.exerciseDuration, uep.planStatus, uep.userID, uep.exerciseID
        FROM user_exercise_plan uep
        JOIN exercise_plan ep ON uep.exerciseID = ep.exerciseID
        WHERE uep.userID = '$userID'";
$result = $mysqli->query($sql);
$userMealPlans = array();

if ($result) {
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $userMealPlans[] = $row;
        }
    }
    echo json_encode($userMealPlans);
} else {
    echo "Error: " . $mysqli->error;
}

$mysqli->close();
?>
