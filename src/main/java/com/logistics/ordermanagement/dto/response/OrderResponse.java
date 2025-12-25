package com.logistics.ordermanagement.dto.response;

import com.logistics.ordermanagement.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long id;
    private String orderNumber;
    private String customerName;
    private String customerPhone;
    private String pickupAddress;
    private String deliveryAddress;
    private String city;
    private OrderStatus status;
    private DeliveryPartnerResponse deliveryPartner;
    private String cancellationReason;
    private LocalDateTime cancelledAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
