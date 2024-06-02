<?php
include '../Model/connect.php';

$username = $_POST['username'];
$name = $_POST['name'];
$email = $_POST['email'];
$password = $_POST['password'];
$gender = $_POST['gender'];
$birthDate = $_POST['birthDate'];
$image = addslashes(file_get_contents($_FILES['image']['tmp_name'])); // Add slashes to escape the binary data

// Prevent SQL injection
$username = mysqli_real_escape_string($conn, $username);
$name = mysqli_real_escape_string($conn, $name);
$email = mysqli_real_escape_string($conn, $email);
$password = mysqli_real_escape_string($conn, $password);
$gender = mysqli_real_escape_string($conn, $gender);
$birthDate = mysqli_real_escape_string($conn, $birthDate);

// Hash the password before storing
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Query to insert the new user into the database
$sql = "INSERT INTO user (username, name, email, password, gender, birthDate, image) 
        VALUES ('$username', '$name', '$email', '$hashed_password', '$gender', '$birthDate', '$image')";

if (mysqli_query($conn, $sql)) {
    echo 'Account created successfully. <a href="../Views/login.php">Log in</a>';
} else {
    echo 'Error: ' . $sql . '<br>' . mysqli_error($conn);
}

mysqli_close($conn);
?>
