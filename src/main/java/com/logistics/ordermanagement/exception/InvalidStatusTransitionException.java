package com.logistics.ordermanagement.exception;

import com.logistics.ordermanagement.enums.OrderStatus;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidStatusTransitionException extends RuntimeException {

    public InvalidStatusTransitionException(OrderStatus currentStatus, OrderStatus newStatus) {
        super(String.format("Invalid status transition from %s to %s", currentStatus, newStatus));
    }

    public InvalidStatusTransitionException(String message) {
        super(message);
    }
}
