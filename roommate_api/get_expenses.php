<?php
include 'db_connect.php';

$group_id = $_GET['group_id'] ?? null;

if (is_null($group_id)) {
    echo json_encode(["success" => false, "message" => "Group ID is required."]);
    exit();
}

$expenses_data = [];

$stmt = $conn->prepare("
    SELECT
        e.expense_id,
        e.description,
        e.amount,
        e.created_at,
        u_paid.user_id AS paid_by_user_id,
        u_paid.username AS paid_by_username
    FROM expenses e
    JOIN users u_paid ON e.paid_by_user_id = u_paid.user_id
    WHERE e.group_id = ?
    ORDER BY e.created_at DESC
");
$stmt->bind_param("i", $group_id);
$stmt->execute();
$result = $stmt->get_result();

while ($expense = $result->fetch_assoc()) {
    $expense['participants'] = [];

    $stmt_parts = $conn->prepare("
        SELECT
            ep.user_id,
            u.username
        FROM expense_participants ep
        JOIN users u ON ep.user_id = u.user_id
        WHERE ep.expense_id = ?
    ");
    $stmt_parts->bind_param("i", $expense['expense_id']);
    $stmt_parts->execute();
    $participants_result = $stmt_parts->get_result();
    while ($participant = $participants_result->fetch_assoc()) {
        $expense['participants'][] = $participant;
    }
    $stmt_parts->close(); 

    $expenses_data[] = $expense;
}

$stmt->close(); 
$conn->close();

echo json_encode(["success" => true, "expenses" => $expenses_data]);
?>