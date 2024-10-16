<?php
    $mysqli = new mysqli("localhost", "root", "", "nutriHealth");

    if ($mysqli->connect_error) {
        die("Connection failed: " . $mysqli->connect_error);
    }

    $sql = "SELECT * FROM EXERCISE_PLAN";
    $result = $mysqli->query($sql);
    $exercisePlans = array();

    if ($result) {
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $exercisePlans[] = $row;
            }
        }
        echo json_encode($exercisePlans);
    } else {
        echo "Error: " . $mysqli->error;
    }

    $mysqli->close();
?>

