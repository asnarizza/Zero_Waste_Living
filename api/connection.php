<?php
$hostname = "localhost";
$database = "zwaste";
$username = "root";
$password = "";

try {
    $db = new PDO("mysql:host=$hostname;dbname=$database", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    $response = new stdClass();
    $response->error = "Database connection failed: " . $e->getMessage();
    header('Content-Type: application/json');
    echo json_encode($response);
    exit();
}
?>
