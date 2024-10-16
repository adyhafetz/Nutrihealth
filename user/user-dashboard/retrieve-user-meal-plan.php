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

$sql = "SELECT mp.mealType, mp.mealName, mp.mealCalories
        FROM user_meal_plan ump
        JOIN meal_plan mp ON ump.mealID = mp.mealID
        WHERE ump.userID = '$userID'
        AND ump.planStatus = 'on'";
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
