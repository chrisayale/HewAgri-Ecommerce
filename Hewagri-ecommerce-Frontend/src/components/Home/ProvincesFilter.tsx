import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { fetchProvinces } from "@/lib/redux/slices/provincesSlice";
import { PlusIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

const ProvincesFilter = () => {
  const dispatch = useAppDispatch();
  const { provinces, loading, error } = useAppSelector(
    (state) => state.provinces
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  if (loading)
    return (
      <div className="w-full mx-auto bg-light/50 animate-ping p-1">...</div>
    );

  return (
    <div aria-labelledby="all categories" className="py-5 space-y-2">
      <button
        aria-label="categories"
        type="button"
        className="w-full inline-flex items-center justify-between group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="uppercase font-semibold text-[14px] group-hover:text-secondary-green transition-all duration-200 ease-linear">
          Provinces
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
              {(provinces as { data: { rows: any[] } })?.data?.rows?.map(
                (item, index) => (
                  <li
                    key={index}
                    className="group cursor-pointer capitalize flex items-center justify-start"
                  >
                    <input
                      id={`province${item.id}`}
                      type="checkbox"
                      value=""
                      className="w-5 h-5 bg-primary-green border-gray-300 rounded-md peer"
                    />
                    <label
                      htmlFor={`province${item.id}`}
                      className="ms-2 text-sm font-medium text-black/70 group-hover:text-secondary-green group-hover:font-semibold transition duration-300 ease-in-out peer-checked:text-secondary-green peer-checked:font-semibold"
                    >
                      {item.province.trim()}
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

export default ProvincesFilter;
