package com.logistics.ordermanagement.repository;

import com.logistics.ordermanagement.entity.Order;
import com.logistics.ordermanagement.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    Page<Order> findByCity(String city, Pageable pageable);

    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    Page<Order> findByCityAndStatus(String city, OrderStatus status, Pageable pageable);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.deliveryPartner WHERE o.id = :id")
    Optional<Order> findByIdWithDeliveryPartner(@Param("id") Long id);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.deliveryPartner WHERE o.city = :city")
    Page<Order> findByCityWithDeliveryPartner(@Param("city") String city, Pageable pageable);

    boolean existsByOrderNumber(String orderNumber);
}
