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
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// initial response code
// response code will be changed if the request goes into any of the processes
http_response_code(404);
$response = new stdClass();


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the request body
    $requestData = json_decode(file_get_contents("php://input"), true);

    // Extract variables from the request data
    $title = isset($requestData['title']) ? $requestData['title'] : null;
    $titleDescription = isset($requestData['titleDescription']) ? $requestData['titleDescription'] : null;
    $image = isset($requestData['image']) ? $requestData['image'] : null;
    $userId = isset($requestData['userId']) ? $requestData['userId'] : null;
    $categoryId = isset($requestData['categoryId']) ? $requestData['categoryId'] : null;
   

    // Check for required fields
    if (!$title || !$titleDescription || !$image || !$userId || !$categoryId) {
        http_response_code(400);  // Bad Request
        echo json_encode(['error' => 'All fields are required.']);
        exit;
    }

    try {
        // Prepare the SQL statement for insertion
        $stmt = $db->prepare("INSERT INTO sharing (title, titleDescription, image, userId, categoryId) VALUES (:title, :titleDescription, :image, :userId, :categoryId)");

        // Bind parameters
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':titleDescription', $titleDescription);
        $stmt->bindParam(':image', $image);
        $stmt->bindParam(':userId', $userId);
        $stmt->bindParam(':categoryId', $categoryId);
        

        // Execute the statement
        $stmt->execute();

        // Check if the insertion was successful
        if ($stmt->rowCount() > 0) {
            // Insertion successful
            http_response_code(200); // Created
            echo json_encode(['message' => "Registered successfully."]);
        } else {
            // Insertion failed
            http_response_code(500); // Internal Server Error
            echo json_encode(['error' => "Failed to register."]);
        }
    } catch (Exception $ee) {
        http_response_code(500); // Internal Server Error
        echo json_encode(['error' => "Error occurred: " . $ee->getMessage()]);
    }
} elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        switch ($action) {
            case 'listAll':
                try {
                    // Fetch only the title and image columns from the sharing table
                    $stmt = $db->prepare("SELECT sharingId, title, image, userId FROM sharing");
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
                break;
            case 'listById':
                if (isset($_GET['sharingId'])) {
                    $sharingId = $_GET['sharingId'];
                    try {
                        // Fetch data by ID
                        $stmt = $db->prepare("SELECT title, titleDescription, image, userId FROM sharing WHERE sharingId = :sharingId");
                        $stmt->bindParam(':sharingId', $sharingId);
                        $stmt->execute();
                        $result = $stmt->fetch(PDO::FETCH_ASSOC);

                        // Check if record is found
                        if ($result) {
                            // Set response code to OK
                            http_response_code(200);
                            // Set response data
                            $response->data = $result;
                        } else {
                            // No record found
                            http_response_code(404);
                            $response->error = "Record not found.";
                        }
                    } catch (Exception $e) {
                        // Error occurred while fetching record
                        http_response_code(500);
                        $response->error = "Error occurred: " . $e->getMessage();
                    }
                } else {
                    http_response_code(400); // Bad Request
                    $response->error = "ID parameter is required for listById action.";
                }
                break;
            default:
                http_response_code(400); // Bad Request
                $response->error = "Invalid action.";
                break;
        }
    } else {
        http_response_code(400); // Bad Request
        $response->error = "Action parameter is required.";
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
                    $titleDescription = isset($requestData['titleDescription']) ? $requestData['titleDescription'] : null;
                    $image = isset($requestData['image']) ? $requestData['image'] : null; // Added for image
        
                    // Prepare the SQL statement for updating the record
                    $stmt = $db->prepare("UPDATE sharing SET titleDescription = :titleDescription, image = :image WHERE sharingId = :sharingId");
        
                    // Bind parameters  
                    $stmt->bindParam(':titleDescription', $titleDescription);
                    $stmt->bindParam(':image', $image); // Bind image
                    $stmt->bindParam(':sharingId', $sharingId); // Bind the sharingId from the URL
        
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
    } else
    
// Before sending the JSON response, set the content type header
header('Content-Type: application/json');

// Then send the JSON response
echo json_encode($response);
exit();
?>
