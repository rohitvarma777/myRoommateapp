<?php
include 'db_connect.php';

$input = json_decode(file_get_contents('php://input'), true);

$group_id = $input['group_id'] ?? null;
$paid_by_user_id = $input['paid_by_user_id'] ?? null;
$description = $input['description'] ?? '';
$amount = $input['amount'] ?? null;
$participants_user_ids = $input['participants_user_ids'] ?? []; 

if (is_null($group_id) || is_null($paid_by_user_id) || empty($description) || is_null($amount) || !is_array($participants_user_ids) || count($participants_user_ids) === 0) {
    echo json_encode(["success" => false, "message" => "Missing required fields or participants."]);
    exit();
}

$amount = (float)$amount; 
$conn->begin_transaction();

try {
    $stmt = $conn->prepare("INSERT INTO expenses (group_id, description, amount, paid_by_user_id) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isdi", $group_id, $description, $amount, $paid_by_user_id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to add expense: " . $stmt->error);
    }
    $expense_id = $stmt->insert_id;
    $stmt->close();

    $stmt_participants = $conn->prepare("INSERT INTO expense_participants (expense_id, user_id) VALUES (?, ?)");
    foreach ($participants_user_ids as $user_id) {
        $stmt_participants->bind_param("ii", $expense_id, $user_id);
        if (!$stmt_participants->execute()) {
            throw new Exception("Failed to add participant: " . $stmt_participants->error);
        }
    }
    $stmt_participants->close();

    $conn->commit();
    echo json_encode([
        "success" => true,
        "message" => "Expense added successfully!",
        "expense_id" => $expense_id
    ]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
?>