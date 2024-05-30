<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Here, you would normally process the form data, e.g., save it to a database

    echo "Registration successful!";
}
?>
