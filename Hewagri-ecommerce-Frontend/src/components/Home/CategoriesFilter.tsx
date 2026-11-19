import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { fetchCategories } from "@/lib/redux/slices/categoriesSlice";
import { clearFilters, setCategoryIds } from "@/lib/redux/slices/filterSlice";
import { PlusIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

const CategoriesFilter = ({}) => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);

  const [catOpen, setCatOpen] = useState<boolean>(true);
  const categoryIds = useAppSelector((state) => state.filter.categoryIds);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([
    ...categoryIds,
  ]);

  useEffect(() => {
    dispatch(fetchCategories());
    if (categoryIds.length === 0) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([...categoryIds]);
    }
  }, [dispatch, categoryIds]);

  const handleCategoryChange = (id: number) => {
    setSelectedCategories((prevSelected) => {
      const updatedCategories = prevSelected.includes(id)
        ? prevSelected.filter((categoryId) => categoryId !== id)
        : [...prevSelected, id];

      dispatch(setCategoryIds(updatedCategories));

      return updatedCategories;
    });
  };

  return (
    <div aria-labelledby="all categories" className="py-5 space-y-2">
      <button
        aria-label="categories"
        type="button"
        className="w-full inline-flex items-center justify-between group"
        onClick={() => setCatOpen(!catOpen)}
      >
        <span className="uppercase font-semibold text-start text-[14px] group-hover:text-secondary-green transition-all duration-200 ease-linear">
          categories
        </span>
        <PlusIcon className="text-black w-5 h-5 group-hover:text-primary-green transition-all duration-200 ease-linear" />
      </button>
      <AnimatePresence>
        {catOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="pl-5 space-y-2 text-[14px]">
              {(categories as { data: { rows: any[] } })?.data?.rows?.map(
                (item, index) => (
                  <li
                    key={index}
                    className="group cursor-pointer capitalize flex items-center justify-start"
                  >
                    <input
                      id={`category_${item.id}`}
                      type="checkbox"
                      checked={
                        selectedCategories.includes(item.id) ? true : false
                      }
                      onChange={() => handleCategoryChange(item.id)}
                      className="w-5 h-5 bg-primary-green border-gray-300 rounded-md peer"
                    />
                    <label
                      htmlFor={`category_${item.id}`}
                      className="ms-2 text-sm font-medium text-black/70 group-hover:text-secondary-green group-hover:font-semibold transition duration-300 ease-in-out peer-checked:text-secondary-green peer-checked:font-semibold"
                    >
                      {item.category.trim()}
                    </label>
                  </li>
                )
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoriesFilter;
