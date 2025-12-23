package main.java.com.logistics.ordermanagement.service;

import com.logistics.ordermanagement.dto.request.AssignPartnerRequest;
import com.logistics.ordermanagement.dto.request.CreateOrderRequest;
import com.logistics.ordermanagement.dto.request.UpdateOrderStatusRequest;
import com.logistics.ordermanagement.dto.response.OrderResponse;
import com.logistics.ordermanagement.dto.response.PagedResponse;
import com.logistics.ordermanagement.enums.OrderStatus;

public interface OrderService {

    OrderResponse createOrder(CreateOrderRequest request);

    OrderResponse getOrderById(Long id);

    OrderResponse getOrderByOrderNumber(String orderNumber);

    PagedResponse<OrderResponse> getAllOrders(int page, int size);

    PagedResponse<OrderResponse> getOrdersByCity(String city, int page, int size);

    PagedResponse<OrderResponse> getOrdersByStatus(OrderStatus status, int page, int size);

    PagedResponse<OrderResponse> getOrdersByCityAndStatus(String city, OrderStatus status, int page, int size);

    OrderResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request);

    OrderResponse assignDeliveryPartner(Long id, AssignPartnerRequest request);
}
