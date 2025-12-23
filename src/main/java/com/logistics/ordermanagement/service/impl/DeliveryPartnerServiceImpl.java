package main.java.com.logistics.ordermanagement.service.impl;

import com.logistics.ordermanagement.dto.request.CreateDeliveryPartnerRequest;
import com.logistics.ordermanagement.dto.request.UpdatePartnerStatusRequest;
import com.logistics.ordermanagement.dto.response.DeliveryPartnerResponse;
import com.logistics.ordermanagement.dto.response.PagedResponse;
import com.logistics.ordermanagement.entity.DeliveryPartner;
import com.logistics.ordermanagement.enums.PartnerStatus;
import com.logistics.ordermanagement.exception.BadRequestException;
import com.logistics.ordermanagement.exception.ResourceNotFoundException;
import com.logistics.ordermanagement.repository.DeliveryPartnerRepository;
import com.logistics.ordermanagement.service.DeliveryPartnerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeliveryPartnerServiceImpl implements DeliveryPartnerService {

    private final DeliveryPartnerRepository deliveryPartnerRepository;

    @Override
    @Transactional
    public DeliveryPartnerResponse createDeliveryPartner(CreateDeliveryPartnerRequest request) {
        log.info("Creating new delivery partner: {}", request.getName());

        if (deliveryPartnerRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("A delivery partner with this phone number already exists");
        }

        DeliveryPartner partner = DeliveryPartner.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .city(request.getCity().toUpperCase())
                .status(PartnerStatus.AVAILABLE)
                .vehicleType(request.getVehicleType())
                .build();

        DeliveryPartner savedPartner = deliveryPartnerRepository.save(partner);
        log.info("Delivery partner created successfully with id: {}", savedPartner.getId());

        return mapToDeliveryPartnerResponse(savedPartner);
    }

    @Override
    @Transactional(readOnly = true)
    public DeliveryPartnerResponse getDeliveryPartnerById(Long id) {
        log.debug("Fetching delivery partner by id: {}", id);
        DeliveryPartner partner = deliveryPartnerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DeliveryPartner", "id", id));
        return mapToDeliveryPartnerResponse(partner);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DeliveryPartnerResponse> getAllDeliveryPartners(int page, int size) {
        log.debug("Fetching all delivery partners - page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<DeliveryPartner> partners = deliveryPartnerRepository.findAll(pageable);
        return mapToPagedResponse(partners);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DeliveryPartnerResponse> getDeliveryPartnersByCity(String city, int page, int size) {
        log.debug("Fetching delivery partners by city: {} - page: {}, size: {}", city, page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<DeliveryPartner> partners = deliveryPartnerRepository.findByCity(city.toUpperCase(), pageable);
        return mapToPagedResponse(partners);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DeliveryPartnerResponse> getDeliveryPartnersByStatus(PartnerStatus status, int page,
            int size) {
        log.debug("Fetching delivery partners by status: {} - page: {}, size: {}", status, page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<DeliveryPartner> partners = deliveryPartnerRepository.findByStatus(status, pageable);
        return mapToPagedResponse(partners);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeliveryPartnerResponse> getAvailablePartnersByCity(String city) {
        log.debug("Fetching available delivery partners by city: {}", city);
        List<DeliveryPartner> partners = deliveryPartnerRepository
                .findByCityAndStatus(city.toUpperCase(), PartnerStatus.AVAILABLE);
        return partners.stream().map(this::mapToDeliveryPartnerResponse).toList();
    }

    @Override
    @Transactional
    public DeliveryPartnerResponse updatePartnerStatus(Long id, UpdatePartnerStatusRequest request) {
        log.info("Updating delivery partner status for id: {} to status: {}", id, request.getStatus());

        DeliveryPartner partner = deliveryPartnerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DeliveryPartner", "id", id));

        partner.setStatus(request.getStatus());
        DeliveryPartner updatedPartner = deliveryPartnerRepository.save(partner);

        log.info("Delivery partner status updated successfully for id: {}", id);
        return mapToDeliveryPartnerResponse(updatedPartner);
    }

    private DeliveryPartnerResponse mapToDeliveryPartnerResponse(DeliveryPartner partner) {
        return DeliveryPartnerResponse.builder()
                .id(partner.getId())
                .name(partner.getName())
                .phone(partner.getPhone())
                .email(partner.getEmail())
                .city(partner.getCity())
                .status(partner.getStatus())
                .vehicleType(partner.getVehicleType())
                .createdAt(partner.getCreatedAt())
                .build();
    }

    private PagedResponse<DeliveryPartnerResponse> mapToPagedResponse(Page<DeliveryPartner> partners) {
        return PagedResponse.<DeliveryPartnerResponse>builder()
                .content(partners.getContent().stream().map(this::mapToDeliveryPartnerResponse).toList())
                .page(partners.getNumber())
                .size(partners.getSize())
                .totalElements(partners.getTotalElements())
                .totalPages(partners.getTotalPages())
                .last(partners.isLast())
                .build();
    }
}
