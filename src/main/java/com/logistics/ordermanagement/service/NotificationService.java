package com.logistics.ordermanagement.service;

import com.logistics.ordermanagement.dto.response.OrderNotification;
import com.logistics.ordermanagement.entity.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Service for sending real-time WebSocket notifications about order updates
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Broadcasts an order creation notification
     */
    public void notifyOrderCreated(Order order) {
        OrderNotification notification = OrderNotification.builder()
                .type("ORDER_CREATED")
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .message("New order created: " + order.getOrderNumber())
                .newStatus(order.getStatus().name())
                .timestamp(LocalDateTime.now())
                .build();

        sendNotification(notification);
        log.info("Sent ORDER_CREATED notification for order: {}", order.getOrderNumber());
    }

    /**
     * Broadcasts an order status change notification
     */
    public void notifyStatusChange(Order order, String oldStatus, String newStatus) {
        OrderNotification notification = OrderNotification.builder()
                .type("STATUS_CHANGED")
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .message("Order " + order.getOrderNumber() + " status changed: " + oldStatus + " → " + newStatus)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .timestamp(LocalDateTime.now())
                .build();

        sendNotification(notification);
        log.info("Sent STATUS_CHANGED notification for order: {} ({} -> {})",
                order.getOrderNumber(), oldStatus, newStatus);
    }

    /**
     * Broadcasts a partner assignment notification
     */
    public void notifyPartnerAssigned(Order order, String partnerName) {
        OrderNotification notification = OrderNotification.builder()
                .type("PARTNER_ASSIGNED")
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .message("Partner " + partnerName + " assigned to order " + order.getOrderNumber())
                .partnerName(partnerName)
                .newStatus(order.getStatus().name())
                .timestamp(LocalDateTime.now())
                .build();

        sendNotification(notification);
        log.info("Sent PARTNER_ASSIGNED notification for order: {} (Partner: {})",
                order.getOrderNumber(), partnerName);
    }

    /**
     * Broadcasts an order cancellation notification
     */
    public void notifyOrderCancelled(Order order, String reason) {
        OrderNotification notification = OrderNotification.builder()
                .type("ORDER_CANCELLED")
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .message("Order " + order.getOrderNumber() + " cancelled: " + reason)
                .newStatus("CANCELLED")
                .timestamp(LocalDateTime.now())
                .build();

        sendNotification(notification);
        log.info("Sent ORDER_CANCELLED notification for order: {}", order.getOrderNumber());
    }

    /**
     * Sends a notification to the /topic/orders channel
     */
    private void sendNotification(OrderNotification notification) {
        messagingTemplate.convertAndSend("/topic/orders", notification);

        // Also send to city-specific channel
        // messagingTemplate.convertAndSend("/topic/orders/" +
        // order.getCity().toLowerCase(), notification);
    }

    /**
     * Sends a notification to a specific user
     */
    public void sendToUser(String username, OrderNotification notification) {
        messagingTemplate.convertAndSendToUser(username, "/queue/orders", notification);
        log.info("Sent notification to user: {}", username);
    }
}
