"use client";

import React from "react";
import CategoriesFilter from "./CategoriesFilter";
import CooperativesFilter from "./CooperativesFilter";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { clearFilters } from "@/lib/redux/slices/filterSlice";

const Filter = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.filter.categoryIds);
  const cooperatives = useAppSelector((state) => state.filter.cooperativeIds);

  const handleClear = () => {
    dispatch(clearFilters());
  };

  return (
    <aside className="w-full mx-auto bg-light p-5 rounded-lg overflow-hidden divide-y-[1px] divide-black/10">
      {categories.length > 0 || cooperatives.length > 0 ? (
        <button
          type="button"
          onClick={() => handleClear()}
          className="py-3 text-white flex flex-row w-full items-center justify-center space-x-5  bg-red-400 hover:bg-red-500"
        >
          <span>Clear Filter</span>
          <XMarkIcon className="w-5 h-5" />
        </button>
      ) : null}

      <CategoriesFilter />
      <CooperativesFilter />
    </aside>
  );
};

export default Filter;
