<?php
require '../connection.php';

// initial response code
// response code will be changed if the request goes into any of the processes
http_response_code(404);
$response = new stdClass();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET['userId'])) {
        $userId = $_GET['userId'];

        // Assuming $db is your PDO database connection
        try {
            $stmt = $db->prepare("SELECT userId, name, email, password, gender, birthDate, image, roleId FROM user WHERE userId=:userId");
            $stmt->bindParam(':userId', $userId);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $userData = $stmt->fetch(PDO::FETCH_ASSOC);
                http_response_code(200);

                // Output the response
                echo json_encode($userData); // Changed from $response to $userData
                exit(); // Exit after sending the response
            } else {
                http_response_code(404);
                echo json_encode(array("error" => "User not found."));
                exit(); // Exit after sending the response
            }
        } catch (PDOException $ee) { // Catch PDOException instead of generic Exception
            http_response_code(500);
            echo json_encode(array("error" => "Database error occurred: " . $ee->getMessage()));
            exit(); // Exit after sending the response
        }
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "User ID is required."));
        exit(); // Exit after sending the response
    }
} else if ($_SERVER["REQUEST_METHOD"] == "PUT") {
    // Parse JSON input
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    // Check if JSON is valid
    if ($data === null) {
        http_response_code(400);
        $response->error = "Invalid JSON data.";
    } else {
        // Check if required fields are present
        $requiredFields = ['userId', 'name', 'email', 'password', 'gender', 'birthDate', 'image'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                http_response_code(400);
                $response->error = "Missing field: $field";
                echo json_encode($response);
                exit();
            }
        }

        // Update user data
        try {
            $userId = $data['userId'];

            // Prepare SQL statement for updating user data
            $stmt = $db->prepare("UPDATE user SET name=:name, email=:email, password=:password, gender=:gender, birthDate=:birthDate, image=:image WHERE userId=:userId");

            // Bind parameters
            $stmt->bindParam(':userId', $userId);
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':password', $data['password']);
            $stmt->bindParam(':gender', $data['gender']);
            $stmt->bindParam(':birthDate', $data['birthDate']);
            $stmt->bindParam(':image', $data['image']);

            // Execute the statement
            $stmt->execute();

            http_response_code(200);
            $response->message = "User data updated successfully.";
        } catch (PDOException $e) { // Catch PDOException instead of generic Exception
            http_response_code(500);
            $response->error = "Error occurred: " . $e->getMessage();
        }
    }
}

// Before sending the JSON response, set the content type header
header('Content-Type: application/json');

// Then send the JSON response
echo json_encode($response);
exit();
?>
