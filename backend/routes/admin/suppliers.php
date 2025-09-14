<?php
include '../../config/headers.php';
include '../../config/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
try {
    //To fetch suppliers
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->query("SELECT * FROM suppliers");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    //To create suppliers
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        if (
            isset($data['name']) &&
            isset($data['contact_email']) &&
            isset($data['phone']) &&
            isset($data['address']) &&
            isset($data['password'])
        ) {
            // Step 1: Create user
            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
            $stmtUser = $pdo->prepare("INSERT INTO users (username, password, role, created_at)
                                       VALUES (:username, :password, 'supplier', NOW())");
            $stmtUser->execute([
                ':username' => $data['name'],
                ':password' => $hashedPassword
            ]);
    
            // Step 2: Create supplier
            $stmtSupplier = $pdo->prepare("INSERT INTO suppliers (name, contact_email, phone, address, created_at)
                                           VALUES (:name, :contact_email, :phone, :address, NOW())");
            $stmtSupplier->execute([
                ':name' => $data['name'],
                ':contact_email' => $data['contact_email'],
                ':phone' => $data['phone'],
                ':address' => $data['address']
            ]);
    
            echo json_encode(["status" => "success"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Invalid input"]);
        }
    }
    
// To update suppliers
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $data = json_decode(file_get_contents("php://input"), true);
        if (
            isset($_GET['id']) &&
            isset($data['name']) &&
            isset($data['contact_email']) &&
            isset($data['phone']) &&
            isset($data['address'])
        ) {
            $stmt = $pdo->prepare("UPDATE suppliers SET name = :name, contact_email = :contact_email, phone = :phone, address = :address WHERE id = :id");
            $stmt->execute([
                ':id' => $_GET['id'],
                ':name' => $data['name'],
                ':contact_email' => $data['contact_email'],
                ':phone' => $data['phone'],
                ':address' => $data['address']
            ]);
            echo json_encode(["status" => "updated"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Invalid input for update"]);
        }
    }

// To delete suppliers 
    if ($_SERVER['REQUEST_METHOD'] === "DELETE") {
        if (isset($_GET['id'])) {
            // Step 1: Get supplier name
            $stmt = $pdo->prepare("SELECT name FROM suppliers WHERE id = :id");
            $stmt->execute([':id' => $_GET['id']]);
            $supplier = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($supplier) {
                $username = $supplier['name'];
    
                // Step 2: Delete supplier
                $stmt = $pdo->prepare("DELETE FROM suppliers WHERE id = :id");
                $stmt->execute([':id' => $_GET['id']]);
    
                // Step 3: Delete user
                $stmt = $pdo->prepare("DELETE FROM users WHERE username = :username AND role = 'supplier'");
                $stmt->execute([':username' => $username]);
    
                echo json_encode(["status" => "deleted"]);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Supplier not found"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Missing supplier ID"]);
        }
    }
    
    

} catch (PDOException $e) {
    error_log("PDOException: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}

