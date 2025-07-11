import React, { useState } from "react";
import BackButton from "../../components/common/BackButton";
import BottomNavigation from "../../components/common/BottomNavigation";
import type { MenuType } from "../../components/common/BottomNavigation";
import DownIcon from "../../assets/Down.svg";
import UpIcon from "../../assets/Up.svg";

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
    content: "공지 내용입니다. 예시 텍스트입니다.",
  },
  {
    id: 3,
    date: "2025.06.13",
    title: "앱의 알림 문제 피드백",
    content: "공지 내용입니다. 예시 텍스트입니다.",
  },
];

const NoticePage = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleNotice = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const handleNavigate = (menu: MenuType) => {
    // 네비게이션 처리
  };

  return (
    <div className="max-w-[430px] mx-auto px-4 pt-4 pb-20 bg-white text-black min-h-screen">
      {/* 상단 바 */}
      <div className="relative flex items-center justify-center mb-4">
        <div className="absolute left-0">
          <BackButton />
        </div>
        <h1 className="text-lg font-semibold">공지사항</h1>
      </div>

      {/* 공지사항 목록 */}
      <div className="space-y-3">
        {notices.map((notice, index) => (
          <div
            key={notice.id}
            className="border border-[#E5E5E5] rounded-[10px] px-4 py-3"
          >
            <button
              className="w-full flex justify-between items-center"
              onClick={() => toggleNotice(notice.id)}
            >
              <div className="text-left">
                <p className="text-[11px] text-gray-400">{notice.date}</p>
                <p className="text-[15px] font-semibold">{notice.title}</p>
              </div>
              <div className="w-[30px] h-[30px]">
                <img
                  src={openId === notice.id ? UpIcon : DownIcon}
                  alt="toggle icon"
                  className="w-full h-full"
                />
              </div>
            </button>

            {/* 펼쳐진 내용과 구분선 */}
            {openId === notice.id && (
              <>
                <div className="mt-3 text-[13px] text-gray-700 leading-snug">
                  {notice.content}
                </div>
                {index < notices.length - 1 && (
                  <hr className="my-3 border-t border-[#E5E5E5]" />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <BottomNavigation active="mypage" onNavigate={handleNavigate} />
    </div>
  );
};

export default NoticePage;
