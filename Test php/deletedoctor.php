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
    
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    file_put_contents('debug_log.txt', date('Y-m-d H:i:s') . " - Received data: " . print_r($data, true) . "\n", FILE_APPEND);
    
    if (!isset($data['id'])) {
        echo json_encode(['status' => 'error', 'message' => 'Missing doctor ID']);
        exit;
    }
    
    $id = $data['id'];
    
    file_put_contents('debug_log.txt', date('Y-m-d H:i:s') . " - Using ID: " . (is_array($id) ? json_encode($id) : $id) . "\n", FILE_APPEND);
    
    if (is_array($id)) {
        if (isset($id['ID'])) {
            $id = $id['ID'];
        } else {
            $id = reset($id);
        }
    }
    
    $stmt = $conn->prepare("DELETE FROM doctors WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    $affected = $stmt->rowCount();
    
    if ($affected > 0) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No doctor found with ID: ' . $id]);
    }
    
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
} catch(Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'General error: ' . $e->getMessage()]);
}
?>