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
$expertEmail = $mysqli->real_escape_string($input['expertEmail']);
$details = $mysqli->real_escape_string($input['details']);
$date = $mysqli->real_escape_string($input['date']);
$time = $mysqli->real_escape_string($input['time']);

$sql = "SELECT expertID FROM HEALTH_EXPERT WHERE expertEmail = '$expertEmail'";
$result = $mysqli->query($sql);

if ($result) {
    if ($row = $result->fetch_assoc()) {
        $expertID = $row['expertID'];

        $stmt = $mysqli->prepare("INSERT INTO APPOINTMENT (userID, expertID, appointmentDate, appointmentTime, appointmentDetails) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("iisss", $userID, $expertID, $date, $time, $details);
        $stmt->execute();

        if ($stmt->error) {
            echo json_encode(['error' => $stmt->error]);
        } else {
            echo json_encode(['success' => 'Appointment booked']);
        }

        $stmt->close();
    } else {
        echo json_encode(['error' => 'Health expert not found']);
    }
} else {
    echo json_encode(['error' => 'Failed to retrieve expert ID']);
}

$mysqli->close();
?>