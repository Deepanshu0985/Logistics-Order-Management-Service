package com.logistics.ordermanagement.controller;

import com.logistics.ordermanagement.dto.request.AssignPartnerRequest;
import com.logistics.ordermanagement.dto.request.CreateOrderRequest;
import com.logistics.ordermanagement.dto.request.UpdateOrderStatusRequest;
import com.logistics.ordermanagement.dto.response.ApiResponse;
import com.logistics.ordermanagement.dto.response.OrderResponse;
import com.logistics.ordermanagement.dto.response.PagedResponse;
import com.logistics.ordermanagement.enums.OrderStatus;
import com.logistics.ordermanagement.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request) {
        log.info("Received request to create order for customer: {}", request.getCustomerName());
        OrderResponse response = orderService.createOrder(request);
        return new ResponseEntity<>(
                ApiResponse.success(response, "Order created successfully"),
                HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        log.info("Received request to get order by id: {}", id);
        OrderResponse response = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByOrderNumber(
            @PathVariable String orderNumber) {
        log.info("Received request to get order by order number: {}", orderNumber);
        OrderResponse response = orderService.getOrderByOrderNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponse>>> getOrders(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Received request to get orders - city: {}, status: {}, page: {}, size: {}",
                city, status, page, size);

        PagedResponse<OrderResponse> response;

        if (city != null && status != null) {
            response = orderService.getOrdersByCityAndStatus(city, status, page, size);
        } else if (city != null) {
            response = orderService.getOrdersByCity(city, page, size);
        } else if (status != null) {
            response = orderService.getOrdersByStatus(status, page, size);
        } else {
            response = orderService.getAllOrders(page, size);
        }

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        log.info("Received request to update order status for id: {} to status: {}", id, request.getStatus());
        OrderResponse response = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Order status updated successfully"));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<OrderResponse>> assignDeliveryPartner(
            @PathVariable Long id,
            @Valid @RequestBody AssignPartnerRequest request) {
        log.info("Received request to assign delivery partner {} to order {}",
                request.getDeliveryPartnerId(), id);
        OrderResponse response = orderService.assignDeliveryPartner(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Delivery partner assigned successfully"));
    }
}
