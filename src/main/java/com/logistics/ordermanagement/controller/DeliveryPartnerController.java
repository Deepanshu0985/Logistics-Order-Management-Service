package com.logistics.ordermanagement.controller;

import com.logistics.ordermanagement.dto.request.CreateDeliveryPartnerRequest;
import com.logistics.ordermanagement.dto.request.UpdatePartnerStatusRequest;
import com.logistics.ordermanagement.dto.response.ApiResponse;
import com.logistics.ordermanagement.dto.response.DeliveryPartnerResponse;
import com.logistics.ordermanagement.dto.response.PagedResponse;
import com.logistics.ordermanagement.enums.PartnerStatus;
import com.logistics.ordermanagement.service.DeliveryPartnerService;
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
@RequestMapping("/api/v1/delivery-partners")
@RequiredArgsConstructor
@Tag(name = "Delivery Partners", description = "Delivery partner management endpoints for registration and status tracking")
public class DeliveryPartnerController {

    private final DeliveryPartnerService deliveryPartnerService;

    @PostMapping
    @Operation(summary = "Register a new delivery partner", description = "Creates a new delivery partner with contact info and vehicle type")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Partner registered successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request data or phone already exists")
    })
    public ResponseEntity<ApiResponse<DeliveryPartnerResponse>> createDeliveryPartner(
            @Valid @RequestBody CreateDeliveryPartnerRequest request) {
        log.info("Received request to create delivery partner: {}", request.getName());
        DeliveryPartnerResponse response = deliveryPartnerService.createDeliveryPartner(request);
        return new ResponseEntity<>(
                ApiResponse.success(response, "Delivery partner created successfully"),
                HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get partner by ID", description = "Retrieves a specific delivery partner by their unique identifier")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Partner found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Partner not found")
    })
    public ResponseEntity<ApiResponse<DeliveryPartnerResponse>> getDeliveryPartnerById(
            @Parameter(description = "Partner ID") @PathVariable Long id) {
        log.info("Received request to get delivery partner by id: {}", id);
        DeliveryPartnerResponse response = deliveryPartnerService.getDeliveryPartnerById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @Operation(summary = "Get all delivery partners", description = "Retrieves paginated list of delivery partners with optional city and status filters")
    public ResponseEntity<ApiResponse<PagedResponse<DeliveryPartnerResponse>>> getDeliveryPartners(
            @Parameter(description = "Filter by city name") @RequestParam(required = false) String city,
            @Parameter(description = "Filter by partner status (AVAILABLE, BUSY, OFFLINE)") @RequestParam(required = false) PartnerStatus status,
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
        log.info("Received request to get delivery partners - city: {}, status: {}, page: {}, size: {}",
                city, status, page, size);

        PagedResponse<DeliveryPartnerResponse> response;

        if (city != null) {
            response = deliveryPartnerService.getDeliveryPartnersByCity(city, page, size);
        } else if (status != null) {
            response = deliveryPartnerService.getDeliveryPartnersByStatus(status, page, size);
        } else {
            response = deliveryPartnerService.getAllDeliveryPartners(page, size);
        }

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/available")
    @Operation(summary = "Get available partners by city", description = "Retrieves all delivery partners with AVAILABLE status in a specific city")
    public ResponseEntity<ApiResponse<List<DeliveryPartnerResponse>>> getAvailablePartnersByCity(
            @Parameter(description = "City name to filter available partners") @RequestParam String city) {
        log.info("Received request to get available delivery partners by city: {}", city);
        List<DeliveryPartnerResponse> response = deliveryPartnerService.getAvailablePartnersByCity(city);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update partner status", description = "Updates the status of a delivery partner (AVAILABLE, BUSY, OFFLINE)")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Status updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Partner not found")
    })
    public ResponseEntity<ApiResponse<DeliveryPartnerResponse>> updatePartnerStatus(
            @Parameter(description = "Partner ID") @PathVariable Long id,
            @Valid @RequestBody UpdatePartnerStatusRequest request) {
        log.info("Received request to update delivery partner status for id: {} to status: {}",
                id, request.getStatus());
        DeliveryPartnerResponse response = deliveryPartnerService.updatePartnerStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Delivery partner status updated successfully"));
    }
}
