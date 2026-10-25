<?php
require 'config.php';

$productId = $_GET['product_id'] ?? 0;

if (empty($productId)) {
    die("Invalid product ID");
}

$stmt = $pdo->prepare("UPDATE products SET stock = 0 WHERE id = ?");
$stmt->execute([$productId]);

echo "Product marked as sold out";
?>