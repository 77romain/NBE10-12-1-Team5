package com.back.domain.orders.dto;

import com.back.domain.orders.entity.OrderStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record OrderRequest(
        int UserId,

        @NotBlank(message = "주소를 입력해주세요.")
        String address,

        @NotBlank(message = "상세주소를 입력해주세요.")
        String addressDetail,

        @NotBlank(message = "우편번호를 입력해주세요.")
        String postcode,

        OrderStatus status,
        int totalPrice
) {}