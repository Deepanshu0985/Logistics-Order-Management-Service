package com.logistics.ordermanagement.entity;

import com.logistics.ordermanagement.enums.PartnerStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_partners", indexes = {
        @Index(name = "idx_partner_city", columnList = "city"),
        @Index(name = "idx_partner_status", columnList = "status"),
        @Index(name = "idx_partner_city_status", columnList = "city, status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryPartner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "phone", unique = true, nullable = false, length = 15)
    private String phone;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "city", nullable = false, length = 50)
    private String city;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private PartnerStatus status;

    @Column(name = "vehicle_type", length = 20)
    private String vehicleType;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.status == null) {
            this.status = PartnerStatus.AVAILABLE;
        }
    }
}
