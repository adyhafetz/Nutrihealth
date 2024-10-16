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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $mealID = $mysqli->real_escape_string($data['mealID']);

    $stmt = $mysqli->prepare("DELETE FROM USER_MEAL_PLAN WHERE userID = ? AND mealID = ?");
    $stmt->bind_param("ss", $userID, $mealID);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'meal plan removed successfully']);
    } else {
        echo json_encode(['message' => 'Error removing meal plan: ' . $stmt->error]);
    }
    $stmt->close();
}

$mysqli->close();
?>
