<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

try {
    $pdo = new PDO('mysql:host=localhost;dbname=hospital_managment', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id']) || !isset($data['status'])) {
        throw new Exception('Missing required fields');
    }

    $id = $data['id'];
    $status = $data['status'];

    $stmt = $pdo->prepare('UPDATE appointments SET status = :status WHERE id = :id');
    $stmt->execute(['status' => $status, 'id' => $id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Appointment status updated successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No appointment found with the given ID']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?> 