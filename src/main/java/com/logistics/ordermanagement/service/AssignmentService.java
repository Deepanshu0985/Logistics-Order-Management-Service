package com.logistics.ordermanagement.service;

import com.logistics.ordermanagement.entity.DeliveryPartner;
import com.logistics.ordermanagement.entity.Order;
import com.logistics.ordermanagement.enums.OrderStatus;
import com.logistics.ordermanagement.enums.PartnerStatus;
import com.logistics.ordermanagement.repository.DeliveryPartnerRepository;
import com.logistics.ordermanagement.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service for intelligent partner assignment using various algorithms
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final DeliveryPartnerRepository deliveryPartnerRepository;
    private final OrderRepository orderRepository;
    private final AuditService auditService;

    /**
     * Automatically assigns the best available partner to an order.
     * Uses a combination of factors:
     * 1. Same city as order
     * 2. AVAILABLE status
     * 3. Least number of completed orders (load balancing)
     * 
     * @param order The order to assign
     * @return Optional containing the assigned partner, or empty if none available
     */
    @Transactional
    public Optional<DeliveryPartner> autoAssignPartner(Order order) {
        log.info("Auto-assigning partner for order: {}", order.getOrderNumber());

        // Find available partners in the same city
        List<DeliveryPartner> availablePartners = deliveryPartnerRepository
                .findByCityAndStatus(order.getCity(), PartnerStatus.AVAILABLE);

        if (availablePartners.isEmpty()) {
            log.warn("No available partners found for order {} in city {}",
                    order.getOrderNumber(), order.getCity());
            return Optional.empty();
        }

        // Load balancing: find partner with fewest active orders
        // For simplicity, we pick the first available one (can be enhanced with more
        // complex logic)
        DeliveryPartner selectedPartner = selectBestPartner(availablePartners);

        // Assign partner to order
        order.setDeliveryPartner(selectedPartner);
        order.setStatus(OrderStatus.ASSIGNED);
        selectedPartner.setStatus(PartnerStatus.BUSY);

        deliveryPartnerRepository.save(selectedPartner);
        Order updatedOrder = orderRepository.save(order);

        // Log audit
        auditService.logPartnerAssigned(updatedOrder, selectedPartner.getName(), selectedPartner.getId());
        auditService.logStatusChange(updatedOrder, OrderStatus.PLACED.name(), OrderStatus.ASSIGNED.name());

        log.info("Auto-assigned partner {} to order {}",
                selectedPartner.getName(), order.getOrderNumber());

        return Optional.of(selectedPartner);
    }

    /**
     * Selects the best partner from a list of available partners.
     * Currently uses a simple first-available strategy, but can be enhanced with:
     * - Least orders today
     * - Rating/performance score
     * - Distance-based selection (if coordinates available)
     * - Partner preferences
     */
    private DeliveryPartner selectBestPartner(List<DeliveryPartner> partners) {
        // Currently using simple first-available strategy
        // Can be enhanced with more sophisticated algorithms

        // Sort by ID (oldest partner first - they've been waiting longest)
        return partners.stream()
                .min((p1, p2) -> p1.getId().compareTo(p2.getId()))
                .orElse(partners.get(0));
    }

    /**
     * Gets the count of available partners for a specific city
     */
    public long getAvailablePartnerCount(String city) {
        return deliveryPartnerRepository.findByCityAndStatus(city.toUpperCase(), PartnerStatus.AVAILABLE).size();
    }

    /**
     * Checks if auto-assignment is possible for a given city
     */
    public boolean canAutoAssign(String city) {
        return getAvailablePartnerCount(city) > 0;
    }
}
