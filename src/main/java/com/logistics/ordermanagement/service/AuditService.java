package com.logistics.ordermanagement.service;

import com.logistics.ordermanagement.dto.response.OrderAuditLogResponse;
import com.logistics.ordermanagement.entity.Order;
import com.logistics.ordermanagement.entity.OrderAuditLog;
import com.logistics.ordermanagement.repository.OrderAuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditService {

    private final OrderAuditLogRepository auditLogRepository;

    @Transactional
    public void logOrderCreated(Order order) {
        OrderAuditLog auditLog = OrderAuditLog.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .action("CREATED")
                .fieldName("order")
                .newValue("Order created for " + order.getCustomerName())
                .performedBy(getCurrentUser())
                .notes("New order placed for delivery to " + order.getCity())
                .build();

        auditLogRepository.save(auditLog);
        log.info("Audit log created for order: {}", order.getOrderNumber());
    }

    @Transactional
    public void logStatusChange(Order order, String oldStatus, String newStatus) {
        OrderAuditLog auditLog = OrderAuditLog.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .action("STATUS_CHANGED")
                .fieldName("status")
                .oldValue(oldStatus)
                .newValue(newStatus)
                .performedBy(getCurrentUser())
                .notes("Order status changed from " + oldStatus + " to " + newStatus)
                .build();

        auditLogRepository.save(auditLog);
        log.info("Status change logged for order: {} ({} -> {})", order.getOrderNumber(), oldStatus, newStatus);
    }

    @Transactional
    public void logPartnerAssigned(Order order, String partnerName, Long partnerId) {
        OrderAuditLog auditLog = OrderAuditLog.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .action("PARTNER_ASSIGNED")
                .fieldName("deliveryPartnerId")
                .oldValue(null)
                .newValue(partnerId.toString())
                .performedBy(getCurrentUser())
                .notes("Delivery partner '" + partnerName + "' assigned to order")
                .build();

        auditLogRepository.save(auditLog);
        log.info("Partner assignment logged for order: {} (Partner: {})", order.getOrderNumber(), partnerName);
    }

    @Transactional
    public void logOrderCancelled(Order order, String reason) {
        OrderAuditLog auditLog = OrderAuditLog.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .action("CANCELLED")
                .fieldName("status")
                .oldValue(order.getStatus().name())
                .newValue("CANCELLED")
                .performedBy(getCurrentUser())
                .notes("Order cancelled. Reason: " + reason)
                .build();

        auditLogRepository.save(auditLog);
        log.info("Cancellation logged for order: {} (Reason: {})", order.getOrderNumber(), reason);
    }

    public List<OrderAuditLogResponse> getOrderHistory(Long orderId) {
        List<OrderAuditLog> logs = auditLogRepository.findByOrderIdOrderByCreatedAtDesc(orderId);
        return logs.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private OrderAuditLogResponse mapToResponse(OrderAuditLog log) {
        return OrderAuditLogResponse.builder()
                .id(log.getId())
                .orderId(log.getOrderId())
                .orderNumber(log.getOrderNumber())
                .action(log.getAction())
                .fieldName(log.getFieldName())
                .oldValue(log.getOldValue())
                .newValue(log.getNewValue())
                .performedBy(log.getPerformedBy())
                .notes(log.getNotes())
                .createdAt(log.getCreatedAt())
                .build();
    }

    private String getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return auth.getName();
        }
        return "SYSTEM";
    }
}
