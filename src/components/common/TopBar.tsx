import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate(); 

  return (
    <div className="w-[393px] h-14 relative flex items-center justify-center px-4">
      {/* 중앙 로고 */}
      <img
        src="/assets/MoamoaLogo.svg"
        alt="MOA MOA"
        className="h-5 absolute left-1/2 transform -translate-x-1/2"
      />

      {/* 우측 돋보기 아이콘 */}
      <div
        onClick={() => navigate("/search")} 
        className="absolute right-4 cursor-pointer"
      >
        <img src="/assets/Search.svg" alt="검색" className="w-5 h-5 select-none" />
      </div>
    </div>
  );
};

export default TopBar;
