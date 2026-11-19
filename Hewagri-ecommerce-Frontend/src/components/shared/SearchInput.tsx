import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { clearFilters, setSearch } from "@/lib/redux/slices/filterSlice";
import { XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";

const SearchInput = () => {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.filter.search);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(event.target.value));
  };

  const handleClear = () => {
    dispatch(clearFilters());
  };

  return (
    <form className="w-full mx-auto">
      <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
        <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-3 ps-10 text-sm text-black bg-light outline-none placeholder:text-gray-500"
          placeholder="Rechercher des fruits, des cereales ..."
          value={search}
          onChange={handleSearchChange}
          required
        />
        {search && search.length > 0 && (
          <button
            onClick={() => handleClear()}
            type="button"
            className="text-white absolute inset-y-0 right-0 bg-red-400 hover:bg-red-500  font-medium text-sm px-4 py-2 transition-all duration-150 ease-in-out inline-flex items-center justify-center"
          >
            <span>Annuler</span>
            <XMarkIcon className="text-white w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchInput;
