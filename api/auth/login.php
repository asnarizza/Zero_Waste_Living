<?php
require '../connection.php';

// initial response code
// response code will be changed if the request goes into any of the processes

http_response_code(404);
$response = new stdClass();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $requestData = json_decode(file_get_contents("php://input"), true);

    if (isset($requestData['action'])) {
        $action = $requestData['action'];
        
        switch ($action) {
            case 'login':
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
                break;
            
            case 'checkEmail':
                if (isset($requestData['email'])) {
                    $email = $requestData['email'];

                    $stmt = $db->prepare("SELECT * FROM user WHERE email=:email");
                    $stmt->bindParam(':email', $email);
                    $stmt->execute();

                    if ($stmt->rowCount() > 0) {
                        http_response_code(200);
                        $response->message = "Email exists.";
                    } else {
                        http_response_code(404);
                        $response->error = "Email does not exist.";
                    }
                } else {
                    http_response_code(400);
                    $response->error = "Email is required.";
                }
                break;
            default:
                http_response_code(400);
                $response->error = "Invalid action.";
                break;
        }
    } else {
        http_response_code(400);
        $response->error = "Action is required.";
    }
}  else if ($_SERVER["REQUEST_METHOD"] == "PUT") {
    $requestData = json_decode(file_get_contents("php://input"), true);

    if (isset($requestData['email']) && isset($requestData['newPassword']) && isset($requestData['confirmPassword'])) {
        $email = $requestData['email'];
        $newPassword = $requestData['newPassword'];
        $confirmPassword = $requestData['confirmPassword'];

        if ($newPassword !== $confirmPassword) {
            http_response_code(400);
            $response->error = "New password and confirm password do not match.";
            echo json_encode($response);
            exit();
        }

        try {
            $stmt = $db->prepare("SELECT * FROM user WHERE email=:email");
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $updateStmt = $db->prepare("UPDATE user SET password=:newPassword WHERE email=:email");
                $updateStmt->bindParam(':newPassword', $newPassword);
                $updateStmt->bindParam(':email', $email);
                $updateStmt->execute();

                http_response_code(200);
                $response->message = "Password has been updated successfully.";
            } else {
                http_response_code(404);
                $response->error = "Email does not exist.";
            }
        } catch (Exception $ee) {
            http_response_code(500);
            $response->error = "Error occurred " . $ee->getMessage();
        }
    } else {
        http_response_code(400);
        $response->error = "Email, new password, and confirm password are required.";
    }
}

// Before sending the JSON response, set the content type header
header('Content-Type: application/json');

// Then send the JSON response
echo json_encode($response);
exit();
?>
