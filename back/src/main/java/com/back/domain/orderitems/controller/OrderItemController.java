package com.back.domain.orderitems.controller;

import com.back.domain.orderitems.dto.OrderItemRequest;
import com.back.domain.orderitems.dto.OrderItemResponse;
import com.back.domain.orderitems.service.OrderItemService;
import com.back.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders/{orderId}/items")
@RequiredArgsConstructor
@Tag(name = "OrderItemController", description = "API 주문품목 컨트롤러")
public class OrderItemController {

    private final OrderItemService orderItemService;

    @GetMapping
    @Operation(summary = "주문품목 다건 조회")
    public RsData<List<OrderItemResponse>> getOrderItems(@PathVariable int orderId) {
        List<OrderItemResponse> response = orderItemService.getOrderItems(orderId);
        return new RsData<>("200-1", "주문 품목 리스트 조회 성공", response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "주문품목 단건 조회")
    public RsData<OrderItemResponse> getOrderItem(@PathVariable int orderId, @PathVariable int id) {
        OrderItemResponse response = orderItemService.getOrderItem(id);
        return new RsData<>("200-1", "주문 품목 단건 조회 성공", response);
    }

    @PostMapping
    @Operation(summary = "주문품목 생성")
    public RsData<Void> saveOrderItems(
            @PathVariable int orderId,
            @RequestBody List<@Valid OrderItemRequest> requests) {
                
        orderItemService.saveOrderItems(orderId, requests);
        return new RsData<>("200-1", "주문 품목 등록 성공");
    }

    @DeleteMapping
    @Operation(summary = "주문품목 전체 삭제")
    public RsData<Void> deleteOrderItems(@PathVariable int orderId) {
        orderItemService.deleteOrderItems(orderId);
        return new RsData<>("200-1", "주문 품목 일괄 삭제 성공");
    }

    @PutMapping
    @Operation(summary = "주문품목 수정")
    public RsData<Void> updateOrderItems(
            @PathVariable int orderId,
            @RequestBody List<@Valid OrderItemRequest> requests) {
                
        orderItemService.updateOrderItems(orderId, requests);
        
        return new RsData<>("200-1", "주문 품목 수정 성공");
    }
}
