<?php
include '../config/config.php';
include '../config/headers.php';


if (isset($_COOKIE['PHPSESSID'])) {
    session_start();
} 

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (isset($_SESSION['user_id'])) {
    $sql = "SELECT id, username, role FROM users WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['id' => $_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode([
            "isAuthenticated" => true,
            "user" => $user
        ]);
    } else {
        session_unset();
        session_destroy();
        echo json_encode(["isAuthenticated" => false]);
    }
} else {
    echo json_encode(["isAuthenticated" => false]);
}
?>
