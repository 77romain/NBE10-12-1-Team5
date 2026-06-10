"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/backend/client";
import type { UserDto } from "@/type/account";

const PAGE_SIZE = 10;

type EditForm = {
  email: string;
  address: string;
  addressDetail: string;
  postcode: string;
};

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const half = 2;
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return (
    <div className="flex items-center justify-center gap-1 pt-3 pb-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
      >◀</button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
            p === currentPage ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 hover:bg-gray-50"
          }`}
        >{p}</button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
      >▶</button>
      <span className="ml-2 text-xs text-gray-400">{currentPage} / {totalPages} 페이지</span>
    </div>
  );
}

export default function AccountsPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    email: "",
    address: "",
    addressDetail: "",
    postcode: "",
  });

  const fetchUsers = async () => {
    try {
      const data: UserDto[] = await apiFetch("/api/user");
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = searchQuery.trim()
    ? users.filter((u) =>
        (u.email ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await apiFetch(`/api/user/${id}`, { method: "DELETE" });
      const updated: UserDto = await apiFetch(`/api/user/${id}`);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const formatDeletedLabel = (user: UserDto) => {
    const date = new Date(user.modifyDate).toLocaleDateString("ko-KR", {
      year: "numeric", month: "2-digit", day: "2-digit",
    });
    return `탈퇴고객(${date})`;
  };

  const startEdit = (user: UserDto) => {
    setEditingId(user.id);
    setEditForm({
      email: user.email ?? "",
      address: user.address,
      addressDetail: user.addressDetail,
      postcode: user.postcode,
    });
  };

  const cancelEdit = () => setEditingId(null);

  const handleUpdate = async (id: number) => {
    if (!editForm.email.trim() || !editForm.address.trim() || !editForm.postcode.trim()) {
      alert("이메일, 주소, 우편번호를 모두 입력해주세요.");
      return;
    }
    try {
      await apiFetch(`/api/user/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          email: editForm.email,
          address: editForm.address,
          addressDetail: editForm.addressDetail,
          postcode: editForm.postcode,
        }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...editForm } : u))
      );
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (dateStr: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString("ko-KR") : "-";

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          placeholder="이메일 또는 주소 검색..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-400"
        />
        <button className="border border-gray-300 rounded-lg px-5 py-2 text-sm hover:bg-gray-50 transition-colors">
          검색
        </button>
      </div>

      {/* Table */}
      <div className="border border-gray-300 rounded-xl overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-3 font-semibold text-gray-500 w-10">No.</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-500">이메일</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-500">주소</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-500">상세주소</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-500">우편번호</th>
              <th className="text-left py-3 px-3 font-semibold text-gray-500">등록일</th>
              <th className="py-3 px-3 w-36" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="text-center py-14 text-gray-400">로딩중...</td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-14 text-gray-400">계정이 없습니다.</td>
              </tr>
            )}
            {paginated.map((user, index) =>
              editingId === user.id ? (
                <tr key={user.id} className="border-b border-gray-100 bg-blue-50">
                  <td className="py-2 px-3 text-gray-500">{String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}</td>
                  <td className="py-2 px-3">
                    <input value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" />
                  </td>
                  <td className="py-2 px-3">
                    <input value={editForm.address} onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" />
                  </td>
                  <td className="py-2 px-3">
                    <input value={editForm.addressDetail} onChange={(e) => setEditForm((f) => ({ ...f, addressDetail: e.target.value }))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" />
                  </td>
                  <td className="py-2 px-3">
                    <input value={editForm.postcode} onChange={(e) => setEditForm((f) => ({ ...f, postcode: e.target.value }))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" />
                  </td>
                  <td className="py-2 px-3 text-gray-500">{formatDate(user.createDate)}</td>
                  <td className="py-2 px-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => handleUpdate(user.id)} className="border border-blue-400 text-blue-600 rounded-lg px-3 py-1 text-xs hover:bg-blue-50">저장</button>
                      <button onClick={cancelEdit} className="border border-gray-300 rounded-lg px-3 py-1 text-xs hover:bg-gray-100">취소</button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr
                  key={user.id}
                  className={`border-b border-gray-100 last:border-0 transition-colors ${
                    !user.email ? "bg-red-50 hover:bg-red-100" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-3 text-gray-500">{String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}</td>
                  <td className="py-3 px-3 truncate">
                    {user.email ? (
                      <span>{user.email}</span>
                    ) : (
                      <span className="text-red-500 font-medium">{formatDeletedLabel(user)}</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-gray-500 truncate">{user.address}</td>
                  <td className="py-3 px-3 text-gray-500 truncate">{user.addressDetail || "-"}</td>
                  <td className="py-3 px-3 text-gray-500 truncate">{user.postcode}</td>
                  <td className="py-3 px-3 text-gray-500 truncate">{formatDate(user.createDate)}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {user.email ? (
                      <div className="flex gap-1.5">
                        <button onClick={() => startEdit(user)} className="border border-gray-300 rounded-lg px-3 py-1 text-xs hover:bg-gray-100 transition-colors">수정</button>
                        <button onClick={() => handleDelete(user.id)} className="border border-gray-200 rounded-lg px-3 py-1 text-xs hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors">삭제</button>
                      </div>
                    ) : (
                      <span className="text-xs text-red-300">탈퇴</span>
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
