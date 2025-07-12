<?php
require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

date_default_timezone_set('Asia/Almaty');

header('Content-Type: application/json; charset=utf-8');

$name = isset($_POST['name']) ? $_POST['name'] : '';
$phone = isset($_POST['phone']) ? $_POST['phone'] : '';

$log_dir = 'logs';
if (!is_dir($log_dir)) {
    mkdir($log_dir, 0755, true);
}
$log_file = $log_dir . '/form_submissions.log';
$log_message = date('Y-m-d H:i:s') . " | Имя: $name | Телефон: $phone\n";
file_put_contents($log_file, $log_message, FILE_APPEND);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$to_email = $_ENV['GMAIL_TO_EMAIL'] ?? '';
$app_username = $_ENV['GMAIL_APP_USERNAME'] ?? '';
$app_password = $_ENV['GMAIL_APP_PASSWORD'] ?? '';

try {
    $to = $to_email;
    $subject = 'Новая заявка с сайта InterStyle';
    $message = "Имя: $name\nТелефон: $phone\nДата: " . date('Y-m-d H:i:s');

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $app_username;
    $mail->Password = $app_password;
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';

    $mail->setFrom('noreply@interstyle.kz', 'InterStyle');
    $mail->addAddress($to);
    $mail->Subject = $subject;
    $mail->Body = $message;

    $mail_sent = $mail->send();

    $result_message = date('Y-m-d H:i:s') . " | Результат отправки: " . ($mail_sent ? "Успешно" : "Ошибка") . "\n";
    file_put_contents($log_file, $result_message, FILE_APPEND);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $error_message = $e->getMessage();
    $result_message = date('Y-m-d H:i:s') . " | Ошибка отправки: $error_message\n";
    file_put_contents($log_file, $result_message, FILE_APPEND);

    echo json_encode(['success' => false, 'error' => $error_message]);
}
?>