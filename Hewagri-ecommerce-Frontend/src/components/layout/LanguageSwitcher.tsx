"use client";

import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import { NextPageContext } from "next";
import useLanguageSwitcher, {
  LanguageDescriptor,
} from "@/lib/useLanguageSwitcher";

export type LanguageSwitcherProps = {
  context?: NextPageContext;
};

const LanguageSwitcher = ({ context }: LanguageSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, switchLanguage, languageConfig } =
    useLanguageSwitcher({ context });

  if (!languageConfig) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="notranslate uppercase flex flex-row items-center justify-center gap-x-5 py-1 px-2 bg-dark hover:bg-gray-700"
      >
        <span>{currentLanguage === "auto" ? "auto" : currentLanguage}</span>
        <ChevronDownIcon
          className={`w-4 h-4 transition-all duration-150 ease-linear ${
            isOpen && "rotate-180"
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute w-auto flex flex-col items-start justify-center bg-gray-200 text-dark p-2 space-y-2 z-50 translate-y-[5%] drop-shadow-md rounded-md overflow-auto transit duration-200 ease-linear">
          {languageConfig.languages.map(
            (ld: LanguageDescriptor, index: number) => (
              <div key={index} className="w-full">
                {currentLanguage === ld.name ||
                (currentLanguage === "auto" &&
                  languageConfig.defaultLanguage === ld.name) ? (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full inline-flex items-center justify-start gap-x-2 py-1 px-2 bg-secondary-green space-x-2"
                  >
                    <span className="notranslate text-[14px] inline-flex items-center justify-center space-x-4">
                      <span>{ld.title}</span>
                      <CheckIcon className="w-4 h-4 text-white" />
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={switchLanguage(ld.name)}
                    className="inline-flex items-center justify-start gap-x-2 notranslate text-[14px] 
                          text-dark bg-gray-400 hover:bg-secondary-green/50 !w-full py-1 px-2 text-center cursor-pointer 
                       "
                  >
                    <span>{ld.title}</span>
                  </button>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
