package com.back.domain.orders.controller;

import com.back.domain.orders.dto.OrderRequest;
import com.back.domain.orders.dto.OrderResponse;
import com.back.domain.orders.entity.Orders;
import com.back.domain.orders.service.OrderService;
import com.back.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "OrderController", description = "API 주문 컨트롤러")
public class OrderController {
    private final OrderService orderService;

    // 주문 다건 조회
    @GetMapping
    @Transactional(readOnly = true)
    @Operation(summary = "주문 다건 조회")
    public List<OrderResponse> getOrders() {
        List<Orders> orders = orderService.findAll();

        return orders
                .stream()
                .map(OrderResponse::new)
                .toList();
    }

    // 주문 단건 조회
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    @Operation(summary = "주문 단건 조회")
    public OrderResponse getOrders(@PathVariable int id) {
        Orders order = orderService.findById(id).get();

        return new OrderResponse(order);
    }


    // 주문 등록
    @PostMapping
    @Transactional
    @Operation(summary = "주문 등록")
    public RsData<OrderResponse> createOrder(
            @RequestBody @Valid OrderRequest req
    ) {
        Orders orders = orderService.create(req.UserId(), req.address(), req.addressDetail(), req.postcode(), req.totalPrice());

        return new RsData<>(
                "201-1",
                "%d번 주문이 등록되었습니다.".formatted(orders.getId()),
                new OrderResponse(orders)
        );
    }


    // 주문 삭제
    @DeleteMapping("/{id}")
    @Transactional
    @Operation(summary = "주문 삭제")
    public RsData<Void> deleteOrder(@PathVariable int id) {
        Orders orders = orderService.findById(id).get();

        orderService.delete(orders);

        return new RsData<>(
                  "200-1",
                "%d번 글이 삭제되었습니다.".formatted(id)
        );
    }




    // 주문 수정
    @PutMapping("/{id}")
    @Transactional
    @Operation(summary = "주문 수정")
    public RsData<Void> modify(
            @PathVariable int id,
            @RequestBody @Valid OrderRequest req
    ) {
        Orders order = orderService.findById(id).get();

        orderService.modify(order, req.status());

        return new RsData<>(
                "200-1",
                "%d번 주문이 수정되었습니다.".formatted(order.getId())
        );
    }

}