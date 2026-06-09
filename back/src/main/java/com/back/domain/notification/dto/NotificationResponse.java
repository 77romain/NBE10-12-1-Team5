package com.back.domain.notification.dto;

import lombok.Builder;

@Builder
public record NotificationResponse(
        NotificationType type,
        String message,
        int orderId,
        int totalPrice
) {
}