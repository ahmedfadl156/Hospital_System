<?php
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $mail = new PHPMailer(true);

    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'af38765220@gmail.com'; // Replace with your Gmail
    $mail->Password = 'rhei plvp ixag mjhd'; // Replace with your Gmail App Password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Enable debugging
    $mail->SMTPDebug = 2;
    $mail->Debugoutput = function($str, $level) {
        echo "SMTP Debug: $str<br>";
    };

    // Recipients
    $mail->setFrom('af38765220@gmail.com', 'Hospital Management System');
    $mail->addAddress('af38765222@gmail.com');

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Test Email';
    $mail->Body = 'This is a test email';

    echo "Attempting to send email...<br>";
    
    if ($mail->send()) {
        echo "Email sent successfully!";
    } else {
        echo "Failed to send email: " . $mail->ErrorInfo;
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>