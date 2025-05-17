<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

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

    $stmt = $pdo->prepare('SELECT * FROM appointments WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $appointment = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$appointment) {
        throw new Exception('No appointment found with the given ID');
    }

    $stmt = $pdo->prepare('UPDATE appointments SET status = :status WHERE id = :id');
    $stmt->execute(['status' => $status, 'id' => $id]);

    if ($stmt->rowCount() > 0) {
        $mail = new PHPMailer(true);

        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'af38765220@gmail.com'; 
        $mail->Password = 'rhei plvp ixag mjhd'; 
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->SMTPDebug = 2;
        $mail->Debugoutput = function($str, $level) {
            error_log("SMTP Debug: $str");
        };

        $mail->setFrom('af38765220@gmail.com', 'Hospital Management System');
        $mail->addAddress($appointment['email']);

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
    $message .= '<h2>تحديث حالة الحجز</h2>';
    $message .= '<p>عزيزى ' . htmlspecialchars($appointment['user_name']) . ',</p>';
    
    if ($status === 'accepted') {
        $message .= '<p>نود اعلامك أنه بعد مراجعة موعدك فقد تم قبول موعد بنجاح ونحن فى انتظارك❤️❤️</p>';
        $message .= '<p>تفاصيل الحجز:</p>';
    } else {
        $message .= '<p>نود اعلامك أنه بعد مراجعة موعدك فللأسف قد تم رفض موعدك عشان انت اختارت معاد مش كويس ومش مناسب فاحجز تانى واختار معاد حلو ومناسب وهقبلك ان شاء الله </p>';
        $message .= '<p>تفاصيل الحجز عشان تغيرها وانت بتحجز المرة الجاية:</p>';
    }
    
    $message .= '<ul>';
    $message .= '<li>Date: ' . htmlspecialchars($appointment['date']) . '</li>';
    $message .= '<li>Time: ' . htmlspecialchars($appointment['time']) . '</li>';
    $message .= '<li>Doctor: ' . htmlspecialchars($appointment['doctor_name']) . '</li>';
    $message .= '<li>Department: ' . htmlspecialchars($appointment['department_name']) . '</li>';
    $message .= '</ul>';
    
    if ($status === 'accepted') {
        $message .= '<p>من فضلك تكون فى المستشفى قبل معادك ب 15 دقيقة على الأقل والا هندخل حد تانى وهنديك حجز فى معاد تانى</p>';
    } else {
        $message .= '<p>ممكن ان انت تحجز فى وقت تانى زى ما قولتلك ارجع للموقع واحجز من أول وجديد</p>';
    }
    
    $message .= '<p>Best regards,<br>Ahmed Fadl</p>';
    $message .= '</body></html>';
    
    return $message;
}
?>