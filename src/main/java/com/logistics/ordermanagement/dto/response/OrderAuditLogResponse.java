package com.logistics.ordermanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderAuditLogResponse {

    private Long id;
    private Long orderId;
    private String orderNumber;
    private String action;
    private String fieldName;
    private String oldValue;
    private String newValue;
    private String performedBy;
    private String notes;
    private LocalDateTime createdAt;
}
