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
    $pdo = new PDO('mysql:host=localhost;dbname=hospital_managment', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id']) || !isset($data['status'])) {
        throw new Exception('Missing required fields');
    }

    $id = $data['id'];
    $status = $data['status'];

    // First get the appointment details including email
    $stmt = $pdo->prepare('SELECT * FROM appointments WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $appointment = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$appointment) {
        throw new Exception('No appointment found with the given ID');
    }

    // Update the status
    $stmt = $pdo->prepare('UPDATE appointments SET status = :status WHERE id = :id');
    $stmt->execute(['status' => $status, 'id' => $id]);

    if ($stmt->rowCount() > 0) {
        // Send email notification
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
        $mail->addAddress($appointment['email']);

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Appointment Status Update';
        $mail->Body = getEmailMessage($appointment, $status);

        if ($mail->send()) {
            echo json_encode(['status' => 'success', 'message' => 'Appointment status updated and email sent successfully']);
        } else {
            throw new Exception('Failed to send email: ' . $mail->ErrorInfo);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No appointment found with the given ID']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

function getEmailMessage($appointment, $status) {
    $message = '<html><body>';
    $message .= '<h2>Appointment Status Update</h2>';
    $message .= '<p>Dear ' . htmlspecialchars($appointment['user_name']) . ',</p>';
    
    if ($status === 'accepted') {
        $message .= '<p>We are pleased to inform you that your appointment has been accepted.</p>';
        $message .= '<p>Appointment Details:</p>';
    } else {
        $message .= '<p>We regret to inform you that your appointment has been rejected.</p>';
        $message .= '<p>Appointment Details:</p>';
    }
    
    $message .= '<ul>';
    $message .= '<li>Date: ' . htmlspecialchars($appointment['date']) . '</li>';
    $message .= '<li>Time: ' . htmlspecialchars($appointment['time']) . '</li>';
    $message .= '<li>Doctor: ' . htmlspecialchars($appointment['doctor_name']) . '</li>';
    $message .= '<li>Department: ' . htmlspecialchars($appointment['department_name']) . '</li>';
    $message .= '</ul>';
    
    if ($status === 'accepted') {
        $message .= '<p>Please arrive 15 minutes before your scheduled time.</p>';
    } else {
        $message .= '<p>Please feel free to book another appointment at your convenience.</p>';
    }
    
    $message .= '<p>Best regards,<br>Hospital Management System</p>';
    $message .= '</body></html>';
    
    return $message;
}
?> 