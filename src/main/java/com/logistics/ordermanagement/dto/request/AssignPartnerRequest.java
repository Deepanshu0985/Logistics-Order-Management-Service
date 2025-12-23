package com.logistics.ordermanagement.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignPartnerRequest {

    @NotNull(message = "Delivery partner ID is required")
    private Long deliveryPartnerId;
}
