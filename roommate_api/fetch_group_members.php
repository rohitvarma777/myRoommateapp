<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db_connect.php'; 

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = [];

if (isset($_GET['group_id'])) {
    $group_id = intval($_GET['group_id']);

    $sql = "SELECT u.user_id, u.username 
            FROM users u
            JOIN user_groups ug ON u.user_id = ug.user_id
            WHERE ug.group_id = ?";
    $stmt = $conn->prepare($sql);

    
    if ($stmt) {
        $stmt->bind_param("i", $group_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $members = [];
        while ($row = $result->fetch_assoc()) {
            $members[] = $row;
        }
        $stmt->close();

        if (count($members) > 0) {
            $response = ['success' => true, 'members' => $members];
        } else {
            $response = ['success' => false, 'message' => 'No members found for this group.', 'members' => []];
        }

    } else {
        $response = ['success' => false, 'message' => 'Database prepare error: ' . $conn->error];
    }
} else {
    $response = ['success' => false, 'message' => 'Group ID is required.'];
}

$conn->close();
echo json_encode($response);
?>