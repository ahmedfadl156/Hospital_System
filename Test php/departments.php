<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
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

    $method = $_SERVER['REQUEST_METHOD'];
    $data = json_decode(file_get_contents('php://input'), true);

    switch ($method) {
        case 'GET':
            // Get all departments
            $query = "SELECT * FROM departments";
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $departments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'status' => 'success',
                'departments' => $departments
            ]);
            break;

        case 'POST':
            // Add new department
            if (!isset($data['dep_name']) || !isset($data['staff_num']) || !isset($data['beds_num']) || !isset($data['equipments'])) {
                throw new Exception('All fields are required');
            }

            $query = "INSERT INTO departments (dep_name, staff_num, beds_num, equipments) 
                      VALUES (:dep_name, :staff_num, :beds_num, :equipments)";
            
            $stmt = $conn->prepare($query);
            $stmt->execute([
                ':dep_name' => $data['dep_name'],
                ':staff_num' => $data['staff_num'],
                ':beds_num' => $data['beds_num'],
                ':equipments' => $data['equipments']
            ]);

            echo json_encode([
                'status' => 'success',
                'message' => 'Department added successfully',
                'id' => $conn->lastInsertId()
            ]);
            break;

        case 'PUT':
            // Update department
            if (!isset($data['id']) || !isset($data['dep_name']) || !isset($data['staff_num']) || !isset($data['beds_num']) || !isset($data['equipments'])) {
                throw new Exception('All fields are required');
            }

            $query = "UPDATE departments 
                      SET dep_name = :dep_name, 
                          staff_num = :staff_num, 
                          beds_num = :beds_num, 
                          equipments = :equipments 
                      WHERE id = :id";
            
            $stmt = $conn->prepare($query);
            $stmt->execute([
                ':id' => $data['id'],
                ':dep_name' => $data['dep_name'],
                ':staff_num' => $data['staff_num'],
                ':beds_num' => $data['beds_num'],
                ':equipments' => $data['equipments']
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
            break;

        case 'DELETE':
            // Get the ID from the URL query parameters
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            
            if (!$id) {
                throw new Exception('Department ID is required');
            }

            $query = "DELETE FROM departments WHERE id = :id";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Department deleted successfully'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Department not found'
                ]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode([
                'status' => 'error',
                'message' => 'Method not allowed'
            ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?> 