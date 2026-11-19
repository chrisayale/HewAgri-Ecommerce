"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { fetchCooperatives } from "@/lib/redux/slices/cooperativesSlice";
import { setCooperativeIds } from "@/lib/redux/slices/filterSlice";
import { PlusIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";

const CooperativesFilter = () => {
  const dispatch = useAppDispatch();
  const { cooperatives, loading, error } = useAppSelector(
    (state) => state.cooperatives
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const cooperativeIds = useAppSelector((state) => state.filter.cooperativeIds);

  const [selectedCooperatives, setSelectedCooperatives] = useState<number[]>([
    ...cooperativeIds,
  ]);

  const handleCooperativeChange = (id: number) => {
    setSelectedCooperatives((prevSelected) => {
      const updatedCooperatives = prevSelected.includes(id)
        ? prevSelected.filter((cooperativeId) => cooperativeId !== id)
        : [...prevSelected, id];

      dispatch(setCooperativeIds(updatedCooperatives));

      return updatedCooperatives;
    });
  };

  useEffect(() => {
    dispatch(fetchCooperatives());
    if (cooperativeIds.length === 0) {
      setSelectedCooperatives([]);
    } else {
      setSelectedCooperatives([...cooperativeIds]);
    }
  }, [dispatch, cooperativeIds]);

  // if (loading)
  //   return (
  //     <div className="w-full mx-auto bg-light/50 animate-ping p-1">...</div>
  //   );

  return (
    <div aria-labelledby="all categories" className="py-5 space-y-2">
      <button
        aria-label="categories"
        type="button"
        className="w-full inline-flex items-center justify-between group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="uppercase font-semibold text-[14px] group-hover:text-secondary-green transition-all duration-200 ease-linear">
          Cooperatives
        </span>
        <PlusIcon className="text-black w-5 h-5 group-hover:text-primary-green transition-all duration-200 ease-linear" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="pl-5 space-y-2 text-[14px]">
              {(cooperatives as { data: { rows: any[] } })?.data?.rows?.map(
                (item, index) => (
                  <li
                    key={index}
                    className="group notranslate cursor-pointer capitalize flex items-center justify-start"
                  >
                    <input
                      id={`cooperative_${item.id}`}
                      type="checkbox"
                      checked={selectedCooperatives.includes(item.id)}
                      onChange={() => handleCooperativeChange(item.id)}
                      className="w-5 h-5 bg-primary-green border-gray-300 rounded-md peer"
                    />
                    <label
                      htmlFor={`cooperative_${item.id}`}
                      className="ms-2 text-sm font-medium text-black/70 group-hover:text-secondary-green group-hover:font-semibold transition duration-300 ease-in-out peer-checked:text-secondary-green peer-checked:font-semibold"
                    >
                      {item.cooperative.trim()}
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

export default CooperativesFilter;
