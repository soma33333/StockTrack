<?php
include '../config/headers.php';

session_start();
session_destroy();
echo json_encode(["status" => "logged out"]);
?>
