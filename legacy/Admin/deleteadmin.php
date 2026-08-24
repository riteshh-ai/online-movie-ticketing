<?php
session_start();
if (empty($_SESSION["admin_username"]) || !isset($_SESSION['admin_cinema_id']) || $_SESSION['admin_cinema_id'] != 0) {
    header("Location:index.php");
    exit();
}
require_once("../conn.php");
$conn = new connec();

$id = intval($_GET['id'] ?? 0);
if ($id > 0) {
    $conn->delete('admin_users', $id);
}
header("Location:viewadmin.php");
exit();
