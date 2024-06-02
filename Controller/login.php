<?php
session_start();
include '../Model/connect.php';

$username = $_POST['username'];
$password = $_POST['password'];

// Prevent SQL injection
$username = mysqli_real_escape_string($conn, $username);
$password = mysqli_real_escape_string($conn, $password);

// Query to fetch the user from the database
$sql = "SELECT * FROM user WHERE username='$username'";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_assoc($result);
    if (password_verify($password, $row['password'])) {
        $_SESSION['username'] = $username;
        header('Location: ../View/index.html');
    } else {
        echo 'Invalid credentials';
    }
} else {
    echo 'Invalid credentials';
}

mysqli_close($conn);
?>
