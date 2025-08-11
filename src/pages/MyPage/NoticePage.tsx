import React, { useState } from "react";
import BackIcon from "../../assets/backbutton.svg";
import DownIcon from "../../assets/Down_gray.svg";
import UpIcon from "../../assets/Up_gray.svg";

const notices = [
  {
    id: 1,
    date: "2025.06.13",
    title: "앱의 알림 문제 피드백",
    content:
      "Pharetra tortor suscipit erat arcu ante non. Cursus fames dictumst morbi et eget euismod. Tincidunt cursus adipiscing donec sagittis arcu vel et viverra. Adipiscing leo pharetra tincidunt curabitur neque ut lectus netus dolor. Volutpat aliquam vulputate nec facilisis ac elit sagittis pellentesque semper.",
  },
  {
    id: 2,
    date: "2025.06.13",
    title: "앱의 알림 문제 피드백",
content:
      "Pharetra tortor suscipit erat arcu ante non. Cursus fames dictumst morbi et eget euismod. Tincidunt cursus adipiscing donec sagittis arcu vel et viverra. Adipiscing leo pharetra tincidunt curabitur neque ut lectus netus dolor. Volutpat aliquam vulputate nec facilisis ac elit sagittis pellentesque semper.",  },
  {
    id: 3,
    date: "2025.06.13",
    title: "앱의 알림 문제 피드백",
content:
      "Pharetra tortor suscipit erat arcu ante non. Cursus fames dictumst morbi et eget euismod. Tincidunt cursus adipiscing donec sagittis arcu vel et viverra. Adipiscing leo pharetra tincidunt curabitur neque ut lectus netus dolor. Volutpat aliquam vulputate nec facilisis ac elit sagittis pellentesque semper.",  },
];

const NoticePage = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleNotice = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-[350px] mx-auto px-4 mt-[15px] bg-white text-black min-h-screen">
      {/* 상단바 */}
      <div className="relative flex items-center justify-center mb-5 h-[30px]">
        {/* BackIcon - 이미지로 사용 */}
        <img
          src={BackIcon}
          alt="back"
          className="absolute left-[2px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] cursor-pointer"
          onClick={() => window.history.back()}
        />

        <h1 className="text-[18px] font-bold text-[#1F1F1F]  font-pretendard">
          공지사항
        </h1>
      </div>

      {/* 공지사항 리스트 */}
      <div>
        {notices.map((notice, index) => (
          <div key={notice.id} className="w-full ">
<button
  onClick={() => toggleNotice(notice.id)}
  className="w-full flex flex-col items-start "
>
  {/* 날짜 + 화살표 한 줄 */}
<div className="w-full flex justify-between items-center">
  <p className="text-[12px] text-[#B7B7B7] font-medium  font-pretendard">
    {notice.date}
  </p>
  <img
    src={openId === notice.id ? UpIcon : DownIcon}
    alt="toggle"
    className="w-[30px] h-[30px] self-center translate-y-[10px]" 
  />
</div>


  {/* 제목 아래 줄 */}
  <p className="mt-[0px] text-[18px] font-bold text-[#1F1F1F] leading-[20px] font-pretendard"style={{ fontWeight: 700 }}
>
    {notice.title}
  </p>
</button>

            {/* 펼쳐진 본문 내용 */}
            {openId === notice.id && (
              <p className="mt-2 text-[16px] leading-[20px] text-[#1F1F1F] font-pretendard font-normal">
                {notice.content}
              </p>
            )}

            {/* 구분선 */}
            {index < notices.length - 1 && (
              <hr className="my-[12px] border-t border-[#E1E1E1]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticePage;
