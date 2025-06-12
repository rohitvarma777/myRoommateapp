<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include 'db_connect.php';

$input = json_decode(file_get_contents('php://input'), true);

$username = $input['username'] ?? '';
$group_code = $input['group_code'] ?? '';

if (empty($username) || empty($group_code)) {
    echo json_encode(["success" => false, "message" => "Username and group code are required."]);
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

$group_id = null;
$group_name = null;
$stmt = $conn->prepare("SELECT group_id, group_name FROM groups WHERE group_code = ?");
$stmt->bind_param("s", $group_code);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    $group_data = $result->fetch_assoc();
    $group_id = $group_data['group_id'];
    $group_name = $group_data['group_name'];
} else {
    echo json_encode(["success" => false, "message" => "Invalid group code."]);
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

$stmt = $conn->prepare("SELECT * FROM user_groups WHERE user_id = ? AND group_id = ?");
$stmt->bind_param("ii", $user_id, $group_id);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    echo json_encode([
        "success" => true,
        "message" => "You are already a member of this group.",
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
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();


$stmt = $conn->prepare("INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)");
$stmt->bind_param("ii", $user_id, $group_id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Successfully joined group!",
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
    echo json_encode(["success" => false, "message" => "Failed to join group: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>