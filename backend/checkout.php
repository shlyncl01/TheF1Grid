<?php
require 'config.php';

header('Content-Type: application/json');

$cart = json_decode($_POST['cart'], true);

try {
    $pdo->beginTransaction();
    
    // Create order
    $stmt = $pdo->prepare("INSERT INTO orders (user_id, total_amount) VALUES (?, ?)");
    $total = array_reduce($cart, function($sum, $item) {
        return $sum + ($item['price'] * $item['quantity']);
    }, 0);
    $stmt->execute([$_SESSION['user_id'], $total]);
    $orderId = $pdo->lastInsertId();
    
    // Add order items
    $stmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price, size) VALUES (?, ?, ?, ?, ?)");
    foreach ($cart as $item) {
        $stmt->execute([
            $orderId,
            $item['id'],
            $item['quantity'],
            $item['price'],
            $item['size'] ?? null
        ]);
    }
    
    $pdo->commit();
    echo json_encode(['status' => 'success']);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>