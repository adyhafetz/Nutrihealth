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
        $exerciseID = $mysqli->real_escape_string($data['exerciseID']);

        $stmt = $mysqli->prepare("DELETE FROM USER_EXERCISE_PLAN WHERE userID = ? AND exerciseID = ?");
        $stmt->bind_param("ss", $userID, $exerciseID);
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Exercise plan removed successfully']);
        } else {
            echo json_encode(['message' => 'Error removing exercise plan: ' . $stmt->error]);
        }
        $stmt->close();
    }

    $mysqli->close();
?>
