<?php
header('Content-Type: application/json');

$conn = new mysqli('localhost', 'username', 'password', 'f1_shop');

if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed']));
}

$email = $_POST['email'] ?? '';
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$username = $_POST['username'] ?? '';

// Check if email exists
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(['status' => 'exists', 'message' => 'Email already registered']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $email, $password);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Registration successful']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Registration failed']);
}

$stmt->close();
$conn->close();
?>