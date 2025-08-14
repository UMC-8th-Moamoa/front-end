// src/pages/MyPage/CustomerServicePage.tsx
import React, { useEffect, useState, useMemo } from "react";
import BackIcon from "../../assets/backbutton.svg";
import CustomerCard from "../../components/mypage/CustomerCard";
import PlusIcon from "../../assets/Plus.svg";
import { useNavigate } from "react-router-dom";
import {
  fetchCustomerInquiries,
  type InquiryItem,
} from "../../services/mypage";

const ITEMS_PER_PAGE = 8;

export default function CustomerServicePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<InquiryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)),
    [total]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const res = await fetchCustomerInquiries(); // 서버가 페이징 제공하면 {page,size} 넘겨도 됨
      if (!mounted) return;
      setList(res.inquiries || []);
      setTotal(res.total || (res.inquiries?.length ?? 0));
      setLoading(false);
      setCurrentPage(1); // 새로 고치면 1페이지부터
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const currentItems = useMemo(() => {
    // 서버가 페이징 미제공이면 클라이언트에서 슬라이싱
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return list.slice(start, end);
  }, [list, currentPage]);

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="relative flex flex-col items-center bg-white min-h-screen mx-auto text-black pb-[120px]">
      {/* 상단바 - 고정 */}
      <div
        className="fixed top-0 left-1/2 transform -translate-x-1/2 w-[350px] h-[60px] flex items-center justify-center z-50 border-b border-[#EAEAEA]"
        style={{ backgroundColor: "#FFF" }}
      >
        <img
          src={BackIcon}
          alt="back"
          className="absolute left-[20px] cursor-pointer w-[40px] h-[40px]"
          onClick={() => window.history.back()}
        />
        <h1 className="text-center font-pretendard text-[18px] font-bold leading-[22px] text-[#1F1F1F]">
          고객센터
        </h1>
      </div>

      {/* 상단바 높이만큼 패딩 */}
      <div className="h-[60px]" />

      {/* 목록 */}
      <div className="ml-[20px] flex flex-col items-center gap-[18px] w-[350px]">
        {loading ? (
          <div className="w-[350px] text-center text-[#B7B7B7]">불러오는 중…</div>
        ) : currentItems.length === 0 ? (
          <div className="w-[350px] text-center text-[#B7B7B7]">문의 내역이 없습니다.</div>
        ) : (
          currentItems.map((item) => (
            <CustomerCard
              key={item.id}
              title={item.title}
              content={item.content}
              date={item.date}
              status={item.status}
              isLocked={item.isLocked}
              username={item.username}
              onClick={() => {
                if (item.status === "답변 보기") {
                  // 기존 라우트 형식 유지: state로 id만 넘김 → 상세에서 조회
                  navigate("/mypage/customer-service/detail", {
                    state: { inquiryId: item.id },
                  });
                }
              }}
            />
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {!loading && total > ITEMS_PER_PAGE && (
        <div className="fixed bottom-[24px] flex justify-center w-full left-0">
          <div className="flex items-center gap-[14px]">
            <button
              onClick={handlePrevPage}
              className="text-[24px] font-bold font-pretendard text-black"
              disabled={currentPage === 1}
            >
              &#8249;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`text-[14px] ${
                  currentPage === i + 1
                    ? "text-[#6282E1] underline font-pretendard font-bold"
                    : "text-black"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={handleNextPage}
              className="text-[20px] font-pretendard font-bold text-black"
              disabled={currentPage === totalPages}
            >
              &#8250;
            </button>
          </div>
        </div>
      )}

      {/* 플로팅 + 버튼 (문의 작성) */}
      <button
        onClick={() => navigate("/customer-service/write")}
        className="fixed bottom-[24px] right-[20px] w-[56px] h-[56px] rounded-full bg-[#6282E1] shadow-[2px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center z-50"
      >
        <img src={PlusIcon} alt="문의 작성" className="w-[24px] h-[24px]" />
      </button>
    </div>
  );
}
