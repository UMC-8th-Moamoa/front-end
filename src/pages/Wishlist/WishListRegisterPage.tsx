import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WishListRegisterTopBar from "../../components/WishList/WishListRegisterTopBar";
import AutoInputSection from "../../components/WishList/AutoInputSection";
import ManualInputSection from "../../components/WishList/ManualInputSection";
import Button from "../../components/common/Button";

const WishListRegisterPage = () => {
  const [selectedTab, setSelectedTab] = useState<"auto" | "manual">("auto");
  const [isPrivate, setIsPrivate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 페이지 진입 시 body 스크롤 막기
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = () => {
    navigate("/wishlist", { state: { showToast: true } });
  };

  return (
    <main className="h-screen w-screen bg-white flex justify-center overflow-hidden">
      <div className="w-full max-w-[393px] h-full flex flex-col relative overflow-hidden">
        {/* 상단 탭바 */}
        <WishListRegisterTopBar
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        />

        {/* 입력 영역 */}
        <div className="flex-grow px-4 pt-4 pb-[130px] overflow-hidden">
          {selectedTab === "auto" && <AutoInputSection />}
          {selectedTab === "manual" && <ManualInputSection />}
        </div>

        {/* 버튼 & 체크박스 영역 */}
        <div className="w-full max-w-[393px] px-4 absolute bottom-[35px] z-20 bg-white">
          <div className="flex flex-col gap-2 py-3">
            <label className="flex items-center space-x-2 ml-3 mb-1 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
                className="w-4 h-4 accent-gray-400"
              />
              <span>{isPrivate ? "비공개" : "공개"}</span>
            </label>
            <Button
              variant="primary"
              size="medium"
              width="full"
              onClick={handleSubmit}
              className="h-[50px] mx-auto text-[20px] !bg-[#6282E1] font-semibold"
            >
              등록하기
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WishListRegisterPage;
