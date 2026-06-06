package com.back.domain.orderitems.service;

import com.back.domain.orderitems.dto.OrderItemRequest;
import com.back.domain.orderitems.dto.OrderItemResponse;
import com.back.domain.orderitems.entity.OrderItems;
import com.back.domain.orderitems.repository.OrderItemRepository;
import com.back.domain.orders.entity.Orders;
import com.back.domain.orders.repository.OrderRepository;
import com.back.domain.items.entity.Items;
import com.back.domain.items.repository.ItemsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final ItemsRepository itemsRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public void saveOrderItems(int orderId, List<OrderItemRequest> requests) {
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주문입니다."));

        for (OrderItemRequest request : requests) {
            Items item = itemsRepository.findById(request.getItemId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));
            
            OrderItems orderItem = OrderItems.builder()
                    .order(order)
                    .item(item)
                    .itemQuantity(request.getItemQuantity())
                    .itemName(item.getName())
                    .itemPrice(item.getPrice())
                    .build();

            orderItemRepository.save(orderItem);
        }
    }

    public List<OrderItemResponse> getOrderItems(int orderId) {
        List<OrderItems> orderItems = orderItemRepository.findByOrderId(orderId);
        return orderItems.stream()
                .map(OrderItemResponse::new)
                .toList();
    }

    public OrderItemResponse getOrderItem(int id) {
        OrderItems orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주문품목입니다."));
        return new OrderItemResponse(orderItem);
    }

    @Transactional
    public void deleteOrderItems(int orderId) {
        orderItemRepository.deleteByOrderId(orderId);
    }

    @Transactional
    public void updateOrderItems(int orderId, List<OrderItemRequest> requests) {
        deleteOrderItems(orderId);
        saveOrderItems(orderId, requests);
    }

    public List<OrderItems> findAll() {
        return orderItemRepository.findAll();
    }

    public long count() {
        return orderItemRepository.count();
    }
}
