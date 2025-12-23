package com.logistics.ordermanagement.controller;

import com.logistics.ordermanagement.dto.request.CreateDeliveryPartnerRequest;
import com.logistics.ordermanagement.dto.request.UpdatePartnerStatusRequest;
import com.logistics.ordermanagement.dto.response.ApiResponse;
import com.logistics.ordermanagement.dto.response.DeliveryPartnerResponse;
import com.logistics.ordermanagement.dto.response.PagedResponse;
import com.logistics.ordermanagement.enums.PartnerStatus;
import com.logistics.ordermanagement.service.DeliveryPartnerService;
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
public class DeliveryPartnerController {

    private final DeliveryPartnerService deliveryPartnerService;

    @PostMapping
    public ResponseEntity<ApiResponse<DeliveryPartnerResponse>> createDeliveryPartner(
            @Valid @RequestBody CreateDeliveryPartnerRequest request) {
        log.info("Received request to create delivery partner: {}", request.getName());
        DeliveryPartnerResponse response = deliveryPartnerService.createDeliveryPartner(request);
        return new ResponseEntity<>(
                ApiResponse.success(response, "Delivery partner created successfully"),
                HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DeliveryPartnerResponse>> getDeliveryPartnerById(
            @PathVariable Long id) {
        log.info("Received request to get delivery partner by id: {}", id);
        DeliveryPartnerResponse response = deliveryPartnerService.getDeliveryPartnerById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<DeliveryPartnerResponse>>> getDeliveryPartners(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) PartnerStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
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
    public ResponseEntity<ApiResponse<List<DeliveryPartnerResponse>>> getAvailablePartnersByCity(
            @RequestParam String city) {
        log.info("Received request to get available delivery partners by city: {}", city);
        List<DeliveryPartnerResponse> response = deliveryPartnerService.getAvailablePartnersByCity(city);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<DeliveryPartnerResponse>> updatePartnerStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePartnerStatusRequest request) {
        log.info("Received request to update delivery partner status for id: {} to status: {}",
                id, request.getStatus());
        DeliveryPartnerResponse response = deliveryPartnerService.updatePartnerStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Delivery partner status updated successfully"));
    }
}
