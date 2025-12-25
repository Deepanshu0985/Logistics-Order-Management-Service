package com.logistics.ordermanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "order_audit_logs", indexes = {
        @Index(name = "idx_audit_order_id", columnList = "order_id"),
        @Index(name = "idx_audit_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "order_number", length = 50)
    private String orderNumber;

    @Column(name = "action", nullable = false, length = 50)
    private String action; // CREATED, STATUS_CHANGED, PARTNER_ASSIGNED, CANCELLED

    @Column(name = "field_name", length = 50)
    private String fieldName; // e.g., "status", "deliveryPartnerId"

    @Column(name = "old_value", length = 255)
    private String oldValue;

    @Column(name = "new_value", length = 255)
    private String newValue;

    @Column(name = "performed_by", length = 100)
    private String performedBy; // User email or "SYSTEM"

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
