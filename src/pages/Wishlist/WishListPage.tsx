import WishListSection from "../../components/WishList/WishListSection";

const WishListPage = () => {
  return (
    <main className="w-full max-w-[390px] mx-auto bg-white min-h-screen">
      {/* 페이지 상단 마진 */}
      <div className="pt-6">
        <WishListSection />
      </div>
    </main>
  );
};

export default WishListPage;
