"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/backend/client";
import { getCart } from "@/lib/cart";
import type { ProductDto } from "@/type/product";
import type { UserDto } from "@/type/account";
import type { OrderProductDto, OrderDto, OrderStatus } from "@/type/order";
import { ORDER_STATUS_LABEL } from "@/type/order";
import type { RsData } from "@/type/rsData";

const PAGE_SIZE = 9;

const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: "text-gray-600 bg-gray-100",
  PROCESSING: "text-yellow-700 bg-yellow-50",
  SHIPPED: "text-blue-600 bg-blue-50",
  DELIVERED: "text-green-600 bg-green-50",
  CANCELED: "text-red-500 bg-red-50",
};

// 그룹 타입 (동일 address + addressDetail + deliveryDate + status 묶음)
type OrderGroup = {
  key: string;
  orders: OrderDto[];
  address: string;
  deliveryDate: string;
  status: OrderStatus;
  totalPrice: number;
};

function groupOrders(orders: OrderDto[]): OrderGroup[] {
  const map = new Map<string, OrderGroup>();
  for (const o of orders) {
    const key = `${o.address}|${o.addressDetail}|${o.deliveryDate}|${o.status}`;
    if (map.has(key)) {
      const g = map.get(key)!;
      g.orders.push(o);
      g.totalPrice += o.totalPrice;
    } else {
      map.set(key, {
        key,
        orders: [o],
        address: o.address,
        deliveryDate: o.deliveryDate,
        status: o.status,
        totalPrice: o.totalPrice,
      });
    }
  }
  return Array.from(map.values());
}

type EditProduct = { productId: number; productName: string; productQuantity: number };

