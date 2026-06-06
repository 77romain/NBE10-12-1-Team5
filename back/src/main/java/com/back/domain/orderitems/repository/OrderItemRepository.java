package com.back.domain.orderitems.repository;

import com.back.domain.orderitems.entity.OrderItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItems, Integer> {
    List<OrderItems> findByOrderId(int orderId);
    void deleteByOrderId(int orderId);
    Optional<OrderItems> findFirstByOrderByIdDesc();
}
