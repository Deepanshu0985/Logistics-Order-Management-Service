package com.logistics.ordermanagement.service.impl;

import com.logistics.ordermanagement.dto.request.AssignPartnerRequest;
import com.logistics.ordermanagement.dto.request.CreateOrderRequest;
import com.logistics.ordermanagement.dto.request.UpdateOrderStatusRequest;
import com.logistics.ordermanagement.dto.response.DeliveryPartnerResponse;
import com.logistics.ordermanagement.dto.response.OrderResponse;
import com.logistics.ordermanagement.dto.response.PagedResponse;
import com.logistics.ordermanagement.entity.DeliveryPartner;
import com.logistics.ordermanagement.entity.Order;
import com.logistics.ordermanagement.enums.OrderStatus;
import com.logistics.ordermanagement.enums.PartnerStatus;
import com.logistics.ordermanagement.exception.BadRequestException;
import com.logistics.ordermanagement.exception.InvalidStatusTransitionException;
import com.logistics.ordermanagement.exception.ResourceNotFoundException;
import com.logistics.ordermanagement.repository.DeliveryPartnerRepository;
import com.logistics.ordermanagement.repository.OrderRepository;
import com.logistics.ordermanagement.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final DeliveryPartnerRepository deliveryPartnerRepository;

    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        log.info("Creating new order for customer: {}", request.getCustomerName());

        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .pickupAddress(request.getPickupAddress())
                .deliveryAddress(request.getDeliveryAddress())
                .city(request.getCity().toUpperCase())
                .status(OrderStatus.PLACED)
                .build();

        Order savedOrder = orderRepository.save(order);
        log.info("Order created successfully with order number: {}", savedOrder.getOrderNumber());

        return mapToOrderResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        log.debug("Fetching order by id: {}", id);
        Order order = orderRepository.findByIdWithDeliveryPartner(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        return mapToOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderByOrderNumber(String orderNumber) {
        log.debug("Fetching order by order number: {}", orderNumber);
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));
        return mapToOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> getAllOrders(int page, int size) {
        log.debug("Fetching all orders - page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.findAll(pageable);
        return mapToPagedResponse(orders);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> getOrdersByCity(String city, int page, int size) {
        log.debug("Fetching orders by city: {} - page: {}, size: {}", city, page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.findByCity(city.toUpperCase(), pageable);
        return mapToPagedResponse(orders);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> getOrdersByStatus(OrderStatus status, int page, int size) {
        log.debug("Fetching orders by status: {} - page: {}, size: {}", status, page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.findByStatus(status, pageable);
        return mapToPagedResponse(orders);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> getOrdersByCityAndStatus(String city, OrderStatus status, int page, int size) {
        log.debug("Fetching orders by city: {} and status: {} - page: {}, size: {}", city, status, page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.findByCityAndStatus(city.toUpperCase(), status, pageable);
        return mapToPagedResponse(orders);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request) {
        log.info("Updating order status for order id: {} to status: {}", id, request.getStatus());

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        validateStatusTransition(order.getStatus(), request.getStatus());

        order.setStatus(request.getStatus());

        // If order is delivered, mark partner as available
        if (request.getStatus() == OrderStatus.DELIVERED && order.getDeliveryPartner() != null) {
            order.getDeliveryPartner().setStatus(PartnerStatus.AVAILABLE);
            deliveryPartnerRepository.save(order.getDeliveryPartner());
        }

        Order updatedOrder = orderRepository.save(order);
        log.info("Order status updated successfully for order number: {}", updatedOrder.getOrderNumber());

        return mapToOrderResponse(updatedOrder);
    }

    @Override
    @Transactional
    public OrderResponse assignDeliveryPartner(Long id, AssignPartnerRequest request) {
        log.info("Assigning delivery partner {} to order {}", request.getDeliveryPartnerId(), id);

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        if (order.getStatus() != OrderStatus.PLACED) {
            throw new BadRequestException("Order can only be assigned when status is PLACED");
        }

        DeliveryPartner partner = deliveryPartnerRepository.findById(request.getDeliveryPartnerId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("DeliveryPartner", "id", request.getDeliveryPartnerId()));

        if (partner.getStatus() != PartnerStatus.AVAILABLE) {
            throw new BadRequestException("Delivery partner is not available");
        }

        // Assign partner and update statuses
        order.setDeliveryPartner(partner);
        order.setStatus(OrderStatus.ASSIGNED);
        partner.setStatus(PartnerStatus.BUSY);

        deliveryPartnerRepository.save(partner);
        Order updatedOrder = orderRepository.save(order);

        log.info("Delivery partner {} assigned to order {} successfully", partner.getName(), order.getOrderNumber());

        return mapToOrderResponse(updatedOrder);
    }

    private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        boolean isValid = switch (currentStatus) {
            case PLACED -> newStatus == OrderStatus.ASSIGNED;
            case ASSIGNED -> newStatus == OrderStatus.PICKED;
            case PICKED -> newStatus == OrderStatus.DELIVERED;
            case DELIVERED -> false; // Cannot transition from DELIVERED
        };

        if (!isValid) {
            throw new InvalidStatusTransitionException(currentStatus, newStatus);
        }
    }

    private String generateOrderNumber() {
        String orderNumber;
        do {
            orderNumber = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (orderRepository.existsByOrderNumber(orderNumber));
        return orderNumber;
    }

    private OrderResponse mapToOrderResponse(Order order) {
        DeliveryPartnerResponse partnerResponse = null;
        if (order.getDeliveryPartner() != null) {
            partnerResponse = DeliveryPartnerResponse.builder()
                    .id(order.getDeliveryPartner().getId())
                    .name(order.getDeliveryPartner().getName())
                    .phone(order.getDeliveryPartner().getPhone())
                    .email(order.getDeliveryPartner().getEmail())
                    .city(order.getDeliveryPartner().getCity())
                    .status(order.getDeliveryPartner().getStatus())
                    .vehicleType(order.getDeliveryPartner().getVehicleType())
                    .createdAt(order.getDeliveryPartner().getCreatedAt())
                    .build();
        }

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerName(order.getCustomerName())
                .customerPhone(order.getCustomerPhone())
                .pickupAddress(order.getPickupAddress())
                .deliveryAddress(order.getDeliveryAddress())
                .city(order.getCity())
                .status(order.getStatus())
                .deliveryPartner(partnerResponse)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private PagedResponse<OrderResponse> mapToPagedResponse(Page<Order> orders) {
        return PagedResponse.<OrderResponse>builder()
                .content(orders.getContent().stream().map(this::mapToOrderResponse).toList())
                .page(orders.getNumber())
                .size(orders.getSize())
                .totalElements(orders.getTotalElements())
                .totalPages(orders.getTotalPages())
                .last(orders.isLast())
                .build();
    }
}
