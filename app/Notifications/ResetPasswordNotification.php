<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

// Custom reset notification pointing at the React app's /reset-password route
// instead of Laravel's default web route (which doesn't exist in this API-only app).
class ResetPasswordNotification extends Notification
{
    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');
        $url = $frontendUrl.'/reset-password?token='.$this->token.'&email='.urlencode($notifiable->getEmailForPasswordReset());

        return (new MailMessage)
            ->subject('Reset Your Password — Springfield School Register')
            ->line('You requested a password reset.')
            ->action('Reset Password', $url)
            ->line('If you did not request this, no further action is needed.');
    }
}
