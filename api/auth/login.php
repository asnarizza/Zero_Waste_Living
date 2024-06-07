<?php

$hostname = "localhost";
$database = "zwaste";
$username = "root";
$password = "";

$db = new PDO("mysql:host=$hostname;dbname=$database", $username, $password);

// initial response code
// response code will be changed if the request goes into any of the processes

http_response_code(404);
$response = new stdClass();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {

        $requestData = json_decode(file_get_contents("php://input"), true);

        // Check if the email and password are set in the POST request
        if (isset($requestData['email']) && isset($requestData['password'])) {
            $email = $requestData['email'];
            $password = $requestData['password'];

            // Check if the email already exists
			$stmt = $db->prepare("SELECT * FROM user WHERE email=:email AND password=:password");

        
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password', $password);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $userData = $stmt->fetch(PDO::FETCH_ASSOC);
                http_response_code(200);

                // Handle null values
                $userData = array_map(function($value) {
                    return $value === null ? '' : $value;
                }, $userData);

                if (!empty($userData['image'])) {
                    $userData['image'] = base64_encode($userData['image']);
                }


                // Display the user data
                //echo json_encode($userData);

                // Set the response
                $response = [
                        'userId' => $userData['userId'],
                        'roleId' => $userData['roleId'],
                         'name' => $userData['name'],
                         'email' => $userData['email'],
                         'password' => $userData['password'],
                        'gender' => $userData['gender'],
                         'birthDate' => $userData['birthDate'],
                         'image' => $userData['image']
                ];
            } else {
                http_response_code(401);  // Unauthorized
                $response->error = "Invalid email or password.";
            }
        } else {
            http_response_code(400);  // Bad Request
            $response->error = "Email and password are required.";
        }
    } catch (Exception $ee) {
        http_response_code(500);
        $response->error = "Error occurred " . $ee->getMessage();
    }
} else if ($_SERVER["REQUEST_METHOD"] == "GET") {

    // Handle GET requests

} else if ($_SERVER["REQUEST_METHOD"] == "PUT") {
    try {
        $requestData = json_decode(file_get_contents("php://input"), true);

        // Check if the email and new password are set in the PUT request
        if (isset($requestData['email']) && isset($requestData['newPassword'])) {
            $email = $requestData['email'];
            $newPassword = $requestData['newPassword'];

            // Check if the email exists
            $stmt = $db->prepare("SELECT * FROM user WHERE email=:email");
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $userData = $stmt->fetch(PDO::FETCH_ASSOC);
                $currentPassword = $userData['password'];

                if ($newPassword === $currentPassword) {
                    http_response_code(400);  // Bad Request
                    $response->error = "New password cannot be the same as the old password.";
                } else {
                    // Update the password
                    $updateStmt = $db->prepare("UPDATE user SET password=:newPassword WHERE email=:email");
                    $updateStmt->bindParam(':newPassword', $newPassword);
                    $updateStmt->bindParam(':email', $email);
                    $updateStmt->execute();

                    http_response_code(200);  // OK
                    $response->message = "Password has been updated successfully.";
                }
            } else {
                http_response_code(404);  // Not Found
                $response->error = "Email does not exist.";
            }
        } else {
            http_response_code(400);  // Bad Request
            $response->error = "Email and new password are required.";
        }
    } catch (Exception $ee) {
        http_response_code(500);
        $response->error = "Error occurred " . $ee->getMessage();
    }
}

// Before sending the JSON response, set the content type header
header('Content-Type: application/json');

// Then send the JSON response
echo json_encode($response);
exit();
?>