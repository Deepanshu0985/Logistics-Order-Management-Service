package main.java.com.logistics.ordermanagement.dto.response;

import com.logistics.ordermanagement.enums.PartnerStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryPartnerResponse {

    private Long id;
    private String name;
    private String phone;
    private String email;
    private String city;
    private PartnerStatus status;
    private String vehicleType;
    private LocalDateTime createdAt;
}
