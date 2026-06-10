package com.back.domain.product.repository;

import com.back.domain.order.entity.OrderStatus;
import com.back.domain.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    @Query("""
        SELECT COUNT(p) > 0
                FROM Product p
                JOIN OrderProduct op ON op.product.id = p.id
                JOIN Order o ON o.id = op.order.id
                WHERE p.id = :productId
                AND o.status = 'PENDING'
    """)
    boolean existsPendingOrderByProductId(@Param("productId") int id, @Param("status") OrderStatus status);
}
