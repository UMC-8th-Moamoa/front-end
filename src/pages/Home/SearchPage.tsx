import { useState } from "react";
import RecentSearchList from "../../components/HomePage/Search/RecentSearchPage";
import SearchTopBar from "../../components/HomePage/Search/SearchTopBar";
import SearchUserList from "../../components/HomePage/Search/SearchUserList";

const SearchPage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    // ✅ 뷰포트 고정 + 스크롤 완전 차단
    <main className="fixed inset-0 bg-white flex justify-center overflow-hidden overscroll-none">
      <div className="w-full max-w-[393px] h-full flex flex-col items-center relative overflow-hidden">
        {/* 상단 검색 바 */}
        <header className="sticky top-0 bg-white z-50 w-full">
          <SearchTopBar
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
          />
        </header>

        {/* ✅ 내부 컨텐츠도 스크롤 차단 */}
        <div className="flex-1 w-full px-4 mt-4 mb-[60px] overflow-hidden">
          {searchKeyword.trim() === "" ? (
            <RecentSearchList />
          ) : (
            <SearchUserList keyword={searchKeyword} />
          )}
        </div>
      </div>
    </main>
  );
};

export default SearchPage;
