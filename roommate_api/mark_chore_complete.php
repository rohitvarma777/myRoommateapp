<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db_connect.php'; 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

$response = [];

if (isset($data['assignment_id'], $data['user_id'])) { 
    $assignment_id = intval($data['assignment_id']);
    $user_id = intval($data['user_id']); 
    $completed_date = date('Y-m-d'); 

    $verify_sql = "SELECT assignment_id FROM chore_assignments WHERE assignment_id = ? AND user_id = ?";
    $stmt_verify = $conn->prepare($verify_sql);
    if ($stmt_verify) {
        $stmt_verify->bind_param("ii", $assignment_id, $user_id);
        $stmt_verify->execute();
        $stmt_verify->store_result();
        
        if ($stmt_verify->num_rows > 0) {
            $stmt_verify->close();

            $sql = "UPDATE chore_assignments SET status = 'completed', completed_date = ? WHERE assignment_id = ?";
            $stmt = $conn->prepare($sql);

            if ($stmt) {
                $stmt->bind_param("si", $completed_date, $assignment_id);
                if ($stmt->execute()) {
                    if ($stmt->affected_rows > 0) {
                        $response = ['success' => true, 'message' => 'Chore marked as completed.'];
                    } else {
                        $response = ['success' => false, 'message' => 'Chore not found or already completed.'];
                    }
                } else {
                    $response = ['success' => false, 'message' => 'Failed to mark chore complete: ' . $stmt->error];
                }
                $stmt->close();
            } else {
                $response = ['success' => false, 'message' => 'Database prepare error: ' . $conn->error];
            }
        } else {
            $response = ['success' => false, 'message' => 'Unauthorized: Assignment does not belong to this user or does not exist.'];
        }
    } else {
        $response = ['success' => false, 'message' => 'Database prepare error (verification): ' . $conn->error];
    }

} else {
    $response = ['success' => false, 'message' => 'Assignment ID and User ID are required.'];
}

$conn->close();
echo json_encode($response);
?>