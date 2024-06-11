<?php
require 'connection.php';

// initial response code
// response code will be changed if the request goes into any of the processes

http_response_code(404);
$response = new stdClass();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the request body
    $requestData = json_decode(file_get_contents("php://input"), true);

    // Check if all required parameters are provided
    if (isset($requestData['userId']) && isset($requestData['sharingId'])) {
        try {
            // Extract parameters from the request body
            $userId = $requestData['userId'];
            $sharingId = $requestData['sharingId'];

            // Prepare the SQL statement for inserting a new wishlist item
            $stmt = $db->prepare("INSERT INTO wishlist (userId, sharingId) VALUES (:userId, :sharingId)");

            // Bind parameters
            $stmt->bindParam(':userId', $userId);
            $stmt->bindParam(':sharingId', $sharingId);

            // Execute the statement
            $stmt->execute();

            // Check if the insertion was successful
            if ($stmt->rowCount() > 0) {
                // Insertion successful
                http_response_code(201); // Created
                $response = [
                    'message' => "Wishlist item added successfully."
                ];
            } else {
                // Insertion failed
                http_response_code(500); // Internal Server Error
                $response->error = "Failed to add wishlist item.";
            }
        } catch (Exception $ee) {
            // Error occurred while inserting the wishlist item
            http_response_code(500);
            $response->error = "Error occurred: " . $ee->getMessage();
        }
    } else {
        // Missing parameters
        http_response_code(400); // Bad Request
        $response->error = "userId and sharingId parameters are required for adding a wishlist item.";
    }

} elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Handle GET requests to fetch wishlist items for a specific user
    if (isset($_GET['userId'])) {
        try {
            // Prepare the SQL statement for fetching wishlist items
            $userId = $_GET['userId'];
            $stmt = $db->prepare("SELECT * FROM wishlist WHERE userId = :userId");
            
            // Bind parameters
            $stmt->bindParam(':userId', $userId);
            
            // Execute the statement
            $stmt->execute();

            // Fetch all wishlist items
            $wishlistItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Check if wishlist items were found
            if ($wishlistItems) {
                // Wishlist items found
                http_response_code(200); // OK
                echo json_encode($wishlistItems);
                exit();
            } else {
                // No wishlist items found
                http_response_code(404); // Not Found
                $response->error = "No wishlist items found for the user.";
            }
        } catch (Exception $ee) {
            // Error occurred while fetching wishlist items
            http_response_code(500);
            $response->error = "Error occurred: " . $ee->getMessage();
        }
    } else {
        // No userId provided
        http_response_code(400); // Bad Request
        $response->error = "userId parameter is required for fetching wishlist items.";
    }
    
} elseif ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    // Get the request body
    $requestData = json_decode(file_get_contents("php://input"), true);

    // Check if wishlistId is provided
    if (isset($requestData['wishlistId'])) {
        try {
            // Extract wishlistId from the request body
            $wishlistId = $requestData['wishlistId'];

            // Prepare the SQL statement for deleting a wishlist item
            $stmt = $db->prepare("DELETE FROM wishlist WHERE wishlistId = :wishlistId");

            // Bind parameters
            $stmt->bindParam(':wishlistId', $wishlistId);

            // Execute the statement
            $stmt->execute();

            // Check if deletion was successful
            if ($stmt->rowCount() > 0) {
                // Deletion successful
                http_response_code(200); // OK
                $response = [
                    'message' => "Wishlist item deleted successfully."
                ];
            } else {
                // Wishlist item not found
                http_response_code(404); // Not Found
                $response->error = "Wishlist item not found.";
            }
        } catch (Exception $ee) {
            // Error occurred while deleting the wishlist item
            http_response_code(500);
            $response->error = "Error occurred: " . $ee->getMessage();
        }
    } else {
        // Missing wishlistId parameter
        http_response_code(400); // Bad Request
        $response->error = "wishlistId parameter is required for deleting a wishlist item.";
    }
}


// Before sending the JSON response, set the content type header
header('Content-Type: application/json');

// Then send the JSON response
echo json_encode($response);
exit();
?>