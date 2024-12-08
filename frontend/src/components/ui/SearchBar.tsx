import { Search } from "lucide-react";
import React, { useState } from "react";

const SearchBar: React.FC<{ onSearch: (query: string) => void }> = ({
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="relative mr-4 w-full">
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={handleChange}
        className="border-light-muted/30 dark:border-dark-muted/30 focus:ring-light-primary dark:focus:ring-dark-primary dark:text-dark-text-primary w-full rounded-lg border bg-transparent px-4 py-3 pl-10 text-sm outline-none focus:ring-2"
      />
      <Search className="text-light-text-secondary dark:text-dark-text-secondary absolute left-3 top-2.5 mt-1 h-4 w-4" />
    </div>
  );
};

export default SearchBar;
