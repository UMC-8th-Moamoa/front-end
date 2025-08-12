// pages/MoaLetter/LetterDetailPage.tsx (교체용 최소 수정본)
import React, { useRef, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import { getLetterById, type LetterItem } from "../../api/letters";

export default function LetterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [letter, setLetter] = useState<LetterItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const total = Math.ceil(el.scrollHeight / el.clientHeight);
    const current = Math.floor(el.scrollTop / el.clientHeight) + 1;
    setCurrentPage(current);
    setTotalPage(total);
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getLetterById(Number(id));
        setLetter(data);
      } catch {
        setError("편지 불러오기 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="w-[393px] mx-auto p-4">불러오는 중...</div>;
  if (error || !letter) return <div className="w-[393px] mx-auto p-4">{error || "데이터 없음"}</div>;

  const senderName =
    (location.state as any)?.senderName || `보낸이 ${letter.senderId}`;

  return (
    <div
      className="w-[393px] h-[794px] mx-auto font-pretendard flex flex-col items-center px-4 "
      style={{ background: "linear-gradient(169deg, #6282E1 1.53%, #FEC3FF 105.97%)" }}
    >
      {/* 상단바 */}
      <div className="relative w-[350px] flex items-center absolute left mb-[26px]">
        <BackButton />
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold text-white">
          {senderName}님의 편지
        </h1>
      </div>

      {/* 카드 */}
      <div
        className="w-[350px] h-[676px] rounded-[20px] flex flex-col justify-end items-center"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full h-full overflow-y-auto text-[16px] leading-relaxed text-[#1F1F1F] px-[19px] pt-[16px] pb-[0px] box-border whitespace-pre-wrap"
        >
          {/* 봉투 중앙 이미지가 있으면 상단에 노출 */}
          {letter.envelopeImageUrl && (
            <img
              src={letter.envelopeImageUrl}
              alt="envelope"
              className="w-full h-[160px] object-cover rounded-[12px] mb-3"
            />
          )}
          {letter.content}
        </div>
      </div>

      {/* 페이지 인디케이터 */}
      <div className="mt-[16px] text-[#FFF] text-[18px] font-medium text-center">
        {currentPage} / {totalPage}
      </div>
    </div>
  );
}
