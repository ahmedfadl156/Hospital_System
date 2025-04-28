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
    
    if (!isset($data['name']) || !isset($data['staff_number']) || !isset($data['beds_number']) || !isset($data['equipments_number'])) {
        throw new Exception('All fields are required');
    }

    $query = "INSERT INTO departments (name, staff_number, beds_number, equipments_number) 
              VALUES (:name, :staff_number, :beds_number, :equipments_number)";
    
    $stmt = $conn->prepare($query);
    $stmt->execute([
        ':name' => $data['name'],
        ':staff_number' => $data['staff_number'],
        ':beds_number' => $data['beds_number'],
        ':equipments_number' => $data['equipments_number']
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Department added successfully',
        'id' => $conn->lastInsertId()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?> 