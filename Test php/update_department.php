<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$db_name = "hospital_managment"; 
$username = "root"; 
$password = "";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id']) || !isset($data['name']) || !isset($data['staff_number']) || !isset($data['beds_number']) || !isset($data['equipments_number'])) {
        throw new Exception('All fields are required');
    }

    $query = "UPDATE departments 
              SET name = :name, 
                  staff_number = :staff_number, 
                  beds_number = :beds_number, 
                  equipments_number = :equipments_number 
              WHERE id = :id";
    
    $stmt = $conn->prepare($query);
    $stmt->execute([
        ':id' => $data['id'],
        ':name' => $data['name'],
        ':staff_number' => $data['staff_number'],
        ':beds_number' => $data['beds_number'],
        ':equipments_number' => $data['equipments_number']
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Department updated successfully'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Department not found'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?> 