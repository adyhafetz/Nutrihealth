<?php
session_start();

    if (!isset($_SESSION['userID'])) {
        header('Location: ../login/login.html');
        exit();
    }

    header('Content-Type: application/json');

    $mysqli = new mysqli("localhost", "root", "", "nutriHealth");

    if ($mysqli->connect_error) {
        echo json_encode(['error' => 'Connection failed: ' . $mysqli->connect_error]);
        exit();
    }

    $userID = $_SESSION['userID'];

    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['appointmentID'], $input['details'], $input['date'], $input['time'])) {
        echo json_encode(['error' => 'Invalid input data']);
        exit();
    }

    $appointmentID = $mysqli->real_escape_string($input['appointmentID']);
    $details = $mysqli->real_escape_string($input['details']);
    $date = $mysqli->real_escape_string($input['date']);
    $time = $mysqli->real_escape_string($input['time']);

    $stmt = $mysqli->prepare("UPDATE APPOINTMENT SET appointmentDetails = ?, appointmentDate = ?, appointmentTime = ? WHERE appointmentID = ? AND userID = ?");
    $stmt->bind_param("sssii", $details, $date, $time, $appointmentID, $userID);
    $stmt->execute();

    if ($stmt->error) {
        echo json_encode(['error' => 'Failed to update appointment: ' . $stmt->error]);
    } else {
        echo json_encode(['success' => 'Appointment updated successfully']);
    }

    $stmt->close();
    $mysqli->close();
?>
