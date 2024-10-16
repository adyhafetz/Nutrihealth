<?php
    $mysqli = new mysqli("localhost", "root", "", "nutriHealth");

    if ($mysqli->connect_error) {
        die("Connection failed: " . $mysqli->connect_error);
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $userID = $data['userID'];
    $exerciseID = $data['exerciseID'];
    $planStatus = $data['planStatus'];

    $sql = "UPDATE user_exercise_plan SET planStatus = '$planStatus' WHERE userID = '$userID' AND exerciseID = '$exerciseID'";
    if ($mysqli->query($sql) === TRUE) {
        echo json_encode(['message' => 'Plan status updated successfully']);
    } else {
        echo json_encode(['message' => 'Error updating plan status: ' . $mysqli->error]);
    }

    $mysqli->close();
?>
