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

        // Check if all required fields are present
        if (isset($requestData['comment']) && isset($requestData['userId']) && isset($requestData['sharingId'])) {
            try {
                // Prepare the SQL statement for inserting a new comment
                $comment = $requestData['comment'];
                $userId = $requestData['userId'];
                $sharingId = $requestData['sharingId'];

                $stmt = $db->prepare("INSERT INTO comment (comment, userId, sharingId) VALUES (:comment, :userId, :sharingId)");
                $stmt->bindParam(':comment', $comment);
                $stmt->bindParam(':userId', $userId);
                $stmt->bindParam(':sharingId', $sharingId);

                // Execute the statement
                $stmt->execute();

                // Check if the insertion was successful
                if ($stmt->rowCount() > 0) {
                    // Insertion successful
                    http_response_code(201); // Created
                    $response = [
                        'message' => "Comment posted successfully."
                    ];
                } else {
                    // Insertion failed
                    http_response_code(500); // Internal Server Error
                    $response->error = "Failed to post the comment.";
                }
            } catch (Exception $ee) {
                // Error occurred while inserting the comment
                http_response_code(500);
                $response->error = "Error occurred: " . $ee->getMessage();
            }
        } else {
            // Missing required fields in the request body
            http_response_code(400); // Bad Request
            $response->error = "Missing required fields in the request body.";
        }

    } elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
        // Handle GET requests to fetch comments
        if (isset($_GET['sharingId'])) {
            $sharingId = $_GET['sharingId'];
            try {
                // Fetch comments and user names based on sharingId from the database
                $stmt = $db->prepare("SELECT c.*, u.name FROM comment c JOIN user u ON c.userId = u.userId WHERE c.sharingId = :sharingId");
                $stmt->bindParam(':sharingId', $sharingId);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
                // Check if comments are found
                if ($result) {
                    // Set response code to OK
                    http_response_code(200);
                    // Set response data
                    $response->data = $result;
                } else {
                    // No comments found
                    http_response_code(404);
                    $response->error = "No comments found.";
                }
            } catch (Exception $e) {
                // Error occurred while fetching comments
                http_response_code(500);
                $response->error = "Error occurred: " . $e->getMessage();
            }
        } else {
            // Missing sharingId parameter
            http_response_code(400); // Bad Request
            $response->error = "sharingId parameter is required.";
        }
        
    }   elseif ($_SERVER["REQUEST_METHOD"] == "PUT") {
        // Handle PUT requests to update comments
        // Get the commentId from the URL query string
        $commentId = isset($_GET['commentId']) ? $_GET['commentId'] : null;
        
        if ($commentId !== null) {
            try {
                // Get the request body
                $requestData = json_decode(file_get_contents("php://input"), true);

                // Extract other parameters from the request body
                $comment = isset($requestData['comment']) ? $requestData['comment'] : null;
                $userId = isset($requestData['userId']) ? $requestData['userId'] : null;
                $sharingId = isset($requestData['sharingId']) ? $requestData['sharingId'] : null;

                // Prepare the SQL statement for updating a comment
                $stmt = $db->prepare("UPDATE comment SET comment = :comment, userId = :userId, sharingId = :sharingId WHERE commentId = :commentId");

                // Bind parameters
                $stmt->bindParam(':comment', $comment);
                $stmt->bindParam(':userId', $userId);
                $stmt->bindParam(':sharingId', $sharingId);
                $stmt->bindParam(':commentId', $commentId);

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
                    http_response_code(404); // Not Found
                    $response->error = "Comment not found.";
                }
            } catch (Exception $ee) {
                // Error occurred while updating the comment
                http_response_code(500);
                $response->error = "Error occurred: " . $ee->getMessage();
            }
        } else {
            // No commentId provided
            http_response_code(400); // Bad Request
            $response->error = "commentId parameter is required for update.";
        }
    } elseif ($_SERVER["REQUEST_METHOD"] == "DELETE") {
        // Handle DELETE requests to delete comments
        // Extract commentId from query parameters
        parse_str($_SERVER['QUERY_STRING'], $query_params);
        if (isset($query_params['commentId'])) {
            try {
                // Prepare the SQL statement for deleting the comment
                $commentId = $query_params['commentId'];
                $stmt = $db->prepare("DELETE FROM comment WHERE commentId = :commentId");
                $stmt->bindParam(':commentId', $commentId);

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
                    // Deletion failed (comment not found)
                    http_response_code(404); // Not Found
                    $response->error = "Comment not found.";
                }
            } catch (Exception $ee) {
                // Error occurred while deleting the comment
                http_response_code(500);
                $response->error = "Error occurred: " . $ee->getMessage();
            }
        } else {
            // No commentId provided
            http_response_code(400); // Bad Request
            $response->error = "commentId parameter is required for deletion.";
        }
    }

    // Before sending the JSON response, set the content type header
    header('Content-Type: application/json');

    // Then send the JSON response
    echo json_encode($response);
    exit();
    ?>
