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

if (isset($data['group_id'], $data['chore_name'], $data['estimated_hours'], $data['frequency'])) {
    $group_id = intval($data['group_id']);
    $chore_name = $conn->real_escape_string($data['chore_name']);
    $estimated_hours = floatval($data['estimated_hours']);
    $frequency = $conn->real_escape_string($data['frequency']);

    if ($estimated_hours <= 0) {
        $response = ['success' => false, 'message' => 'Estimated hours must be positive.'];
        echo json_encode($response);
        $conn->close();
        exit();
    }

    $sql = "INSERT INTO chores (group_id, chore_name, estimated_hours, frequency) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("isds", $group_id, $chore_name, $estimated_hours, $frequency);
        if ($stmt->execute()) {
            $response = ['success' => true, 'message' => 'Chore added successfully.'];
        } else {
            $response = ['success' => false, 'message' => 'Failed to add chore: ' . $stmt->error];
        }
        $stmt->close();
    } else {
        $response = ['success' => false, 'message' => 'Database prepare error: ' . $conn->error];
    }
} else {
    $response = ['success' => false, 'message' => 'Required fields missing.'];
}

$conn->close();
echo json_encode($response);
?>