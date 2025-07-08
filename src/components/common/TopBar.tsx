const TopBar = () => {
  return (
    <div className="w-full h-14 relative flex items-center justify-center px-4">

      <img
        src="/MoamoaLogo.svg"
        alt="MOA MOA"
        className="h-5 absolute left-1/2 transform -translate-x-1/2"
      />

      <div
        onClick={() => {
          // 검색 클릭 핸들링
          // 사파리에서 강제로 테두리 스타일 입혀서 일단은 버튼대신 온클릭으로 대체했습니다 ㅜㅜ
        }}
        className="absolute right-4 cursor-pointer"
      >
        <img src="/Search.svg" alt="검색" className="w-5 h-5 select-none" />
      </div>
    </div>
  );
};

export default TopBar;
