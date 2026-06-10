"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { label: "대시보드", href: "/admin/dashboard" },
  { label: "계정 관리", href: "/admin/accounts" },
  { label: "주문 관리", href: "/admin/orders" },
  { label: "상품 관리", href: "/admin/products" },
];

interface Toast {
  id: string;
  type: "CREATE_ORDER" | "UPDATE_ORDER";
  message: string;
  orderId: number;
  totalPrice: number;
}

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const duration = 8000; // 8 seconds
  const step = 100;
  const decrement = (step / duration) * 100;

  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - decrement));
    }, step);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, decrement]);

  useEffect(() => {
    if (progress <= 0) {
      onClose(toast.id);
    }
  }, [progress, toast.id, onClose]);

  const isCreate = toast.type === "CREATE_ORDER";

  const handleToastClick = () => {
    // Navigate or trigger action
    window.location.href = "/admin/orders";
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleToastClick}
      className={`pointer-events-auto cursor-pointer relative overflow-hidden flex flex-col p-4 rounded-xl shadow-lg border bg-white/95 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
        isCreate
          ? "border-emerald-100 shadow-emerald-50/50"
          : "border-amber-100 shadow-amber-50/50"
      }`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isCreate ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
          }`}
        >
          {isCreate ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 animate-bounce"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 animate-pulse"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isCreate ? "text-emerald-700" : "text-amber-700"
              }`}
            >
              {isCreate ? "신규 주문" : "주문 수정"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(toast.id);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
          <p className="text-sm font-bold text-gray-900 mt-0.5">{toast.message}</p>

          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
            <span>
              주문번호: <strong className="text-gray-700 font-semibold">#{toast.orderId}</strong>
            </span>
            <span>
              총금액: <strong className="text-gray-700 font-semibold">{toast.totalPrice.toLocaleString()}원</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-100 w-full">
        <div
          className={`h-full transition-all duration-100 ease-linear ${
            isCreate ? "bg-emerald-500" : "bg-amber-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0.06, start); // soft volume
        gain.gain.exponentialRampToValueAtTime(0.00001, start + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(start);
        osc.stop(start + duration);
      };
      
      const now = ctx.currentTime;
      playTone(523.25, now, 0.35); // C5 tone
      playTone(659.25, now + 0.12, 0.45); // E5 tone
    } catch (err) {
      console.warn("Sound play failed:", err);
    }
  };

  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
    const eventSource = new EventSource(`${apiBaseUrl}/api/notifications/subscribe`);

    eventSource.addEventListener("connect", (event) => {
      console.log("SSE Connected:", event.data);
    });

    eventSource.addEventListener("newOrder", (event) => {
      try {
        const data = JSON.parse(event.data) as Omit<Toast, "id">;
        const newToast: Toast = {
          ...data,
          id: `${Date.now()}-${Math.random()}`,
        };
        
        // Add toast to the UI
        setToasts((prev) => [...prev, newToast]);
        
        // Play notification sound
        playChime();

        // Dispatch custom event to notify OrderPage to refresh the list silently
        window.dispatchEvent(new CustomEvent("refresh-orders"));
      } catch (err) {
        console.error("Failed to parse SSE event data:", err);
      }
    });

    eventSource.onerror = (error) => {
      // 30분 타임아웃 만료 또는 일시적 네트워크 끊김 시 브라우저가 백그라운드에서 자동 재연결을 시도합니다.
      // 정상적인 연결 재수립 과정이므로 콘솔에 빨간 에러창이 뜨지 않도록 warn 로그로 처리합니다.
      console.warn("SSE 연결이 만료되었거나 끊겼습니다. 브라우저가 자동 재연결을 시도합니다.", error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 relative">
      <div className="border border-gray-300 rounded-2xl min-h-[calc(100vh-2rem)] flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <header className="text-center py-5 border-b border-gray-100">
          <Link href="/" className="text-2xl font-bold tracking-tight hover:opacity-70 transition-opacity">
            !Five Guys Coffee
          </Link>
        </header>

        {/* Body */}
        <div className="flex flex-1">
          {/* Left Sidebar */}
          <aside className="w-44 border-r border-gray-100 p-4 flex flex-col gap-3 flex-shrink-0">
            {/* Admin Profile */}
            <div className="flex flex-col items-center gap-1.5 py-4 border-b border-gray-100">
              <div className="w-14 h-14 border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>
              <p className="text-xs text-gray-400 text-center break-all">
                admin@coffee.com
              </p>
              <p className="text-xs font-semibold text-gray-600">관리자</p>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 pt-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-2 px-3 rounded-lg text-sm font-medium text-center border transition-colors ${
                    pathname === item.href
                      ? "bg-gray-100 border-gray-300 text-gray-900"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 min-w-0">{children}</main>
        </div>

        {/* Footer */}
        <footer className="text-center py-3 border-t border-gray-100 text-gray-400 text-xs">
          ⓒ 2026 !Five_Guys All rights reserved.
        </footer>
      </div>

      {/* Floating Notification Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-96 max-w-[calc(100vw-3rem)] pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
}
