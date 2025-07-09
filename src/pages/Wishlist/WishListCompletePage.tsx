import BottomNavigation from "../../components/common/BottomNavigation";
import WishListSection from "../../components/WishList/WishListSection";

const WishListRegisterCompletePage = () => {
  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="max-w-[393px] w-full flex flex-col justify-center">
        {/* 등록 완료 안내 박스 */}
        <div className="w-[350px] h-[77px] mt-[21px] mx-auto bg-[#F8F8F8] rounded-[12px] shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-[18px] text-[#000000]">위시리스트 등록 완료</p>
          <p className="text-[16px] text-[#A0A0A0]">언제든 수정, 삭제할 수 있습니다</p>
        </div>

        {/* 나의 위시리스트 리스트 */}
        <WishListSection />

        {/* 추가 버튼 */}
        <button
          onClick={() => window.location.href = "/wishlist/register"}
          className="w-[70px] h-[70px] rounded-full bg-[#D9D9D9] flex items-center justify-center fixed bottom-[84px] right-5 z-50"
        >
          <img src="/assets/Plus.svg" alt="추가하기" className="w-[24px] h-[24px]" />
        </button>

        <BottomNavigation />
      </div>
    </main>
  );
};

export default WishListRegisterCompletePage;
