"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/backend/client";
import type { TopSellingItemResponse, SalesResponse } from "@/type/dashboard";

export default function DashboardPage() {
  const [topItems, setTopItems] = useState<TopSellingItemResponse[]>([]);
  const [monthSales, setMonthSales] = useState<SalesResponse[]>([]);
  const [dailySales, setDailySales] = useState<SalesResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [top, month, daily] = await Promise.all([
          apiFetch("/api/dashboard/topSellingItems") as Promise<TopSellingItemResponse[]>,
          apiFetch("/api/dashboard/monthSales") as Promise<SalesResponse[]>,
          apiFetch("/api/dashboard/dailySales") as Promise<SalesResponse[]>,
        ]);
        setTopItems(top.slice(0, 3));
        setMonthSales(month);
        setDailySales(daily);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const MEDAL = ["🥇", "🥈", "🥉"];

  const maxMonthAmount = Math.max(...monthSales.map((s) => s.getTotalSalesAmount), 1);
  const maxDailyAmount = Math.max(...dailySales.map((s) => s.getTotalSalesAmount), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        로딩중...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-bold text-gray-800">대시보드</h2>

      {/* TOP 3 베스트셀러 */}
      <section>
        <h3 className="text-sm font-semibold text-gray-600 mb-3">베스트셀러 TOP 3</h3>
        <div className="grid grid-cols-3 gap-3">
          {topItems.length === 0 ? (
            <p className="text-sm text-gray-400 col-span-3 text-center py-8">데이터가 없습니다.</p>
          ) : (
            topItems.map((item, i) => (
              <div
                key={item.getName}
                className="border border-gray-200 rounded-xl p-4 flex flex-col gap-2 bg-white"
              >
                <span className="text-2xl">{MEDAL[i]}</span>
                <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
                  {item.getName}
                </p>
                <div className="mt-auto flex flex-col gap-0.5">
                  <span className="text-xs text-gray-500">
                    판매 수량{" "}
                    <strong className="text-gray-800">{item.getTotalQty.toLocaleString()}개</strong>
                  </span>
                  <span className="text-xs text-gray-500">
                    매출액{" "}
                    <strong className="text-gray-800">
                      {item.getTotalSalesAmount.toLocaleString()}원
                    </strong>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-6">
        {/* 월별 매출 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">월별 매출</h3>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {monthSales.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">데이터가 없습니다.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-2.5 px-4 font-semibold text-gray-500 text-xs">월</th>
                    <th className="text-right py-2.5 px-4 font-semibold text-gray-500 text-xs">매출액</th>
                    <th className="py-2.5 px-4 w-24" />
                  </tr>
                </thead>
                <tbody>
                  {monthSales.map((s) => (
                    <tr key={s.getOrderDate} className="border-b border-gray-100 last:border-0">
                      <td className="py-2.5 px-4 text-gray-700 text-xs">{s.getOrderDate}</td>
                      <td className="py-2.5 px-4 text-right font-medium text-gray-800 text-xs">
                        {s.getTotalSalesAmount.toLocaleString()}원
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-amber-400 h-1.5 rounded-full"
                            style={{
                              width: `${(s.getTotalSalesAmount / maxMonthAmount) * 100}%`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* 일별 매출 */}
        <section>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">일별 매출</h3>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {dailySales.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">데이터가 없습니다.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-2.5 px-4 font-semibold text-gray-500 text-xs">날짜</th>
                    <th className="text-right py-2.5 px-4 font-semibold text-gray-500 text-xs">매출액</th>
                    <th className="py-2.5 px-4 w-24" />
                  </tr>
                </thead>
                <tbody>
                  {dailySales.map((s) => (
                    <tr key={s.getOrderDate} className="border-b border-gray-100 last:border-0">
                      <td className="py-2.5 px-4 text-gray-700 text-xs">{s.getOrderDate}</td>
                      <td className="py-2.5 px-4 text-right font-medium text-gray-800 text-xs">
                        {s.getTotalSalesAmount.toLocaleString()}원
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-blue-400 h-1.5 rounded-full"
                            style={{
                              width: `${(s.getTotalSalesAmount / maxDailyAmount) * 100}%`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
