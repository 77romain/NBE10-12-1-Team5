package com.back.domain.orderitems.repository;

import com.back.domain.dashboard.dto.DashboardProjection;
import com.back.domain.orderitems.entity.OrderItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItems, Integer> {
    List<OrderItems> findByOrderId(int orderId);
    void deleteByOrderId(int orderId);
    Optional<OrderItems> findFirstByOrderByIdDesc();


    // 대시보드
    // 일별 매출 조회
    @Query("""
        select function('date_format', o.createDate, '%Y-%m-%d') as orderDate
              , sum(oi.itemQuantity * oi.itemPrice) as totalSalesAmount
            from OrderItems oi
            join oi.order o
            where o.status <> com.back.domain.orders.entity.OrderStatus.CANCELED
            group by function('date_format', o.createDate, '%Y-%m-%d')
            order by function('date_format', o.createDate, '%Y-%m-%d')
    """)
    List<DashboardProjection.SalesResponse> findDailySales();

    // 일별 매출 조회
    @Query("""
        select function('date_format', o.createDate, '%Y-%m') as orderDate
        	 , sum(oi.itemQuantity * oi.itemPrice) as totalSalesAmount
          from OrderItems oi
          join oi.order o
         where o.status <> com.back.domain.orders.entity.OrderStatus.CANCELED
         group by function('date_format', o.createDate, '%Y-%m')
         order by function('date_format', o.createDate, '%Y-%m')
    """)
    List<DashboardProjection.SalesResponse> findMonthSales();

    // 가장 많이 팔린 원두 TOP 3
    @Query("""
        select i.name as name
             , sum(oi.itemQuantity) as totalQty
        	 , sum(oi.itemQuantity * oi.itemPrice) as totalSalesAmount
          from OrderItems oi
          join oi.order o
          join oi.item i
         where o.status <> com.back.domain.orders.entity.OrderStatus.CANCELED
         group by i.name
         order by sum(oi.itemQuantity) desc
    """)
    List<DashboardProjection.TopSellingItemResponse> findTopSellingItems();
}
