package com.back.domain.dashboard.controller;

import com.back.domain.dashboard.dto.DashboardResponse;
import com.back.domain.dashboard.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "DashboardController", description = "API 대시보드 컨트롤러")
public class DashboardController {
    private final DashboardService dashboardService;

    // 일별 매출 조회
    @GetMapping("/dailySales")
    @Transactional(readOnly = true)
    @Operation(summary = "일별 매출 조회")
    public List<DashboardResponse.SalesResponse> getDailySales() {
        return dashboardService.getDailySales();
    }

    // 월별 매출 조회
    @GetMapping("/monthSales")
    @Transactional(readOnly = true)
    @Operation(summary = "월별 매출 조회")
    public List<DashboardResponse.SalesResponse> getMonthSales() {
        return dashboardService.getMonthSales();
    }

    // 가장 많이 팔린 원두 TOP3 조회
    @GetMapping("/topSellingItems")
    @Transactional(readOnly = true)
    @Operation(summary = "가장 많이 팔린 원두 TOP3 조회")
    public List<DashboardResponse.TopSellingItemResponse> getTopSellingItems() {
        return dashboardService.getTopSellingItems();
    }

}