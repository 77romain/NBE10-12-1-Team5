package com.back.domain.dashboard.dto;

public class DashboardResponse {
    public record SalesResponse(
            String getOrderDate,
            Long getTotalSalesAmount
    ) {}

    public record TopSellingItemResponse(
            String getName,
            long getTotalQty,
            long getTotalSalesAmount
    ) {}
}
