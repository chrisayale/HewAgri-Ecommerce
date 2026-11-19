"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { setCurrency, setRate } from "@/lib/redux/slices/currencySlice";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";

const CurrencySwitcher = () => {
  const dispatch = useAppDispatch();
  const { currency, rate } = useAppSelector((state) => state.currency);
  const [isOpen, setIsOpen] = useState(false);
  const currencies = ["CDF", "USD"];
  const [isClient, setIsClient] = useState(false);

  const handleSwitchCurrency = (currency: string) => {
    dispatch(setCurrency(currency));
    if (currency === "CDF") {
      dispatch(setRate(1));
    }

    if (currency === "USD") {
      dispatch(setRate(2900));
    }

    setIsOpen(false);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="notranslate w-[70px] uppercase flex flex-row items-center justify-center gap-x-2 py-1 px-2 bg-dark hover:bg-gray-700"
      >
        {isClient && <span>{currency}</span>}
        <ChevronDownIcon
          className={`w-4 h-4 transition-all duration-150 ease-linear ${
            isOpen && "rotate-180"
          }`}
        />
      </button>
      {isOpen && (
        <div
          className="absolute flex flex-col items-start justify-center bg-gray-200 text-dark p-2 
        space-y-2 z-50 translate-y-[5%] drop-shadow-md rounded-md overflow-auto transit duration-200 
        ease-linear w-[100px]"
        >
          {currencies.map((currencyName, index: number) => (
            <div key={index} className="w-full">
              {currencyName === currency ? (
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full inline-flex items-center justify-start gap-x-2 py-1 px-2 bg-secondary-green space-x-2"
                >
                  <span className="notranslate text-[14px] inline-flex items-center justify-center space-x-4">
                    <span>{currency}</span>
                    <CheckIcon className="w-4 h-4 text-white" />
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => handleSwitchCurrency(currencyName)}
                  type="button"
                  className="inline-flex items-center justify-start gap-x-2 notranslate text-[14px] 
                          text-dark bg-gray-400 hover:bg-secondary-green/50 !w-full py-1 px-2 text-center cursor-pointer 
                       "
                >
                  <span>{currencyName}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySwitcher;
