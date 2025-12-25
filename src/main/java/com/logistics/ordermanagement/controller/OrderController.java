package com.logistics.ordermanagement.controller;

import com.logistics.ordermanagement.dto.request.AssignPartnerRequest;
import com.logistics.ordermanagement.dto.request.CancelOrderRequest;
import com.logistics.ordermanagement.dto.request.CreateOrderRequest;
import com.logistics.ordermanagement.dto.request.UpdateOrderStatusRequest;
import com.logistics.ordermanagement.dto.response.ApiResponse;
import com.logistics.ordermanagement.dto.response.OrderAuditLogResponse;
import com.logistics.ordermanagement.dto.response.OrderResponse;
import com.logistics.ordermanagement.dto.response.PagedResponse;
import com.logistics.ordermanagement.enums.OrderStatus;
import com.logistics.ordermanagement.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order management endpoints for creating, retrieving, and updating delivery orders")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Create a new order", description = "Creates a new delivery order with customer details and addresses")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Order created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request) {
        log.info("Received request to create order for customer: {}", request.getCustomerName());
        OrderResponse response = orderService.createOrder(request);
        return new ResponseEntity<>(
                ApiResponse.success(response, "Order created successfully"),
                HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Retrieves a specific order by its unique identifier")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Order found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @Parameter(description = "Order ID") @PathVariable Long id) {
        log.info("Received request to get order by id: {}", id);
        OrderResponse response = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/number/{orderNumber}")
    @Operation(summary = "Get order by order number", description = "Retrieves an order by its unique order number (e.g., ORD-A1B2C3D4)")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByOrderNumber(
            @Parameter(description = "Unique order number") @PathVariable String orderNumber) {
        log.info("Received request to get order by order number: {}", orderNumber);
        OrderResponse response = orderService.getOrderByOrderNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @Operation(summary = "Get all orders", description = "Retrieves paginated list of orders with optional city and status filters")
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponse>>> getOrders(
            @Parameter(description = "Filter by city name") @RequestParam(required = false) String city,
            @Parameter(description = "Filter by order status") @RequestParam(required = false) OrderStatus status,
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
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
    @Operation(summary = "Update order status", description = "Updates the status of an order (follows valid transitions: PLACED → ASSIGNED → PICKED → DELIVERED)")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Status updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status transition"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @Parameter(description = "Order ID") @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        log.info("Received request to update order status for id: {} to status: {}", id, request.getStatus());
        OrderResponse response = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Order status updated successfully"));
    }

    @PutMapping("/{id}/assign")
    @Operation(summary = "Assign delivery partner", description = "Assigns an available delivery partner to an order")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Partner assigned successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Partner not available or city mismatch"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Order or partner not found")
    })
    public ResponseEntity<ApiResponse<OrderResponse>> assignDeliveryPartner(
            @Parameter(description = "Order ID") @PathVariable Long id,
            @Valid @RequestBody AssignPartnerRequest request) {
        log.info("Received request to assign delivery partner {} to order {}",
                request.getDeliveryPartnerId(), id);
        OrderResponse response = orderService.assignDeliveryPartner(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Delivery partner assigned successfully"));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel an order", description = "Cancels an order that hasn't been delivered yet. Releases any assigned partner.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Order cancelled successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Order cannot be cancelled (already delivered)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @Parameter(description = "Order ID") @PathVariable Long id,
            @Valid @RequestBody CancelOrderRequest request) {
        log.info("Received request to cancel order {} with reason: {}", id, request.getReason());
        OrderResponse response = orderService.cancelOrder(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Order cancelled successfully"));
    }

    @GetMapping("/{id}/history")
    @Operation(summary = "Get order history", description = "Retrieves the complete audit history of an order including all status changes and events")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Order history retrieved"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<ApiResponse<List<OrderAuditLogResponse>>> getOrderHistory(
            @Parameter(description = "Order ID") @PathVariable Long id) {
        log.info("Received request to get history for order id: {}", id);
        List<OrderAuditLogResponse> response = orderService.getOrderHistory(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
