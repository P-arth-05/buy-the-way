package com.buytheway.modules.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOrderConfirmation(String to, Long orderId, String productName, double total) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Order Confirmation - BuyTheWay");
        message.setText(
                "Your order has been placed successfully!\n\n" +
                "Order ID: " + orderId + "\n" +
                "Product: " + productName + "\n" +
                "Total: ₹" + total + "\n\n" +
                "Thank you for shopping with BuyTheWay!"
        );
        mailSender.send(message);
    }

    public void sendOrderStatusUpdate(String to, Long orderId, String status) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Order Update - BuyTheWay");
        message.setText(
                "Your order #" + orderId + " has been updated.\n\n" +
                "New Status: " + status + "\n\n" +
                "You can track it in your account.Thank you for shopping with BuyTheWay!"
        );
        mailSender.send(message);
    }
}