const AutoInputSection = () => {
  return (
    <section className="w-full max-w-[393px] px-4 flex flex-col items-center gap-4">
      {/* 회색 이미지 박스 (이미지 제거, 아이콘만 중앙에) */}
      <div className="w-[350px] h-[201px] bg-[#D9D9D9] rounded-[20px] flex mt-3 items-center justify-center">
      </div>

      {/* 제품명 + 가격 (텍스트) */}
      <div className="w-full max-w-[350px] flex flex-col items-start gap-1">
        <p className="text-[20px] text-black">제품명</p>
        <p className="text-[24px] font-bold text-black">0원</p>
      </div>

      {/* 링크/사진 넣기 버튼 영역 */}
      <div className="w-[350px] rounded-xl border border-gray-300 flex">
        {/* 링크 버튼 */}
        <button className="flex-1 flex flex-col items-center justify-center gap-1 py-3">
          <img src="/assets/Link.svg" alt="링크" className="w-[30px] h-[30px]" />
          <span className="text-sm text-gray-400">링크 붙여넣기</span>
        </button>

        {/* 구분선 */}
        <div className="w-px bg-gray-300" />

        {/* 사진 버튼 */}
        <button className="flex-1 flex flex-col items-center justify-center gap-1 py-3">
          <img src="/assets/Photo.svg" alt="사진" className="w-[30px] h-[30px]" />
          <span className="text-sm text-gray-400">사진 넣기</span>
        </button>
      </div>

      {/* 안내 문구 */}
      <p className="w-[350px] text-[12px] text-gray-500 text-left ml-5 leading-relaxed">
        내가 갖고 싶은 선물의 <span className="font-semibold">링크</span> 혹은
        <span className="font-semibold"> 캡처 사진</span>을 아래에 첨부하면<br />
        자동으로 선물을 입력해줘요!
      </p>
    </section>
  );
};

export default AutoInputSection;
