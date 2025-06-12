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

if (isset($data['group_id'])) {
    $group_id = intval($data['group_id']);

    $conn->begin_transaction(); 

    try {
        $users = [];
        $sql_users = "SELECT u.user_id, u.username FROM users u join user_groups g on u.user_id=g.user_id wHERE g.group_id = ?";
        $stmt_users = $conn->prepare($sql_users);
        if (!$stmt_users) {
            throw new Exception("Failed to prepare users statement: " . $conn->error);
        }
        $stmt_users->bind_param("i", $group_id);
        $stmt_users->execute();
        $result_users = $stmt_users->get_result();

        if ($result_users->num_rows === 0) {
            throw new Exception("No users found in this group to assign chores to.");
        }

        $user_loads = []; 
        foreach ($result_users->fetch_all(MYSQLI_ASSOC) as $row) {
            $user_id = $row['user_id'];
            $user_loads[$user_id] = 0; 
        }
        $stmt_users->close();

        $chores_to_assign = [];
        $sql_chores = "
            SELECT
                c.chore_id,
                c.chore_name,
                c.estimated_hours,
                c.frequency
            FROM
                chores c
            LEFT JOIN
                chore_assignments ca ON c.chore_id = ca.chore_id AND ca.status = 'pending'
            WHERE
                c.group_id = ? AND ca.assignment_id IS NULL
            ORDER BY
                c.estimated_hours DESC, c.created_at ASC -- Prioritize longer chores first, then oldest unassigned
        ";
        $stmt_chores = $conn->prepare($sql_chores);
        if (!$stmt_chores) {
            throw new Exception("Failed to prepare chores statement: " . $conn->error);
        }
        $stmt_chores->bind_param("i", $group_id);
        $stmt_chores->execute();
        $result_chores = $stmt_chores->get_result();

        if ($result_chores->num_rows === 0) {
            throw new Exception("No unassigned chores found to distribute.");
        }

        while ($row = $result_chores->fetch_assoc()) {
            $chores_to_assign[] = $row;
        }
        $stmt_chores->close();

        $assignments_created = 0;
        $users_ids = array_keys($user_loads); 
        
        foreach ($chores_to_assign as $chore) {
            $min_load = PHP_INT_MAX;
            $assigned_to_user_id = null;

            foreach ($user_loads as $user_id => $load) {
                if ($load < $min_load) {
                    $min_load = $load;
                    $assigned_to_user_id = $user_id;
                }
            }

            if ($assigned_to_user_id === null) {
                continue;
            }

            $user_loads[$assigned_to_user_id] += $chore['estimated_hours'];

            $assigned_date = date('Y-m-d');
            $due_date = date('Y-m-d'); 

            switch ($chore['frequency']) {
                case 'daily':
                    $due_date = date('Y-m-d', strtotime('+1 day'));
                    break;
                case 'weekly':
                    $due_date = date('Y-m-d', strtotime('+7 days'));
                    break;
                case 'bi-weekly':
                    $due_date = date('Y-m-d', strtotime('+14 days'));
                    break;
                case 'monthly':
                    $due_date = date('Y-m-d', strtotime('+1 month'));
                    break;
                default:
                    $due_date = date('Y-m-d', strtotime('+3 days'));
                    break;
            }

            $sql_insert = "INSERT INTO chore_assignments (chore_id, user_id, assigned_date, due_date, status) VALUES (?, ?, ?, ?, 'pending')";
            $stmt_insert = $conn->prepare($sql_insert);
            if (!$stmt_insert) {
                throw new Exception("Failed to prepare insert statement: " . $conn->error);
            }
            $stmt_insert->bind_param("iiss", $chore['chore_id'], $assigned_to_user_id, $assigned_date, $due_date);
            if (!$stmt_insert->execute()) {
                throw new Exception("Failed to insert assignment for chore '{$chore['chore_name']}': " . $stmt_insert->error);
            }
            $stmt_insert->close();
            $assignments_created++;
        }

        $conn->commit(); 
        $response = ['success' => true, 'message' => "Successfully assigned {$assignments_created} chores."];

    } catch (Exception $e) {
        $conn->rollback(); 
        $response = ['success' => false, 'message' => $e->getMessage()];
    } finally {
        $conn->close();
    }
} else {
    $response = ['success' => false, 'message' => 'Group ID is required.'];
}

echo json_encode($response);
?>