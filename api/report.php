<?php
require 'connection.php';

// Initial response code
http_response_code(404); // Default to Not Found
$response = new stdClass();

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['action'])) {
    $action = $_GET['action'];

    switch ($action) {
        case 'fetchSharings':
            // Handle GET requests to fetch sharings
            try {
                $categoryIds = [1, 2, 3, 4]; // Array of specific category IDs

                $placeholders = implode(',', array_fill(0, count($categoryIds), '?'));

                $sql = "SELECT sharingId, categoryId FROM sharing
                        WHERE categoryId IN ($placeholders)";

                $stmt = $db->prepare($sql);
                $stmt->execute($categoryIds);
                $sharings = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if ($sharings) {
                    http_response_code(200); // OK
                    echo json_encode($sharings);
                    exit();
                } else {
                    http_response_code(404); // Not Found
                    $response->error = "No sharings found for the specified categories.";
                }
            } catch (Exception $e) {
                http_response_code(500); // Internal Server Error
                $response->error = "Error occurred: " . $e->getMessage();
            }
            break;

            case 'fetchUsers':
                // Handle GET requests to fetch users with roleId=2 and their gender
                try {
                    $roleId = 2; // Assuming roleId 2 is for regular users
    
                    $sql = "SELECT userId, gender FROM user WHERE roleId = :roleId";
    
                    $stmt = $db->prepare($sql);
                    $stmt->bindParam(':roleId', $roleId);
                    $stmt->execute();
                    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
                    if ($users) {
                        http_response_code(200); // OK
                        echo json_encode($users);
                        exit();
                    } else {
                        http_response_code(404); // Not Found
                        $response->error = "No users found.";
                    }
                } catch (Exception $e) {
                    http_response_code(500); // Internal Server Error
                    $response->error = "Error occurred: " . $e->getMessage();
                }
                break;
    
            default:
                // Action parameter not provided or invalid request method
                http_response_code(400); // Bad Request
                $response->error = "Invalid action.";
                break;
        }
    } else {
        // Action parameter not provided or invalid request method
        http_response_code(400); // Bad Request
        $response->error = "Invalid request.";
    }

// Set content type header
header('Content-Type: application/json');

// Send JSON response
echo json_encode($response);
exit();
?>
