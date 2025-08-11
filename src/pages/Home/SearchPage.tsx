import { useState } from "react";
import SearchTopBar from "../../components/HomePage/Search/SearchTopBar";
import RecentSearchList from "../../components/HomePage/Search/RecentSearchList";
import SearchUserList from "../../components/HomePage/Search/SearchUserList";

const SearchPage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[393px] flex flex-col items-center relative">
        {/* 상단 검색 바 */}
        <header className="sticky top-0 bg-white z-50 w-full">
          <SearchTopBar
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
          />
        </header>

        {/* 검색 결과 또는 최근 검색 리스트 */}
        <div className="flex-1 w-full px-4 mt-4 mb-[60px] overflow-y-auto">
          {searchKeyword.trim() === "" ? (
            <RecentSearchList />
          ) : (
            <SearchUserList keyword={searchKeyword} />
          )}
        </div>

        {/* 하단 네비게이션 */}
        <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[393px] bg-white z-50">
        </footer>
      </div>
    </main>
  );
};

export default SearchPage;
