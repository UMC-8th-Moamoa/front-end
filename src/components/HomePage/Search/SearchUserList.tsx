import { useState, useEffect } from "react";
import SearchUserItem from "./SearchUserItem";
import { searchUserDummy } from "./SearchUserDummy";

interface SearchUserListProps {
  keyword: string;
}

const SearchUserList = ({ keyword }: SearchUserListProps) => {
  const [filteredUsers, setFilteredUsers] = useState(searchUserDummy);

  useEffect(() => {
    if (keyword.trim() === "") {
      setFilteredUsers([]);
    } else {
      const lowerKeyword = keyword.toLowerCase();
      const result = searchUserDummy.filter(
        (user) =>
          user.name.includes(lowerKeyword) ||
          user.userId.toLowerCase().includes(lowerKeyword)
      );
      setFilteredUsers(result);
    }
  }, [keyword]);

  return (
    <div className="w-[350px] space-y-2">
      {filteredUsers.map((user, index) => (
        <SearchUserItem
          key={`${user.userId}-${index}`}
          name={user.name}
          userId={user.userId}
        />
      ))}
    </div>
  );
};

export default SearchUserList;
