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
    // Get the request body
    $requestData = json_decode(file_get_contents("php://input"), true);

    // Check the "action" parameter to determine which POST request to handle
    if (isset($requestData['action'])) {
        switch ($requestData['action']) {
            case 'addVideo':
                try {
                    // Prepare the SQL statement for registration
                    $title = isset($requestData['title']) ? $requestData['title'] : null;
                    $titleDescription = isset($requestData['titleDescription']) ? $requestData['titleDescription'] : null;
                    $userId = isset($requestData['userId']) ? $requestData['userId'] : null;
                    $categoryId = isset($requestData['categoryId']) ? $requestData['categoryId'] : null;
                    $sharingTypeId = 1; // Assuming sharingTypeId for video is 1
                    
                    // Prepare the SQL statement for registration
                    $stmt = $db->prepare("INSERT INTO sharing (title, titleDescription, userId, categoryId, sharingTypeId,) VALUES (:title, :titleDescription, :userId, :categoryId, :sharingTypeId,)");
                    
                    // Bind parameters
                    $stmt->bindParam(':title', $title);
                    $stmt->bindParam(':titleDescription', $titleDescription);
                    $stmt->bindParam(':userId', $userId);
                    $stmt->bindParam(':categoryId', $categoryId);
                    $stmt->bindParam(':sharingTypeId', $sharingTypeId);

                    
                    // Execute the statement
                    $stmt->execute();
                    
                    // Check if the registration was successful
                    if ($stmt->rowCount() > 0) {
                        // Registration successful
                        http_response_code(201); // Created
                        $response = [
                            'message' => "Registered successfully."
                        ];
                    } else {
                        // Registration failed
                        http_response_code(500); // Internal Server Error
                        $response->error = "Failed to register admin.";
                    }
                } catch (Exception $ee) {
                    http_response_code(500);
                    $response->error = "Error occurred " . $ee->getMessage();
                }
                break;
            

                case 'addContext':
                    try {
                        // Prepare the SQL statement for adding context
                        $title = isset($requestData['title']) ? $requestData['title'] : null;
                        $titleDescription = isset($requestData['titleDescription']) ? $requestData['titleDescription'] : null;
                        $userId = isset($requestData['userId']) ? $requestData['userId'] : null;
                        $categoryId = isset($requestData['categoryId']) ? $requestData['categoryId'] : null;
                        $sharingTypeId = 2; // Assuming sharingTypeId for context is 2
                        
                        // Prepare the SQL statement for adding context
                        $stmt = $db->prepare("INSERT INTO sharing (title, titleDescription, userId, categoryId, sharingTypeId) VALUES (:title, :titleDescription, :userId, :categoryId, :sharingTypeId)");
                        
                        // Bind parameters
                        $stmt->bindParam(':title', $title);
                        $stmt->bindParam(':titleDescription', $titleDescription);
                        $stmt->bindParam(':userId', $userId);
                        $stmt->bindParam(':categoryId', $categoryId);
                        $stmt->bindParam(':sharingTypeId', $sharingTypeId);
                        
                        // Execute the statement
                        $stmt->execute();
                        
                        // Check if the registration was successful
                        if ($stmt->rowCount() > 0) {
                            // Registration successful
                            http_response_code(201); // Created
                            $response = [
                                'message' => "Registered successfully."
                            ];
                        } else {
                            // Registration failed
                            http_response_code(500); // Internal Server Error
                            $response->error = "Failed to register.";
                        }
                    } catch (Exception $ee) {
                        http_response_code(500);
                        $response->error = "Error occurred: " . $ee->getMessage();
                    }
                    break;
                
                // Add more cases for additional POST requests as needed
    
                default:
                    http_response_code(400);  // Bad Request
                    $response->error = "Invalid action parameter.";
                    break;
            }
        } else {
            http_response_code(400);  // Bad Request
            $response->error = "Action parameter is required.";
        }

    } elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
        // Handle GET requests
        try {
            // Fetch only the title and image columns from the sharing table
            $stmt = $db->prepare("SELECT title, image FROM sharing");
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            // Check if records are found
            if ($result) {
                // Set response code to OK
                http_response_code(200);
                // Set response data
                $response->data = $result;
            } else {
                // No records found
                http_response_code(404);
                $response->error = "No records found.";
            }
        } catch (Exception $e) {
            // Error occurred while fetching records
            http_response_code(500);
            $response->error = "Error occurred: " . $e->getMessage();
        }
        
    } else if ($_SERVER["REQUEST_METHOD"] == "PUT") {
        // Handle PUT requests
        // Get the ID from the query string
        if (isset($_GET['sharingId'])) {
            $sharingId = $_GET['sharingId'];
    
            // Get the request body
            $requestData = json_decode(file_get_contents("php://input"), true);
    
            if ($sharingId) {
                try {
                    // Prepare the SQL statement for updating record
                    $title = isset($requestData['title']) ? $requestData['title'] : null;
                    $titleDescription = isset($requestData['titleDescription']) ? $requestData['titleDescription'] : null;
                    $userId = isset($requestData['userId']) ? $requestData['userId'] : null;
                    $categoryId = isset($requestData['categoryId']) ? $requestData['categoryId'] : null;
                    $sharingTypeId = isset($requestData['sharingTypeId']) ? $requestData['sharingTypeId'] : null;
    
                    // Prepare the SQL statement for updating the record
                    $stmt = $db->prepare("UPDATE sharing SET title = :title, titleDescription = :titleDescription, userId = :userId, categoryId = :categoryId, sharingTypeId = :sharingTypeId WHERE sharingId = :sharingId");
    
                    // Bind parameters
                    $stmt->bindParam(':title', $title);
                    $stmt->bindParam(':titleDescription', $titleDescription);
                    $stmt->bindParam(':userId', $userId);
                    $stmt->bindParam(':categoryId', $categoryId);
                    $stmt->bindParam(':sharingTypeId', $sharingTypeId);
                    $stmt->bindParam(':sharingId', $sharingId);
    
                    // Execute the statement
                    $stmt->execute();
    
                    // Check if the update was successful
                    if ($stmt->rowCount() > 0) {
                        // Update successful
                        http_response_code(200); // OK
                        $response = [
                            'message' => "Updated successfully."
                        ];
                    } else {
                        // Update failed
                        http_response_code(500); // Internal Server Error
                        $response->error = "Failed to update.";
                    }
                } catch (Exception $ee) {
                    http_response_code(500);
                    $response->error = "Error occurred: " . $ee->getMessage();
                }
            } else {
                http_response_code(400);  // Bad Request
                $response->error = "sharingId parameter is required for update.";
            }
        } else {
            http_response_code(400);  // Bad Request
            $response->error = "sharingId parameter is required in the URL.";
        }

    } elseif ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    // Handle DELETE requests
    parse_str($_SERVER['QUERY_STRING'], $query_params);
    if (isset($query_params['sharingId'])) {
        try {
            $sharingId = $query_params['sharingId'];

            // Prepare the SQL statement for deleting the record
            $stmt = $db->prepare("DELETE FROM sharing WHERE sharingId = :sharingId");
            $stmt->bindParam(':sharingId', $sharingId);

            // Execute the statement
            $stmt->execute();

            // Check if the deletion was successful
            if ($stmt->rowCount() > 0) {
                // Deletion successful
                http_response_code(200); // OK
                $response = [
                    'message' => "Deleted successfully."
                ];
            } else {
                // Deletion failed (record not found)
                http_response_code(404); // Not Found
                $response->error = "Record not found.";
            }
        } catch (Exception $ee) {
            // Error occurred while deleting the record
            http_response_code(500);
            $response->error = "Error occurred: " . $ee->getMessage();
        }
    } else {
        // No ID parameter provided
        http_response_code(400);  // Bad Request
        $response->error = "ID parameter is required for delete.";
    }
}

// Before sending the JSON response, set the content type header
header('Content-Type: application/json');

// Then send the JSON response
echo json_encode($response);
exit();
?>