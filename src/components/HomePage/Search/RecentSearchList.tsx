import SearchUserItem from "./SearchUserItem";
import { dummyRecentSearches } from "./RecentSearchDummy";

const RecentSearchList = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-[350px] px-4 space-y-2">
        <h2 className="text-[16px] font-semibold text-[#6282E1] mb-2">최근 검색</h2>
        {dummyRecentSearches.map((user, index) => (
          <SearchUserItem
            key={index}
            name={user.name}
            userId={user.userId}
            profile={user.profile}
            showDeleteButton={true}
            onDelete={() => console.log(`Deleted ${user.userId}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentSearchList;
