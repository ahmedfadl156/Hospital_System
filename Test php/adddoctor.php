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
    
    file_put_contents('debug_add.txt', date('Y-m-d H:i:s') . " - Received data: " . print_r($data, true) . "\n", FILE_APPEND);
    
    if (!isset($data['name']) || empty(trim($data['name']))) {
        echo json_encode(['status' => 'error', 'message' => 'Doctor name is required']);
        exit;
    }
    
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $fields = ['name', 'email', 'specialty', 'yearsOfExperience', 'status'];
    $present_fields = [];
    $values = [];
    $placeholders = [];
    
    foreach ($fields as $field) {
        if (isset($data[$field])) {
            $present_fields[] = $field;
            $values[$field] = $data[$field];
            $placeholders[] = ':' . $field;
        }
    }
    
    $sql = "INSERT INTO doctors (" . implode(', ', $present_fields) . ") VALUES (" . implode(', ', $placeholders) . ")";
    
    $stmt = $conn->prepare($sql);
    
    foreach ($values as $field => $value) {
        $stmt->bindParam(':' . $field, $values[$field]);
    }
    
    $stmt->execute();
    
    $newId = $conn->lastInsertId();
    
    echo json_encode(['status' => 'success', 'id' => $newId]);
    
} catch(PDOException $e) {
    file_put_contents('error_log.txt', date('Y-m-d H:i:s') . " - Database error: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
} catch(Exception $e) {
    file_put_contents('error_log.txt', date('Y-m-d H:i:s') . " - General error: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'General error: ' . $e->getMessage()]);
}
?>