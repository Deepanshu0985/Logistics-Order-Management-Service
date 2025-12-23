package com.logistics.ordermanagement.dto.request;

import com.logistics.ordermanagement.enums.PartnerStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdatePartnerStatusRequest {

    @NotNull(message = "Status is required")
    private PartnerStatus status;
}
