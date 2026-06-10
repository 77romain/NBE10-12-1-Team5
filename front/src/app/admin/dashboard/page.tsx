"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/backend/client";
import type { TopSellingItemResponse, SalesResponse } from "@/type/dashboard";
import type { OrderDto } from "@/type/order";
import type { ProductDto } from "@/type/product";

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

/* ────────────────────────────────────────
   파이 차트 (SVG)
──────────────────────────────────────── */
type PieSlice = { label: string; value: number; color: string };

const MEDALS = ["🥇", "🥈", "🥉"];

function PieChart({ data, onSliceClick }: { data: PieSlice[]; onSliceClick?: (label: string) => void }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0)
    return <p className="text-xs text-gray-400 text-center py-8">데이터 없음</p>;

  const cx = 110, cy = 110, r = 88;
  let startAngle = -Math.PI / 2;

  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const midAngle = startAngle + angle / 2;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;

    // 슬라이스 내부 중심점 (반지름의 58%)
    const lr = r * 0.58;
    const lx = cx + lr * Math.cos(midAngle);
    const ly = cy + lr * Math.sin(midAngle);

    startAngle = endAngle;
    return { ...d, path, lx, ly, medal: MEDALS[i] ?? "" };
  });

  return (
    <svg viewBox="0 0 220 220" className="w-full">
      {slices.map((s) => (
        <g
          key={s.label}
          onClick={() => onSliceClick?.(s.label)}
          style={{ cursor: onSliceClick ? "pointer" : "default" }}
        >
          <path d={s.path} fill={s.color} stroke="white" strokeWidth={2} />
          {/* 메달 이모지 */}
          <text
            x={s.lx.toFixed(1)} y={(s.ly - 9).toFixed(1)}
            textAnchor="middle" dominantBaseline="middle" fontSize={15}
          >
            {s.medal}
          </text>
          {/* 상품명 */}
          <text
            x={s.lx.toFixed(1)} y={(s.ly + 9).toFixed(1)}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={7} fontWeight="600" fill="#374151"
          >
            {s.label.length > 11 ? s.label.slice(0, 11) + "…" : s.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ────────────────────────────────────────
   바 차트 (SVG)
──────────────────────────────────────── */
type BarItem = { label: string; value: number };

function BarChart({ data, color, onBarClick }: { data: BarItem[]; color: string; onBarClick?: (label: string) => void }) {
  if (data.length === 0)
    return <p className="text-xs text-gray-400 text-center py-8">데이터 없음</p>;

  const chartH = 120;
  const paddingTop = 20;   // 막대 위 금액 텍스트 공간
  const paddingBottom = 28;
  const barW = 32;
  const gap = 16;
  const paddingX = 20;
  const naturalW = data.length * (barW + gap) - gap + paddingX * 2;
  const totalW = Math.max(280, naturalW);
  const barsW = data.length * (barW + gap) - gap;
  const startX = (totalW - barsW) / 2;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const totalH = paddingTop + chartH + paddingBottom;
  const baseY = paddingTop + chartH;

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full">
      <line
        x1={paddingX} y1={baseY}
        x2={totalW - paddingX} y2={baseY}
        stroke="#e5e7eb" strokeWidth={1}
      />
      {data.map((d, i) => {
        const barH = Math.max(3, (d.value / maxVal) * chartH);
        const x = startX + i * (barW + gap);
        const shortLabel =
          d.label.length === 10
            ? d.label.slice(5)   // YYYY-MM-DD → MM-DD
            : d.label.slice(2);  // YYYY-MM → YY-MM
        const amountLabel =
          d.value >= 10000
            ? `${Math.round(d.value / 10000)}만원`
            : `${d.value.toLocaleString()}`;
        return (
          <g
            key={d.label}
            onClick={() => onBarClick?.(d.label)}
            style={{ cursor: onBarClick ? "pointer" : "default" }}
          >
            <rect
              x={x} y={baseY - barH}
              width={barW} height={barH}
              rx={5} fill={color} fillOpacity={0.85}
            />
            {/* hover 확장 투명 클릭 영역 */}
            {onBarClick && (
              <rect
                x={x} y={paddingTop}
                width={barW} height={chartH + paddingBottom}
                fill="transparent"
              />
            )}
            {/* 막대 위 금액 */}
            <text
              x={x + barW / 2} y={baseY - barH - 4}
              textAnchor="middle" fontSize={8} fill="#6b7280"
            >
              {amountLabel}
            </text>
            {/* 하단 날짜 레이블 */}
            <text
              x={x + barW / 2} y={baseY + 17}
              textAnchor="middle" fontSize={10} fill="#9ca3af"
            >
              {shortLabel}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ────────────────────────────────────────
   주문 목록 모달
──────────────────────────────────────── */
const STATUS_LABEL: Record<string, string> = {
  PENDING: "주문확인중",
  PROCESSING: "처리중",
  SHIPPED: "발송완료",
  DELIVERED: "배송완료",
  CANCELED: "취소",
};
const STATUS_COLOR: Record<string, string> = {
  PENDING: "text-amber-500",
  PROCESSING: "text-blue-500",
  SHIPPED: "text-indigo-500",
  DELIVERED: "text-green-600",
  CANCELED: "text-red-500",
};

function OrderListModal({
  title,
  orders,
  onClose,
}: {
  title: string;
  orders: OrderDto[];
  onClose: () => void;
}) {
  const nonCanceled = orders.filter((o) => o.status !== "CANCELED");
  const totalAmount = nonCanceled.reduce((s, o) => s + o.totalPrice, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-[560px] max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-800">{title} 주문 목록</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              총 {orders.length}건 &nbsp;·&nbsp; 매출 {totalAmount.toLocaleString()}원 (취소 제외)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* 목록 */}
        <div className="overflow-y-auto flex-1">
          {orders.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">주문 없음</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 font-semibold text-gray-500 w-10">No.</th>
                  <th className="text-left py-2 px-4 font-semibold text-gray-500">주소</th>
                  <th className="text-left py-2 px-4 font-semibold text-gray-500 w-24">배송일</th>
                  <th className="text-right py-2 px-4 font-semibold text-gray-500 w-28">금액</th>
                  <th className="text-center py-2 px-4 font-semibold text-gray-500 w-24">상태</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, idx) => (
                  <tr
                    key={o.id}
                    className={`border-b border-gray-50 last:border-0 ${
                      o.status === "CANCELED" ? "opacity-50" : ""
                    }`}
                  >
                    <td className="py-2.5 px-4 text-gray-400">{String(idx + 1).padStart(2, "0")}</td>
                    <td className="py-2.5 px-4 text-gray-700 max-w-[180px] truncate">{o.address}</td>
                    <td className="py-2.5 px-4 text-gray-500">{o.deliveryDate}</td>
                    <td className="py-2.5 px-4 text-right font-medium text-gray-800">
                      {o.totalPrice.toLocaleString()}원
                    </td>
                    <td className={`py-2.5 px-4 text-center font-medium ${STATUS_COLOR[o.status] ?? "text-gray-500"}`}>
                      {STATUS_LABEL[o.status] ?? o.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────
   대시보드 페이지
──────────────────────────────────────── */
function ProductModal({
  product,
  topItem,
  onClose,
}: {
  product: ProductDto;
  topItem?: TopSellingItemResponse;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-80 max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-base font-bold text-gray-800">상품 정보</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* 이미지 */}
        <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
          <img
            src={product.imageUrl || "/coffee_bean.jpg"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 상품명 */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">상품명</span>
          <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800">
            {product.name}
          </div>
        </div>

        {/* 가격 / 재고 */}
        <div className="flex gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-xs text-gray-500">가격 (원)</span>
            <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800">
              {product.price.toLocaleString()}
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-xs text-gray-500">재고 (개)</span>
            <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800">
              {product.inventory}
            </div>
          </div>
        </div>

        {/* 상품 설명 */}
        {product.description && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">상품 설명</span>
            <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </div>
          </div>
        )}

        {/* 판매 통계 */}
        {topItem && (
          <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between text-sm">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xs text-gray-400">총 판매량</span>
              <span className="font-bold text-gray-800">{topItem.getTotalQty.toLocaleString()}개</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xs text-gray-400">총 매출</span>
              <span className="font-bold text-blue-600">{topItem.getTotalSalesAmount.toLocaleString()}원</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [topItems, setTopItems] = useState<TopSellingItemResponse[]>([]);
  const [monthSales, setMonthSales] = useState<SalesResponse[]>([]);
  const [dailySales, setDailySales] = useState<SalesResponse[]>([]);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
  const [selectedTopItem, setSelectedTopItem] = useState<TopSellingItemResponse | undefined>(undefined);
  const [orderModal, setOrderModal] = useState<{ title: string; orders: OrderDto[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [top, month, daily, orderList, productList] = await Promise.all([
          apiFetch("/api/dashboard/topSellingItems") as Promise<TopSellingItemResponse[]>,
          apiFetch("/api/dashboard/monthSales") as Promise<SalesResponse[]>,
          apiFetch("/api/dashboard/dailySales") as Promise<SalesResponse[]>,
          apiFetch("/api/order") as Promise<OrderDto[]>,
          apiFetch("/api/product") as Promise<ProductDto[]>,
        ]);
        setTopItems(top.slice(0, 3));
        setMonthSales(month);
        setDailySales(daily);
        setOrders(Array.isArray(orderList) ? orderList : []);
        setProducts(Array.isArray(productList) ? productList : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSliceClick = (label: string) => {
    const product = products.find((p) => p.name === label);
    const topItem = topItems.find((t) => t.getName === label);
    if (product) {
      setSelectedProduct(product);
      setSelectedTopItem(topItem);
    }
  };

  const handleDailyBarClick = (label: string) => {
    // label: "2026-06-10"
    const filtered = orders.filter((o) => o.deliveryDate === label);
    setOrderModal({ title: label, orders: filtered });
  };

  const handleMonthBarClick = (label: string) => {
    // label: "2026-06"
    const filtered = orders.filter((o) => o.deliveryDate?.startsWith(label));
    setOrderModal({ title: label, orders: filtered });
  };

  const today = getTodayStr();
  const todayCount = orders.filter((o) => o.deliveryDate === today).length;
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const canceledCount = orders.filter((o) => o.status === "CANCELED").length;
  const todaySalesAmount =
    dailySales.find((s) => s.getOrderDate === today)?.getTotalSalesAmount ?? 0;

  const PIE_COLORS = ["#93c5fd", "#6ee7b7", "#fde68a"];
  const pieData: PieSlice[] = topItems.map((item, i) => ({
    label: item.getName,
    value: item.getTotalQty,
    color: PIE_COLORS[i] ?? "#d1d5db",
  }));

  const summaryRows = [
    { label: "오늘 주문 건수", value: `${todayCount}건`,                          style: "text-gray-900" },
    { label: "오늘 매출",      value: `${todaySalesAmount.toLocaleString()}원`,    style: "text-blue-600" },
    { label: "대기 주문",      value: `${pendingCount}건`,                         style: "text-amber-500" },
    { label: "취소 주문",      value: `${canceledCount}건`,                        style: "text-red-500" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        로딩중...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <h2 className="text-base font-bold text-gray-800">대시보드</h2>

      <div className="grid grid-cols-2 gap-4">

        {/* ── 좌상단: 요약 카드 ── */}
        <div className="border border-gray-200 rounded-2xl p-6 flex flex-col justify-center gap-0">
          {summaryRows.map(({ label, value, style }, i, arr) => (
            <div
              key={label}
              className={`flex items-center justify-between py-4 ${
                i < arr.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <span className={`text-sm font-semibold ${style}`}>{label}</span>
              <span className={`text-2xl font-bold ${style}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* ── 우상단: 일별 매출 바 차트 ── */}
        <div className="border border-gray-200 rounded-2xl p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">일별 매출</h3>
          <div className="flex-1 flex items-end">
            <BarChart
              data={dailySales.slice(-10).map((s) => ({
                label: s.getOrderDate,
                value: s.getTotalSalesAmount,
              }))}
              color="#93c5fd"
              onBarClick={handleDailyBarClick}
            />
          </div>
        </div>

        {/* ── 좌하단: TOP 3 파이 차트 ── */}
        <div className="border border-gray-200 rounded-2xl p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            가장 많이 팔린 원두 TOP 3
          </h3>
          <div className="flex-1 flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-xs text-gray-400">데이터 없음</p>
            ) : (
              <PieChart data={pieData} onSliceClick={handleSliceClick} />
            )}
          </div>
        </div>

        {/* ── 우하단: 월별 매출 바 차트 ── */}
        <div className="border border-gray-200 rounded-2xl p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">월별 매출</h3>
          <div className="flex-1 flex items-end">
            <BarChart
              data={monthSales.map((s) => ({
                label: s.getOrderDate,
                value: s.getTotalSalesAmount,
              }))}
              color="#6ee7b7"
              onBarClick={handleMonthBarClick}
            />
          </div>
        </div>

      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          topItem={selectedTopItem}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {orderModal && (
        <OrderListModal
          title={orderModal.title}
          orders={orderModal.orders}
          onClose={() => setOrderModal(null)}
        />
      )}
    </div>
  );
}
