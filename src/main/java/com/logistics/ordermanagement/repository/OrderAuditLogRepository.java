package com.logistics.ordermanagement.repository;

import com.logistics.ordermanagement.entity.OrderAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderAuditLogRepository extends JpaRepository<OrderAuditLog, Long> {

    List<OrderAuditLog> findByOrderIdOrderByCreatedAtDesc(Long orderId);

    Page<OrderAuditLog> findByOrderIdOrderByCreatedAtDesc(Long orderId, Pageable pageable);

    List<OrderAuditLog> findByOrderNumberOrderByCreatedAtDesc(String orderNumber);
}
