// SearchTopBar.tsx
import BackButton from "../../common/BackButton";
import InputBox from "../../common/InputBox";

interface SearchTopBarProps {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
}

const SearchTopBar = ({ searchKeyword, setSearchKeyword }: SearchTopBarProps) => {
  return (
    <div className="w-full max-w-[393px] mx-auto flex items-center gap-3 px-4 pt-2">
      {/* 뒤로가기 */}
      <div className="shrink-0">
        <BackButton />
      </div>

      {/* 검색창: 303x46 고정 + 넘침 방지 */}
      <div className="relative w-[303px] h-[46px] shrink-0">
        <InputBox
          type="search"
          placeholder="아이디, 이름을 검색하세요"
          hasBorder={false}
          className="!w-[303px] h-[46px] rounded-xl bg-[#EDEDED] placeholder:text-[#B7B7B7] text-[#000] text-[16px] pl-4 pr-11"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <img
          src="/assets/Search.svg"
          alt="검색"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-[21px] h-[21px]"
        />
      </div>
    </div>
  );
};

export default SearchTopBar;