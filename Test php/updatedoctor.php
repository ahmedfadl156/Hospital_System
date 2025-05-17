<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

error_reporting(0);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "hospital_managment";

try {
    $raw_data = file_get_contents("php://input");
    $data = json_decode($raw_data, true);
    
    file_put_contents('debug_update.txt', date('Y-m-d H:i:s') . " - Received data: " . print_r($data, true) . "\n", FILE_APPEND);
    
    if (!isset($data['id']) || empty($data['id'])) {
        echo json_encode(['status' => 'error', 'message' => 'Doctor ID is required']);
        exit;
    }
    
    if (!isset($data['name']) || empty(trim($data['name']))) {
        echo json_encode(['status' => 'error', 'message' => 'Doctor name is required']);
        exit;
    }
    
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $fields = ['name', 'email', 'specialty', 'yearsOfExperience', 'status'];
    $set_parts = [];
    $values = ['id' => $data['id']]; // Add ID to values array
    
    foreach ($fields as $field) {
        if (isset($data[$field])) {
            $set_parts[] = "$field = :$field";
            $values[$field] = $data[$field];
        }
    }
    
    $sql = "UPDATE doctors SET " . implode(', ', $set_parts) . " WHERE id = :id";
    
    $stmt = $conn->prepare($sql);
    
    foreach ($values as $field => $value) {
        $stmt->bindParam(':' . $field, $values[$field]);
    }
    
    $stmt->execute();
    
    $affected = $stmt->rowCount();
    
    if ($affected > 0) {
        echo json_encode(['status' => 'success']);
    } else {
        $check = $conn->prepare("SELECT COUNT(*) FROM doctors WHERE id = :id");
        $check->bindParam(':id', $data['id']);
        $check->execute();
        
        if ($check->fetchColumn() > 0) {
            echo json_encode(['status' => 'success', 'message' => 'No changes made']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No doctor found with ID: ' . $data['id']]);
        }
    }
    
} catch(PDOException $e) {
    file_put_contents('error_log.txt', date('Y-m-d H:i:s') . " - Database error: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
} catch(Exception $e) {
    file_put_contents('error_log.txt', date('Y-m-d H:i:s') . " - General error: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'General error: ' . $e->getMessage()]);
}
?>