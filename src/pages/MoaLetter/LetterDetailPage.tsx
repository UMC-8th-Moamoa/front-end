import BackButton from "../../components/common/BackButton";
import React, { useRef, useState } from "react";

function LetterDetailPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
const [currentPage, setCurrentPage] = useState(1);
const [totalPage, setTotalPage] = useState(1);

const handleScroll = () => {
  const el = scrollRef.current;
  if (!el) return;

  const scrollTop = el.scrollTop;
  const pageHeight = el.clientHeight;
  const fullHeight = el.scrollHeight;

  const total = Math.ceil(fullHeight / pageHeight);
  const current = Math.floor(scrollTop / pageHeight) + 1;

  setCurrentPage(current);
  setTotalPage(total);
};

  return (
    <div
      className="w-[393px] h-[794px] mx-auto font-pretendard flex flex-col items-center px-4 "
      style={{
        background: "linear-gradient(169deg, #6282E1 1.53%, #FEC3FF 105.97%)",
      }}
    >

      
      {/* 상단바 */}
      <div className="relative w-[350px] flex items-center absolute left mb-[26px]">
        <BackButton />
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold text-white">
          황유민님의 편지
        </h1>
      </div>

      {/* 흰색 카드 박스 (배경 강제 흰색) */}
      <div
        className="w-[350px] h-[676px] rounded-[20px] flex flex-col justify-end items-center"
        style={{
          backgroundColor: "#FFFFFF",
          
        }}
      >
        {/* 편지 내용 */}
<div
  ref={scrollRef}
  onScroll={handleScroll}
  className="w-full h-full overflow-y-auto text-[16px] leading-relaxed text-[#1F1F1F] px-[19px] pt-[16px] pb-[0px] box-border"
>
Vitae lobortis laoreet nam faucibus amet proin mauris eget urna. Suspendisse sit posuere vitae quam adipiscing. Arcu mattis fusce orci lorem tristique lectus vulputate. Ultrices libero tristique leo in mauris vitae ridiculus sed id. Facilisis id justo vitae at sit etiam orci ultricies ut. Tempus dignissim enim amet vel dictum ultrices. Ut elementum sit fermentum etiam. Ipsum erat scelerisque pharetra iaculis.
Aenean at eleifend pharetra mattis nulla eget elementum eget rhoncus. Diam penatibus vel sagittis adipiscing id in gravida. Felis a cursus purus quis cursus posuere maecenas elementum. Convallis ultricies leo rutrum aenean arcu eget at. Cursus semper pharetra et arcu ut cras ullamcorper.
        </div>

       
      </div> {/* 페이지 인디케이터 */}
<div className="mt-[16px] text-[#FFF] text-[18px] font-medium text-center">
  {currentPage} / {totalPage}
</div>

    </div>
  );
}

export default LetterDetailPage;
