<?php
include '../../config/headers.php';
include '../../config/config.php';

try {
    $method = $_SERVER['REQUEST_METHOD'];
//fetch all assigned products for a supplier based on userId and type
    if ($method === 'GET') {
        $userId = isset($_GET['userId']) ? intval($_GET['userId']) : null;
        $type = isset($_GET['type']) ? $_GET['type'] : 'pending';

        if ($userId) {
            $stmtSupplier = $pdo->prepare("
                SELECT s.id AS supplier_id
                FROM suppliers s
                INNER JOIN users u ON u.username = s.name
                WHERE u.id = :user_id
            ");
            $stmtSupplier->execute([':user_id' => $userId]);
            $supplier = $stmtSupplier->fetch(PDO::FETCH_ASSOC);

            if ($supplier && isset($supplier['supplier_id'])) {
                $supplierId = $supplier['supplier_id'];

                if ($type === 'history') {
                    $stmt = $pdo->prepare("
                        SELECT 
                            ps.id,
                            p.name,
                            p.description,
                            p.price,
                            p.stock_quantity,
                            ps.requested_quantity,
                            ps.status,
                            ps.assigned_at
                        FROM product_supplier ps
                        INNER JOIN products p ON ps.product_id = p.id
                        WHERE ps.supplier_id = :supplier_id AND ps.status IN ('approved', 'rejected')
                    ");
                    $stmt->execute([':supplier_id' => $supplierId]);
                } else {
                    $stmt = $pdo->prepare("
                        SELECT 
                            ps.id,
                            p.name,
                            p.description,
                            p.price,
                            p.stock_quantity,
                            ps.requested_quantity,
                            ps.status,
                            ps.assigned_at
                        FROM product_supplier ps
                        INNER JOIN products p ON ps.product_id = p.id
                        WHERE ps.supplier_id = :supplier_id AND ps.status = :status
                    ");
                    $stmt->execute([':supplier_id' => $supplierId, ':status' => 'pending']);
                }

                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Supplier not found for user"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Missing userId"]);
        }
    } elseif ($method === 'PUT') {
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = $params['id'] ?? null;
        $data = json_decode(file_get_contents("php://input"), true);

        if ($id && isset($data['status'])) {
            $pdo->beginTransaction();

            try {
                $stmt = $pdo->prepare("UPDATE product_supplier SET status = :status WHERE id = :id");
                $stmt->execute([
                    ':status' => $data['status'],
                    ':id' => $id
                ]);

                if ($data['status'] === 'approved') {
                    $stmtDetails = $pdo->prepare("SELECT product_id, requested_quantity FROM product_supplier WHERE id = :id");
                    $stmtDetails->execute([':id' => $id]);
                    $details = $stmtDetails->fetch(PDO::FETCH_ASSOC);

                    if ($details && $details['requested_quantity'] > 0) {
                        $stmtUpdateStock = $pdo->prepare("
                            UPDATE products 
                            SET stock_quantity = stock_quantity + :quantity 
                            WHERE id = :product_id
                        ");
                        $stmtUpdateStock->execute([
                            ':quantity' => $details['requested_quantity'],
                            ':product_id' => $details['product_id']
                        ]);
                    }
                }

                $pdo->commit();
                echo json_encode(["status" => "success", "message" => "Status updated and stock adjusted"]);
            } catch (PDOException $e) {
                $pdo->rollBack();
                http_response_code(500);
                echo json_encode(["error" => "Transaction failed: " . $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Missing ID or status"]);
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
