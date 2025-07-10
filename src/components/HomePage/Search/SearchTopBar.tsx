import BackButton from "../../common/BackButton";
import InputBox from "../../common/InputBox";

interface SearchTopBarProps {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
}

const SearchTopBar = ({ searchKeyword, setSearchKeyword }: SearchTopBarProps) => {
  return (
    <div className="w-full flex items-center justify-between px-4 pt-2">
      {/* 뒤로가기 버튼 */}
      <BackButton />

      {/* 검색창 */}
      <div className="relative w-[303px] h-[46px]">
        <InputBox
          type="search"
          placeholder="아이디, 이름을 검색하세요"
          hasBorder={false}
          className="w-full h-full rounded-xl bg-[#EDEDED] text-[16px] pr-10"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <img
          src="/assets/Search.svg"
          alt="검색"
          className="absolute top-1/2 right-3 transform -translate-y-1/2 w-6 h-6"
        />
      </div>
    </div>
  );
};

export default SearchTopBar;
