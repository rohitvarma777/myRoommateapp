<?php

include 'db_connect.php';

$group_id = $_GET['group_id'] ?? null;

if (is_null($group_id)) {
    echo json_encode(["success" => false, "message" => "Group ID is required."]);
    exit();
}

$members = [];
$stmt = $conn->prepare("
    SELECT u.user_id, u.username
    FROM users u
    JOIN user_groups ug ON u.user_id = ug.user_id
    WHERE ug.group_id = ?
    ORDER BY u.username ASC
");
$stmt->bind_param("i", $group_id);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $members[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode(["success" => true, "members" => $members]);
?>