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
        $exerciseID = $data['exerciseID'];
        $planStatus = 'on';

        $sql = "INSERT INTO USER_EXERCISE_PLAN (userID, exerciseID, planStatus) VALUES ('$userID', '$exerciseID', '$planStatus')";
        if ($mysqli->query($sql) === TRUE) {
            echo json_encode(['message' => 'Exercise plan added successfully']);
        } else {
            echo json_encode(['message' => 'Error adding meal plan: ' . $mysqli->error]);
        }
    }

    $mysqli->close();
?>