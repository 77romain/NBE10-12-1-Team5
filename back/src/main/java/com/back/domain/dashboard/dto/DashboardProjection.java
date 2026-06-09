package com.back.domain.dashboard.dto;

public class DashboardProjection {
    // 일별/월별 매출
    public interface SalesResponse{
        String getOrderDate();
        long getTotalSalesAmount();
    }

    // 가장 많이 팔린 원두 TOP3
    public interface TopSellingItemResponse {
        String getName();
        long getTotalQty();
        long getTotalSalesAmount();
    }
}
