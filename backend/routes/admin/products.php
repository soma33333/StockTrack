<?php
include '../../config/headers.php';
include '../../config/config.php';

header("Content-Type: application/json");

try {
    //To fetch products
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->query("SELECT * FROM products");
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($products);
    }

    //To add a new product  

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);

        if (
            isset($data['name']) &&
            isset($data['description']) &&
            isset($data['price']) &&
            isset($data['stock_quantity'])
        ) {
            $stmt = $pdo->prepare("INSERT INTO products (name, description, price, stock_quantity, created_at, updated_at)
                                   VALUES (:name, :description, :price, :stock_quantity, NOW(), NOW())");
            $stmt->execute([
                ':name' => $data['name'],
                ':description' => $data['description'],
                ':price' => $data['price'],
                ':stock_quantity' => $data['stock_quantity']
            ]);
            echo json_encode(["status" => "success"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Invalid input"]);
        }
    }

    //To delete a product
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("DELETE FROM products WHERE id = :id");
            $stmt->execute([':id' => $_GET['id']]);
            echo json_encode(["status" => "deleted"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Missing product ID"]);
        }
    }
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $data = json_decode(file_get_contents("php://input"), true);
    
        if (
            isset($_GET['id']) &&
            isset($data['name']) &&
            isset($data['description']) &&
            isset($data['price']) &&
            isset($data['stock_quantity'])
        ) {
            $stmt = $pdo->prepare("UPDATE products SET name = :name, description = :description, price = :price, stock_quantity = :stock_quantity, updated_at = NOW() WHERE id = :id");
            $stmt->execute([
                ':id' => $_GET['id'],
                ':name' => $data['name'],
                ':description' => $data['description'],
                ':price' => $data['price'],
                ':stock_quantity' => $data['stock_quantity']
            ]);
            echo json_encode(["status" => "updated"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Invalid input for update"]);
        }
    }
    

} catch (PDOException $e) {
    error_log("PDO Error: " . $e->getMessage()); 
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
