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

$sql = "SELECT userTargetCalories FROM USER WHERE userID = '$userID'";
$result = $mysqli->query($sql);

if ($result) {
    $userData = $result->fetch_assoc();
    $userTargetCalories = $userData['userTargetCalories'];
    echo json_encode(array("userTargetCalories" => $userTargetCalories));
} else {
    echo json_encode(array("error" => "Failed to retrieve user's target calories"));
}

$mysqli->close();
?>
