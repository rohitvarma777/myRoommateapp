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

    $chores_sql = "
        SELECT
            c.chore_id,
            c.chore_name,
            c.estimated_hours,
            c.frequency,
            c.created_at,
            ca.assignment_id,
            ca.user_id AS assigned_user_id,
            u.username AS assigned_username,
            ca.assigned_date,
            ca.due_date,
            ca.completed_date,
            ca.status
        FROM
            chores c
        LEFT JOIN
            chore_assignments ca ON c.chore_id = ca.chore_id AND ca.status = 'pending'
        LEFT JOIN
            users u ON ca.user_id = u.user_id
        WHERE
            c.group_id = ?
        ORDER BY
            c.created_at DESC, ca.due_date ASC
    ";

    $stmt = $conn->prepare($chores_sql);

    if ($stmt) {
        $stmt->bind_param("i", $group_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $chores = [];
        while ($row = $result->fetch_assoc()) {
            $chore_id = $row['chore_id'];
            if (!isset($chores[$chore_id])) {
                $chores[$chore_id] = [
                    'chore_id' => $row['chore_id'],
                    'chore_name' => $row['chore_name'],
                    'estimated_hours' => floatval($row['estimated_hours']),
                    'frequency' => $row['frequency'],
                    'created_at' => $row['created_at'],
                    'assignments' => [] 
                ];
            }
            if ($row['assignment_id'] !== null) {
                $chores[$chore_id]['assignments'][] = [
                    'assignment_id' => $row['assignment_id'],
                    'user_id' => $row['assigned_user_id'],
                    'username' => $row['assigned_username'],
                    'assigned_date' => $row['assigned_date'],
                    'due_date' => $row['due_date'],
                    'completed_date' => $row['completed_date'],
                    'status' => $row['status']
                ];
            }
        }
        $stmt->close();
        
        $chores = array_values($chores); 

        $response = ['success' => true, 'chores' => $chores];
    } else {
        $response = ['success' => false, 'message' => 'Database prepare error: ' . $conn->error];
    }
} else {
    $response = ['success' => false, 'message' => 'Group ID is required.'];
}

$conn->close();
echo json_encode($response);
?>