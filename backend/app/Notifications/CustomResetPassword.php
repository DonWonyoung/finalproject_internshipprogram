<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomResetPassword extends Notification {
    use Queueable;

    protected $url;

    public function __construct($url) {
        $this->url = $url;
    }

    public function via($notifiable) {
        return ['mail'];
    }

    public function toMail($notifiable) {
        return (new MailMessage)
            ->subject('Notifikasi Reset Kata Sandi')
            ->line('Anda menerima email ini karena kami menerima permintaan reset kata sandi untuk akun Anda.')
            ->action('Reset Kata Sandi', $this->url)
            ->line('Jika Anda tidak meminta reset kata sandi, tidak diperlukan tindakan lebih lanjut.');
    }
}