export default function MainPage() {
  // 상품 목록
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [cartCount, setCartCount] = useState(0);

  // 사이드바 토글
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 주문 조회
  const [emailInput, setEmailInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [myOrders, setMyOrders] = useState<OrderDto[] | null>(null);
  const [searchError, setSearchError] = useState("");

  // 그룹 펼침
  const [expandedGroupKey, setExpandedGroupKey] = useState<string | null>(null);

  // 선택된 개별 주문 상세
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
  const [orderProducts, setOrderProducts] = useState<OrderProductDto[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // 수정 모드
  const [editMode, setEditMode] = useState(false);
  const [editProducts, setEditProducts] = useState<EditProduct[]>([]);
  const [allProducts, setAllProducts] = useState<ProductDto[]>([]);
  const [addProductId, setAddProductId] = useState<number | "">("");
  const [addQty, setAddQty] = useState(1);
  const [editSaving, setEditSaving] = useState(false);

  // SSE: 현재 조회된 주문 목록을 ref로 추적 (이벤트 핸들러에서 최신 state 참조)
  const myOrdersRef = useRef<OrderDto[] | null>(null);
  useEffect(() => { myOrdersRef.current = myOrders; }, [myOrders]);

  useEffect(() => {
    apiFetch("/api/product")
      .then((data: ProductDto[]) => { setProducts(data); setAllProducts(data); })
      .finally(() => setLoading(false));
    setCartCount(getCart().reduce((sum, c) => sum + c.quantity, 0));
  }, []);

  // SSE 연결: 어드민이 주문 상태를 변경하면 메인 페이지 주문 목록도 실시간 갱신
  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
    const eventSource = new EventSource(`${apiBaseUrl}/api/notifications/subscribe`);

    eventSource.addEventListener("newOrder", async (event) => {
      const currentOrders = myOrdersRef.current;
      if (!currentOrders || currentOrders.length === 0) return;
      try {
        const data = JSON.parse(event.data) as { orderId: number; totalPrice: number };
        const isUserOrder = currentOrders.some((o) => o.id === data.orderId);
        if (!isUserOrder) return;
        const updated: OrderDto = await apiFetch(`/api/order/${data.orderId}`);
        setMyOrders((prev) =>
          prev ? prev.map((o) => (o.id === data.orderId ? updated : o)) : null
        );
      } catch (err) {
        console.error("SSE 주문 갱신 오류:", err);
      }
    });

    eventSource.onerror = () => {
      console.warn("메인 페이지 SSE 연결 끊김, 자동 재연결 시도 중...");
    };

    return () => eventSource.close();
  }, []);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const paged = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 파생: 그룹 목록
  const myGroups = myOrders ? groupOrders(myOrders) : null;

  // 주문 검색
  const handleSearch = async () => {
    if (!emailInput.trim()) return;
    setSearching(true);
    setSearchError("");
    setMyOrders(null);
    setExpandedGroupKey(null);
    setSelectedOrder(null);
    setEditMode(false);
    try {
      const users: UserDto[] = await apiFetch("/api/user");
      const user = users.find((u) => u.email === emailInput.trim());
      if (!user) { setSearchError("해당 이메일로 등록된 계정이 없습니다."); return; }
      const orders: OrderDto[] = await apiFetch("/api/order");
      const mine = orders.filter((o) => o.userId === user.id);
      setMyOrders(mine);
      if (mine.length === 0) setSearchError("주문 내역이 없습니다.");
    } catch {
      setSearchError("조회 중 오류가 발생했습니다.");
    } finally {
      setSearching(false);
    }
  };

  // 그룹 클릭 → 펼침/접기
  const handleToggleGroup = (key: string) => {
    setExpandedGroupKey((prev) => (prev === key ? null : key));
    setSelectedOrder(null);
    setEditMode(false);
  };

  // 개별 주문 클릭 → 품목 상세
  const handleSelectOrder = async (order: OrderDto) => {
    if (selectedOrder?.id === order.id) {
      setSelectedOrder(null);
      setEditMode(false);
      return;
    }
    setSelectedOrder(order);
    setOrderProducts([]);
    setEditMode(false);
    setDetailLoading(true);
    try {
      const res: RsData<OrderProductDto[]> = await apiFetch(`/api/order/${order.id}/product`);
      setOrderProducts((res.data ?? []).filter((it) => !it.deleteDate));
    } catch {
      setOrderProducts([]);
    } finally {
      setDetailLoading(false);
    }
  };

  // 주문 취소 (PENDING만)
  const handleCancel = async () => {
    if (!selectedOrder) return;
    if (!confirm(`#${selectedOrder.id} 주문을 취소하시겠습니까?`)) return;
    try {
      await apiFetch(`/api/order/${selectedOrder.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "CANCELED" }),
      });
      setMyOrders((prev) =>
        prev?.map((o) => o.id === selectedOrder.id ? { ...o, status: "CANCELED" } : o) ?? null
      );
      setSelectedOrder((prev) => prev && { ...prev, status: "CANCELED" });
      // 그룹이 재편성되므로 확장 닫기
      setExpandedGroupKey(null);
      setEditMode(false);
    } catch {
      alert("취소 중 오류가 발생했습니다.");
    }
  };

  // 수정 모드
  const enterEditMode = () => {
    setEditProducts(orderProducts.map((it) => ({
      productId: it.productId, productName: it.productName, productQuantity: it.productQuantity,
    })));
    setAddProductId("");
    setAddQty(1);
    setEditMode(true);
  };

  const handleEditQty = (productId: number, qty: number) =>
    setEditProducts((prev) => prev.map((it) => it.productId === productId ? { ...it, productQuantity: Math.max(1, qty) } : it));

  const handleEditRemove = (productId: number) =>
    setEditProducts((prev) => prev.filter((it) => it.productId !== productId));

  const handleAddItem = () => {
    if (!addProductId) return;
    const product = allProducts.find((i) => i.id === Number(addProductId));
    if (!product) return;
    const existing = editProducts.find((it) => it.productId === product.id);
    if (existing) {
      setEditProducts((prev) => prev.map((it) =>
        it.productId === product.id ? { ...it, productQuantity: it.productQuantity + addQty } : it
      ));
    } else {
      setEditProducts((prev) => [...prev, { productId: product.id, productName: product.name, productQuantity: addQty }]);
    }
    setAddProductId("");
    setAddQty(1);
  };

  const handleEditSave = async () => {
    if (!selectedOrder || editProducts.length === 0) {
      alert("최소 1개 이상의 품목이 필요합니다.");
      return;
    }
    setEditSaving(true);
    try {
      await apiFetch(`/api/order/${selectedOrder.id}/product`, {
        method: "PUT",
        body: JSON.stringify(editProducts.map((it) => ({ productId: it.productId, productQuantity: it.productQuantity }))),
      });
      const res: RsData<OrderProductDto[]> = await apiFetch(`/api/order/${selectedOrder.id}/product`);
      const updatedProducts = (res.data ?? []).filter((it) => !it.deleteDate);
      setOrderProducts(updatedProducts);

      // 로컬 상태를 즉시 동기화하기 위해 새 총 가격 계산
      const newTotalPrice = updatedProducts.reduce((sum, it) => sum + it.productPrice * it.productQuantity, 0);

      // 선택된 주문의 총금액 및 목록의 총금액 실시간 업데이트
      setSelectedOrder((prev) => prev ? { ...prev, totalPrice: newTotalPrice } : null);
      setMyOrders((prev) =>
        prev ? prev.map((o) => o.id === selectedOrder.id ? { ...o, totalPrice: newTotalPrice } : o) : null
      );

      setEditMode(false);
    } catch {
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setEditSaving(false);
    }
  };

  // 수정 중인 품목들의 실시간 총 합계 금액 계산
  const editTotal = editProducts.reduce((sum, it) => {
    const product = allProducts.find((i) => i.id === it.productId);
    return sum + (product ? product.price : 0) * it.productQuantity;
  }, 0);

  return (
    <div className="min-h-screen flex">
      {/* Left: 주문 조회 사이드바 */}
      <aside
        className={`flex-shrink-0 flex flex-col gap-3 transition-all duration-300 overflow-hidden ${
          sidebarOpen ? "w-64 m-4 mr-0 opacity-100" : "w-0 m-0 opacity-0 pointer-events-none"
        }`}
      >
        {/* 이메일 검색 */}
        <div className="border border-gray-300 rounded-2xl p-4 bg-white">
          <h2 className="text-sm font-semibold mb-3">내 주문 조회</h2>
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="이메일 입력"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs mb-2 focus:outline-none focus:border-gray-400"
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="w-full bg-gray-900 text-white rounded-lg py-2 text-xs font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {searching ? "조회중..." : "주문 검색"}
          </button>
          {searchError && (
            <p className="text-xs text-gray-400 mt-2 text-center">{searchError}</p>
          )}
        </div>

        {/* 그룹 목록 */}
        {myGroups && myGroups.length > 0 && (
          <div className="border border-gray-300 rounded-2xl p-4 bg-white flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-12rem)]">
            <h3 className="text-xs font-semibold text-gray-500 mb-1">주문 목록</h3>

            {myGroups.map((group) => {
              const isExpanded = expandedGroupKey === group.key;
              return (
                <div key={group.key} className="flex flex-col">
                  {/* 그룹 헤더 */}
                  <button
                    onClick={() => handleToggleGroup(group.key)}
                    className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition-colors ${
                      isExpanded ? "border-gray-400 bg-gray-50" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded-md ${STATUS_STYLE[group.status]}`}>
                        {ORDER_STATUS_LABEL[group.status]}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {group.orders.length > 1 ? `×${group.orders.length}건` : ""}
                        {isExpanded ? " ▲" : " ▼"}
                      </span>
                    </div>
                    <div className="text-gray-500 truncate">{group.address}</div>
                    <div className="text-gray-400">{group.deliveryDate}</div>
                    <div className="text-gray-700 font-semibold mt-0.5">
                      합계 {group.totalPrice.toLocaleString()}원
                    </div>
                  </button>

                  {/* 펼쳐진 개별 주문 목록 */}
                  {isExpanded && (
                    <div className="mt-1 ml-2 flex flex-col gap-1">
                      {group.orders.map((order) => {
                        const isSelected = selectedOrder?.id === order.id;
                        return (
                          <div key={order.id} className="flex flex-col">
                            {/* 개별 주문 행 */}
                            <div
                              className={`flex items-center justify-between px-2 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                                isSelected ? "border-gray-400 bg-white" : "border-gray-200 hover:bg-gray-50"
                              }`}
                              onClick={() => handleSelectOrder(order)}
                            >
                              <span className="font-medium text-gray-700">#{order.id}</span>
                              <span className="text-gray-500">{order.totalPrice.toLocaleString()}원</span>
                              {order.status === "PENDING" && (
                                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => { handleSelectOrder(order).then(() => enterEditMode()); }}
                                    className="text-xs px-1.5 py-0.5 border border-gray-200 rounded text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-colors"
                                  >
                                    수정
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* 선택된 주문 상세 (인라인) */}
                            {isSelected && (
                              <div className="ml-2 mt-1 mb-1 border border-gray-200 rounded-xl p-3 bg-white flex flex-col gap-2">
                                {detailLoading ? (
                                  <p className="text-xs text-gray-400 text-center py-1">로딩중...</p>
                                ) : editMode ? (
                                  /* 수정 모드 */
                                  <div className="flex flex-col gap-2">
                                    <div className="max-h-32 overflow-y-auto flex flex-col gap-1.5">
                                      {editProducts.map((it) => (
                                        <div key={it.productId} className="flex items-center gap-1">
                                          <span className="flex-1 text-xs truncate">{it.productName}</span>
                                          <input
                                            type="number" min={1} value={it.productQuantity}
                                            onChange={(e) => handleEditQty(it.productId, Number(e.target.value))}
                                            className="w-10 border border-gray-300 rounded px-1 py-0.5 text-xs text-center"
                                          />
                                          <button onClick={() => handleEditRemove(it.productId)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex flex-col gap-1 pt-1 border-t border-gray-100">
                                      <select
                                        value={addProductId}
                                        onChange={(e) => setAddProductId(e.target.value === "" ? "" : Number(e.target.value))}
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                                      >
                                        <option value="">상품 선택</option>
                                        {allProducts.map((prod) => (
                                          <option key={prod.id} value={prod.id}>{prod.name}</option>
                                        ))}
                                      </select>
                                      <div className="flex gap-1">
                                        <input
                                          type="number" min={1} value={addQty}
                                          onChange={(e) => setAddQty(Math.max(1, Number(e.target.value)))}
                                          className="w-12 border border-gray-300 rounded px-1 py-0.5 text-xs text-center"
                                        />
                                        <button onClick={handleAddItem} disabled={!addProductId}
                                          className="flex-1 border border-gray-300 rounded px-2 py-0.5 text-xs hover:bg-gray-50 disabled:opacity-40">
                                          추가
                                        </button>
                                      </div>
                                    </div>
                                    {/* 실시간 변경 합계 금액 표시 */}
                                    <div className="flex justify-between items-center text-xs font-semibold text-gray-700 py-1.5 border-t border-gray-100">
                                      <span>실시간 합계</span>
                                      <span>{editTotal.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex gap-1">
                                      <button onClick={() => setEditMode(false)}
                                        className="flex-1 border border-gray-300 rounded-lg py-1 text-xs hover:bg-gray-50">
                                        취소
                                      </button>
                                      <button onClick={handleEditSave} disabled={editSaving}
                                        className="flex-1 bg-gray-900 text-white rounded-lg py-1 text-xs hover:bg-gray-700 disabled:opacity-50">
                                        {editSaving ? "저장중..." : "저장"}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  /* 조회 모드 */
                                  <div className="flex flex-col gap-1.5">
                                    {orderProducts.length === 0 ? (
                                      <p className="text-xs text-gray-400 text-center py-1">품목 없음</p>
                                    ) : (
                                      <>
                                        <div className="max-h-32 overflow-y-auto flex flex-col gap-1">
                                          {orderProducts.map((it) => (
                                            <div key={it.id} className="flex items-center justify-between text-xs">
                                              <span className="text-gray-700 truncate flex-1">{it.productName}</span>
                                              <span className="text-gray-400 ml-1 flex-shrink-0">×{it.productQuantity}</span>
                                              <span className="text-gray-500 ml-1 flex-shrink-0">
                                                {(it.productPrice * it.productQuantity).toLocaleString()}원
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                        <div className="flex justify-between text-xs pt-1 border-t border-gray-100 font-semibold">
                                          <span>합계</span>
                                          <span>{order.totalPrice.toLocaleString()}원</span>
                                        </div>
                                      </>
                                    )}
                                    {order.status === "PENDING" && (
                                      <div className="flex gap-1 pt-1">
                                        <button onClick={enterEditMode}
                                          className="flex-1 border border-gray-300 rounded-lg py-1 text-xs hover:bg-gray-50">
                                          수정
                                        </button>
                                        <button onClick={handleCancel}
                                          className="flex-1 border border-gray-200 rounded-lg py-1 text-xs hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-gray-500">
                                          취소
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </aside>

      {/* Main Container */}
      <div className="flex-1 m-4 border border-gray-300 rounded-2xl flex flex-col bg-white overflow-hidden">
        <header className="text-center py-5 border-b border-gray-100">
          <Link href="/" className="text-2xl font-bold tracking-tight hover:opacity-70 transition-opacity">
            !Five Guys Coffee
          </Link>
        </header>

        {/* 토글 버튼 */}
        <div className="px-6 pt-4">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-1.5 transition-colors"
          >
            <span>{sidebarOpen ? "◀" : "▶"}</span>
            <span>내 주문 조회</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-3">
          <h2 className="text-base font-semibold">상품 목록</h2>
          <Link href="/cart" className="relative text-sm border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
            🛒 장바구니
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Product Grid */}
        <main className="flex-1 px-6 pb-4 overflow-y-auto">
          {loading && <div className="text-center text-gray-400 py-20 text-sm">로딩중...</div>}
          {!loading && products.length === 0 && (
            <div className="text-center text-gray-400 py-20 text-sm">등록된 상품이 없습니다.</div>
          )}
          <div className="grid grid-cols-3 gap-4">
            {paged.map((item) => (
              <Link key={item.id} href={`/products/${item.id}`}
                className="bg-white border border-gray-300 rounded-2xl aspect-square flex flex-col items-center justify-center p-4 hover:shadow-xl hover:border-transparent transition-all duration-200 group"
              >
                <div className="w-50 h-50 rounded-xl mb-3 overflow-hidden">
                  <img src={item.imageUrl || "/coffee_bean.jpg"} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <p className="font-semibold text-sm text-center text-gray-800 leading-tight">{item.name}</p>
                <p className="text-xl font-bold mt-1">{item.price.toLocaleString()}원</p>
                <p className={`text-xs mt-0.5 ${item.inventory === 0 ? "text-red-400" : "text-gray-400"}`}>
                  {item.inventory === 0 ? "품절" : `재고 ${item.inventory}개`}
                </p>
              </Link>
            ))}
          </div>
        </main>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 py-3">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  p === page ? "bg-gray-900 text-white" : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                }`}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">›</button>
          </div>
        )}

        <footer className="text-center py-3 border-t border-gray-100 text-gray-400 text-xs">
          ⓒ 2026 !Five_Guys All rights reserved.
        </footer>
      </div>
    </div>
  );
}
