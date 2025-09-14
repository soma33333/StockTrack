<?php
echo json_encode([
    "message" => "Welcome to the Inventory Management System API",
    "endpoints" => [
        "/routes/admin/assignments.php",
        "/routes/admin/products.php",
        "/routes/admin/suppliers.php"
    ]
]);
