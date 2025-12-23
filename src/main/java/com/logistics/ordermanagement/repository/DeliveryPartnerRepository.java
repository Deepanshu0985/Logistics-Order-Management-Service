package com.logistics.ordermanagement.repository;

import com.logistics.ordermanagement.entity.DeliveryPartner;
import com.logistics.ordermanagement.enums.PartnerStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryPartnerRepository extends JpaRepository<DeliveryPartner, Long> {

    Optional<DeliveryPartner> findByPhone(String phone);

    boolean existsByPhone(String phone);

    Page<DeliveryPartner> findByCity(String city, Pageable pageable);

    Page<DeliveryPartner> findByStatus(PartnerStatus status, Pageable pageable);

    List<DeliveryPartner> findByCityAndStatus(String city, PartnerStatus status);

    Page<DeliveryPartner> findByCityAndStatus(String city, PartnerStatus status, Pageable pageable);
}
