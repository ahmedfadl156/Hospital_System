<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Log the received data
    $rawData = file_get_contents('php://input');
    error_log("Received data: " . $rawData);
    
    $data = json_decode($rawData, true);
    error_log("Decoded data: " . print_r($data, true));

    if (!isset($data['email']) || !isset($data['subject']) || !isset($data['message'])) {
        throw new Exception('Missing required fields: ' . print_r($data, true));
    }

    $mail = new PHPMailer(true);

    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'hospital.system@gmail.com'; // Replace with your Gmail
    $mail->Password = 'your-app-password'; // Replace with your Gmail App Password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Enable debugging
    $mail->SMTPDebug = 2;
    $mail->Debugoutput = function($str, $level) {
        error_log("SMTP Debug: $str");
    };

    // Recipients
    $mail->setFrom('hospital.system@gmail.com', 'Hospital Management System');
    $mail->addAddress($data['email']);

    // Content
    $mail->isHTML(true);
    $mail->Subject = $data['subject'];
    $mail->Body = $data['message'];

    error_log("Attempting to send email to: " . $data['email']);
    
    if ($mail->send()) {
        error_log("Email sent successfully to: " . $data['email']);
        echo json_encode(['status' => 'success', 'message' => 'Email sent successfully']);
    } else {
        error_log("Failed to send email: " . $mail->ErrorInfo);
        throw new Exception('Failed to send email: ' . $mail->ErrorInfo);
    }
} catch (Exception $e) {
    error_log("Error in send_email.php: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?> 