package main.java.com.logistics.ordermanagement.service;

import com.logistics.ordermanagement.dto.request.CreateDeliveryPartnerRequest;
import com.logistics.ordermanagement.dto.request.UpdatePartnerStatusRequest;
import com.logistics.ordermanagement.dto.response.DeliveryPartnerResponse;
import com.logistics.ordermanagement.dto.response.PagedResponse;
import com.logistics.ordermanagement.enums.PartnerStatus;

import java.util.List;

public interface DeliveryPartnerService {

    DeliveryPartnerResponse createDeliveryPartner(CreateDeliveryPartnerRequest request);

    DeliveryPartnerResponse getDeliveryPartnerById(Long id);

    PagedResponse<DeliveryPartnerResponse> getAllDeliveryPartners(int page, int size);

    PagedResponse<DeliveryPartnerResponse> getDeliveryPartnersByCity(String city, int page, int size);

    PagedResponse<DeliveryPartnerResponse> getDeliveryPartnersByStatus(PartnerStatus status, int page, int size);

    List<DeliveryPartnerResponse> getAvailablePartnersByCity(String city);

    DeliveryPartnerResponse updatePartnerStatus(Long id, UpdatePartnerStatusRequest request);
}
