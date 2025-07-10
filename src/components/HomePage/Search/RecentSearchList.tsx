// components/Search/RecentSearchList.tsx

import SearchUserItem from "./SearchUserItem";
import { dummyRecentSearches } from "./RecentSearchDummy";

const RecentSearchList = () => {
  return (
    <div className="w-[350px] space-y-2">
      <h2 className="text-[16px] font-semibold text-black mb-2">최근 검색</h2>
      {dummyRecentSearches.map((user, index) => (
        <SearchUserItem
          key={index}
          name={user.name}
          userId={user.userId}
          showDeleteButton={true}
          onDelete={() => console.log(`Deleted ${user.userId}`)}
        />
      ))}
    </div>
  );
};

export default RecentSearchList;
