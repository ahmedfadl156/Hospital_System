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
} catch (PDOException $e) {
    echo json_encode([
        "error" => "Connection failed: " . $e->getMessage(),
        "success" => false
    ]);
    exit();
}

try {
    $query = "SELECT id, user_name, doctor_name, department_name, date, time, status FROM appointments ORDER BY date DESC"; 

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Ensure each appointment has a status
    foreach ($appointments as &$appointment) {
        if (!isset($appointment['status'])) {
            $appointment['status'] = 'pending';
        }
    }

    echo json_encode([
        "success" => true,
        "appointments" => $appointments
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "error" => "Query failed: " . $e->getMessage()
    ]);
}

$conn = null;
?> 