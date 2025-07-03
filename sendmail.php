<?php
<?php
header('Content-Type: application/json');
header('Cache-Control: no-cache, no-store, must-revalidate');

try {
    $name = isset($_POST['name']) ? trim($_POST['name']) : 'Не указано';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    
    if (empty($phone)) {
        throw new Exception('Не указан телефон');
    }
    $log_dir = __DIR__ . '/logs';
    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    
    $log_file = $log_dir . '/form_submissions.log';
    $log_data = date('Y-m-d H:i:s') . " | Имя: {$name} | Телефон: {$phone}\n";
    
    file_put_contents($log_file, $log_data, FILE_APPEND);
    
    $to = 'ваш_email@domain.com'; // Замените на ваш email
    
    $subject = 'Новая заявка с сайта InterStyle';
    $message = "Имя: {$name}\nТелефон: {$phone}\nДата: " . date('Y-m-d H:i:s');
    $headers = "From: noreply@interstyle.kz\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    $mail_sent = mail($to, $subject, $message, $headers);
    if (!$mail_sent) {
        throw new Exception('Не удалось отправить письмо');
    }
    */
    
    echo json_encode([
        'success' => true,
        'message' => 'Заявка успешно сохранена'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>