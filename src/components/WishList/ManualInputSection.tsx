import InputBox from "../common/InputBox";

const ManualInputSection = () => {
  return (
    <section className="w-full max-w-[393px] px-4 flex mt-3 flex-col items-center gap-4">
      {/* 회색 이미지 박스 */}
      <div className="w-[350px] h-[201px] bg-[#D9D9D9] rounded-[20px] flex items-center justify-center">
        <img src="/assets/Photo.svg" alt="사진 업로드 아이콘" className="w-10 h-10" />
      </div>

      {/* 제품명 입력 */}
      <InputBox
        placeholder="제품명을 입력해 주세요"
        className="w-[350px] h-[44px] bg-gray-200 mt-2 placeholder:text-gray-400 rounded-xl"
      />

      {/* 가격 입력 */}
      <InputBox
        placeholder="가격을 입력해 주세요"
        className="w-[350px] h-[44px] bg-gray-200 placeholder:text-gray-400 rounded-xl"
        type="number"
      />
    </section>
  );
};

export default ManualInputSection;
