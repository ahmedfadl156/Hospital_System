<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$host = "localhost";
$db_name = "hospital_managment";
$username = "root";
$password = "";

$conn = new mysqli($host, $username, $password, $db_name);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['name']) || !isset($data['department']) || !isset($data['email']) || !isset($data['doctor']) || !isset($data['created_at']) || !isset($data['time'])) {
    echo json_encode(["status" => "error", "message" => "Invalid input", "received" => $data]);
    exit;
}

$user_name = $data['name'];
$time = $data['time'];
$department_name = $data['department'];
$email = $data['email'];
$doctor_name = $data['doctor'];
$date = $data['created_at'];
$status = 'pending';

if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $date)) {
    echo json_encode(["status" => "error", "message" => "Invalid date format. Use 'YYYY-MM-DD'"]);
    exit;
}

$insert_query = $conn->prepare("INSERT INTO appointments (user_name, department_name, email, doctor_name, date, time , status) VALUES (?, ?, ?, ?, ?, ? , ?)");
$insert_query->bind_param("sssssss", $user_name, $department_name, $email, $doctor_name, $date, $time , $status);
$execute_result = $insert_query->execute();

if ($execute_result) {
    echo json_encode(["status" => "success", "message" => "Appointment added"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error adding appointment: " . $conn->error]);
}

$conn->close();
?>