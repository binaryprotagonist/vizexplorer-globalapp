import { useState } from "react";
import { Search } from "../../../settings/common/search";

export type TableSearchProps = {
  search: boolean;
  searchText: string;
  loading: boolean;
  localization: {
    searchPlaceholder: string;
    searchAriaLabel: string;
  };
  dataManager: {
    changeSearchText: (searchText: string) => void;
  };
  onSearchChanged: (searchText: string) => void;
};

export function TableSearch({
  search,
  searchText,
  loading,
  localization,
  dataManager,
  onSearchChanged
}: TableSearchProps) {
  const [searchValue, setSearchValue] = useState<string>(searchText);

  function handleSearchChange(searchText: string) {
    setSearchValue(searchText);
    dataManager.changeSearchText(searchText);
    onSearchChanged(searchText);
  }

  if (!search) return null;

  return (
    <Search
      data-testid={"table-search"}
      value={searchValue}
      onChange={(e) => handleSearchChange(e.target.value)}
      onClickClose={() => handleSearchChange("")}
      placeholder={localization.searchPlaceholder}
      inputProps={{
        "aria-label": localization.searchAriaLabel
      }}
      disabled={loading}
    />
  );
}
