<?php
    $mysqli = new mysqli("localhost", "root", "", "nutriHealth");

    if ($mysqli->connect_error) {
        echo json_encode(['error' => $mysqli->connect_error]);
        exit();
    }

    $result = $mysqli->query("SELECT expertID, expertName, expertEmail, expertTel, expertBio, expertType, expertQualification FROM HEALTH_EXPERT");
    $experts = [];

    while ($row = $result->fetch_assoc()) {
        $experts[] = $row;
    }

    echo json_encode($experts);
    $mysqli->close();
?>
