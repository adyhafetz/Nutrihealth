<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Connect to the database
    $mysqli = new mysqli("localhost", "root", "", "nutriHealth");

    // Check connection
    if ($mysqli->connect_error) {
        die("Connection failed: " . $mysqli->connect_error);
    }

    // Function to sanitize input
    function sanitize($input) {
        global $mysqli;
        return $mysqli->real_escape_string($input);
    }

    // Handle Signup
    if (isset($_POST['signup'])) {
        $role = sanitize($_POST['role']);
        $name = sanitize($_POST['name']);
        $email = sanitize($_POST['email']);
        $password = password_hash($_POST['password'], PASSWORD_BCRYPT); // Securely hash the password

        // Prepare the SQL query based on the role
        $query = null;
        switch ($role) {
            case 'USER':
                $query = $mysqli->prepare("INSERT INTO USER (userName, userEmail, userPassword) VALUES (?, ?, ?)");
                $redirectUrl = '../user/user-dashboard/user-dashboard.html';
                break;
            case 'HEALTH_EXPERT':
                $query = $mysqli->prepare("INSERT INTO HEALTH_EXPERT (expertName, expertEmail, expertPassword) VALUES (?, ?, ?)");
                $redirectUrl = '../health-expert/health-expert-dashboard/health-expert-dashboard.html';
                break;
            case 'ADMINISTRATOR':
                $query = $mysqli->prepare("INSERT INTO ADMINISTRATOR (adminName, adminEmail, adminPassword) VALUES (?, ?, ?)");
                $redirectUrl = '../administrator/admin-dashboard/admin-dashboard.html';
                break;
            default:
                echo "<script>alert('Invalid role specified'); window.location.href='signup-login.html';</script>";
                exit();
        }

        // Bind parameters and execute
        if ($query) {
            $query->bind_param("sss", $name, $email, $password);
            if ($query->execute()) {
                // Set session variables based on role
                $id = $mysqli->insert_id;
                switch ($role) {
                    case 'USER':
                        $_SESSION['userID'] = $id;
                        break;
                    case 'HEALTH_EXPERT':
                        $_SESSION['expertID'] = $id;
                        break;
                    case 'ADMINISTRATOR':
                        $_SESSION['adminID'] = $id;
                        break;
                }
                $_SESSION['role'] = $role;

                // Redirect to the appropriate dashboard based on the role
                header("Location: $redirectUrl");
                exit();
            } else {
                echo "<script>alert('Error: " . $query->error . "'); window.location.href='signup-login.html';</script>";
            }
            $query->close();
        }
    }

    // Handle Login
    if (isset($_POST['login'])) {
        $role = sanitize($_POST['role']);
        $email = sanitize($_POST['email']);
        $password = $_POST['password'];

        // Prepare the query based on the role
        switch ($role) {
            case 'USER':
                $query = "SELECT userID, userPassword FROM USER WHERE userEmail=?";
                $redirectUrl = '../user/user-dashboard/user-dashboard.html';
                break;
            case 'HEALTH_EXPERT':
                $query = "SELECT expertID, expertPassword FROM HEALTH_EXPERT WHERE expertEmail=?";
                $redirectUrl = '../health-expert/health-expert-dashboard/health-expert-dashboard.html';
                break;
            case 'ADMINISTRATOR':
                $query = "SELECT adminID, adminPassword FROM ADMINISTRATOR WHERE adminEmail=?";
                $redirectUrl = '../administrator/admin-dashboard/admin-dashboard.html';
                break;
            default:
                echo "<script>alert('Invalid role specified'); window.location.href='signup-login.html';</script>";
                exit();
        }

        // Prepare and execute the query
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        // Verify password and set session variables
        if ($user && password_verify($password, $user[$role == 'USER' ? 'userPassword' : ($role == 'HEALTH_EXPERT' ? 'expertPassword' : 'adminPassword')])) {
            switch ($role) {
                case 'USER':
                    $_SESSION['userID'] = $user['userID'];
                    break;
                case 'HEALTH_EXPERT':
                    $_SESSION['expertID'] = $user['expertID'];
                    break;
                case 'ADMINISTRATOR':
                    $_SESSION['adminID'] = $user['adminID'];
                    break;
            }
            $_SESSION['role'] = $role;

            // Redirect to the appropriate dashboard
            header("Location: $redirectUrl");
            exit();
        } else {
            // Return error response if login fails
            echo "<script>alert('Invalid email or password'); window.location.href='signup-login.html';</script>";
            exit();
        }

        $stmt->close();
    }

    $mysqli->close();
}
?>
