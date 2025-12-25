package com.logistics.ordermanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * WebSocket notification payload for order updates
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderNotification {

    private String type; // ORDER_CREATED, STATUS_CHANGED, PARTNER_ASSIGNED, ORDER_CANCELLED
    private Long orderId;
    private String orderNumber;
    private String message;
    private String oldStatus;
    private String newStatus;
    private String partnerName;
    private LocalDateTime timestamp;
}
