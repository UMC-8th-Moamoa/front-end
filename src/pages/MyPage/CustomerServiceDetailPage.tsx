// src/pages/MyPage/CustomerServiceDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import {
  fetchCustomerInquiryDetail,
  type InquiryItem,
} from "../../services/mypage";

export default function CustomerServiceDetailPage() {
  const { state } = useLocation() as { state?: { inquiryId?: number } };
  const inquiryId = state?.inquiryId;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<InquiryItem | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!inquiryId) {
        setLoading(false);
        return;
      }
      const res = await fetchCustomerInquiryDetail(inquiryId);
      if (!mounted) return;
      setData(res.inquiry || null);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [inquiryId]);

  const title = data?.title ?? "";
  const content = data?.content ?? "";
  const date = data?.date ?? "";
  const username = data?.username ?? "";

  return (
    <div className="flex flex-col max-w-[393px] mx-auto text-black bg-white min-h-screen px-5 pt-[60px]">
      {/* 상단바 - 고정 */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-[393px] h-[60px] flex justify-between items-center px-5 z-50 border-b border-[#EAEAEA] bg-white">
        <div className="flex items-center gap-[8px]">
          <BackButton />
          <div className="w-[34px] h-[34px] bg-[#97B1FF] rounded-full" />
          <span className="text-[16px] font-semibold text-[#1F1F1F] font-pretendard">
            {username}
          </span>
        </div>
        <span className="text-[14px] font-normal text-[#B7B7B7] font-pretendard">
          {date}
        </span>
      </div>

      {/* 구분선 */}
      <div className="w-[350px] h-[1px] bg-[#E1E1E1] mx-auto" />

      {/* 본문 */}
      {loading ? (
        <div className="w-[350px] mx-auto mt-[40px] text-center text-[#B7B7B7]">
          불러오는 중…
        </div>
      ) : !data ? (
        <div className="w-[350px] mx-auto mt-[40px] text-center text-[#B7B7B7]">
          문의 내용을 찾을 수 없습니다.
        </div>
      ) : (
        <>
          {/* 제목 */}
          <div className="w-[350px] mx-auto text-[18px] font-medium text-[#1F1F1F] font-pretendard mt-[40px] mb-[8px]">
            {title}
          </div>

          {/* 내용 */}
          <div className="w-[350px] mx-auto text-[16px] font-normal text-[#1F1F1F] font-pretendard leading-[24px] whitespace-pre-line mb-[40px]">
            {content}
          </div>

          {/* 답변 없음/있음: status 기준으로 간단 표기 (서버가 답변 본문을 준다면 여기에 렌더) */}
          {data.status === "답변 보기" ? (
            <div className="w-[350px] mx-auto mt-[24px] text-center text-[16px] text-[#6282E1] font-pretendard">
              답변이 등록되었습니다. (상세 영역에 실제 답변이 있다면 여기에 렌더링)
            </div>
          ) : (
            <div className="w-[350px] mx-auto mt-[129px] text-center text-[18px] text-[#B7B7B7] font-pretendard">
              아직 답변이 없습니다
            </div>
          )}
        </>
      )}
    </div>
  );
}
