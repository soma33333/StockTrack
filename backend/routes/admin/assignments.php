<?php
include '../../config/headers.php';
include '../../config/config.php';

try {
    $method = $_SERVER['REQUEST_METHOD'];

    //tp fetch assignments
    if ($method === 'GET') {
        $stmt = $pdo->query("
            SELECT ps.id, ps.product_id, ps.supplier_id, ps.requested_quantity, ps.status,
                   p.name AS product_name, s.name AS supplier_name
            FROM product_supplier ps
            JOIN products p ON ps.product_id = p.id
            JOIN suppliers s ON ps.supplier_id = s.id
        ");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['product_id'], $data['supplier_id'], $data['requested_quantity'], $data['status'])) {
            // Check for existing pending assignment
            $check = $pdo->prepare("
                SELECT COUNT(*) 
                FROM product_supplier 
                WHERE product_id = :product_id 
                  AND supplier_id = :supplier_id 
                  AND status = 'pending'
            ");
            $check->execute([
                ':product_id' => $data['product_id'],
                ':supplier_id' => $data['supplier_id']
            ]);

            if ($check->fetchColumn() > 0) {
                http_response_code(409);
                echo json_encode(["error" => "A pending assignment already exists for this product and supplier"]);
                exit;
            }

            // Proceed to insert new assignment
            $stmt = $pdo->prepare("
                INSERT INTO product_supplier (product_id, supplier_id, requested_quantity, status, assigned_at)
                VALUES (:product_id, :supplier_id, :requested_quantity, :status, NOW())
            ");
            $stmt->execute([
                ':product_id' => $data['product_id'],
                ':supplier_id' => $data['supplier_id'],
                ':requested_quantity' => $data['requested_quantity'],
                ':status' => $data['status']
            ]);
            echo json_encode(["status" => "success", "message" => "Assignment saved"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
        }

        // To update assignments
    } elseif ($method === 'PUT') {
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = $params['id'] ?? null;
        $data = json_decode(file_get_contents("php://input"), true);

        if ($id && isset($data['product_id'], $data['supplier_id'], $data['requested_quantity'], $data['status'])) {
            $stmt = $pdo->prepare("
                UPDATE product_supplier SET
                    product_id = :product_id,
                    supplier_id = :supplier_id,
                    requested_quantity = :requested_quantity,
                    status = :status
                WHERE id = :id
            ");
            $stmt->execute([
                ':product_id' => $data['product_id'],
                ':supplier_id' => $data['supplier_id'],
                ':requested_quantity' => $data['requested_quantity'],
                ':status' => $data['status'],
                ':id' => $id
            ]);
            echo json_encode(["status" => "success", "message" => "Assignment updated"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
        }

        // To delete assignments
    } elseif ($method === 'DELETE') {
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = $params['id'] ?? null;

        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM product_supplier WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(["status" => "success", "message" => "Assignment deleted"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Missing assignment ID"]);
        }
    } else {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
