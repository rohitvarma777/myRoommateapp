<?php
include 'db_connect.php';

$input = json_decode(file_get_contents('php://input'), true);

$username = $input['username'] ?? '';
$group_name = $input['group_name'] ?? '';

if (empty($username) || empty($group_name)) {
    echo json_encode(["success" => false, "message" => "Username and group name are required."]);
    exit();
}

$user_id = null;
$stmt = $conn->prepare("SELECT user_id FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    $user_id = $result->fetch_assoc()['user_id'];
} else {
    $stmt_insert_user = $conn->prepare("INSERT INTO users (username) VALUES (?)");
    $stmt_insert_user->bind_param("s", $username);
    if ($stmt_insert_user->execute()) {
        $user_id = $stmt_insert_user->insert_id;
    } else {
        echo json_encode(["success" => false, "message" => "Failed to create user: " . $stmt_insert_user->error]);
        $stmt_insert_user->close();
        $conn->close();
        exit();
    }
    $stmt_insert_user->close();
}
$stmt->close();

if (is_null($user_id)) {
    echo json_encode(["success" => false, "message" => "Could not determine user ID."]);
    $conn->close();
    exit();
}

$group_code = substr(str_shuffle("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"), 0, 6);
$code_exists = true;
while ($code_exists) {
    $stmt = $conn->prepare("SELECT group_id FROM groups WHERE group_code = ?");
    $stmt->bind_param("s", $group_code);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows == 0) {
        $code_exists = false;
    } else {
        $group_code = substr(str_shuffle("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"), 0, 6); // Regenerate
    }
    $stmt->close();
}

$stmt = $conn->prepare("INSERT INTO groups (group_name, group_code, created_by) VALUES (?, ?, ?)");
$stmt->bind_param("ssi", $group_name, $group_code, $user_id);

if ($stmt->execute()) {
    $group_id = $stmt->insert_id;

    $stmt_user_group = $conn->prepare("INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)");
    $stmt_user_group->bind_param("ii", $user_id, $group_id);
    if ($stmt_user_group->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Group created successfully!",
            "group" => [
                "group_id" => $group_id,
                "group_name" => $group_name,
                "group_code" => $group_code
            ],
            "user" => [
                "user_id" => $user_id,
                "username" => $username
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to add user to group: " . $stmt_user_group->error]);
    }
    $stmt_user_group->close();
} else {
    echo json_encode(["success" => false, "message" => "Failed to create group: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>