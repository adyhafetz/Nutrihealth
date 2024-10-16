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

$sql = "SELECT a.appointmentDate, a.appointmentTime, a.appointmentDetails, e.expertName
        FROM APPOINTMENT a
        JOIN HEALTH_EXPERT e ON a.expertID = e.expertID
        WHERE a.userID = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $userID);
$stmt->execute();
$result = $stmt->get_result();

$appointments = [];
while ($row = $result->fetch_assoc()) {
    $appointments[] = $row;
}

echo json_encode($appointments);

$stmt->close();
$mysqli->close();
?>
