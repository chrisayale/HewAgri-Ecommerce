"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/solid";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      <Menu>
        <MenuButton
          className={`${
            resolvedTheme === "dark" ? "bg-slate-200" : "bg-gray-500"
          } p-2 rounded-lg`}
        >
          {resolvedTheme === "dark" ? (
            <MoonIcon className="w-5 h-5 text-gray-700" />
          ) : (
            <SunIcon className="w-5 h-5 text-yellow-500" />
          )}
        </MenuButton>

        <MenuItems
          anchor="bottom"
          className="mt-4 p-2 bg-slate-300 dark:bg-gray-400 space-y-1 !max-w-[130px] z-50"
        >
          <MenuItem>
            <button
              onClick={() => setTheme("light")}
              className="w-full inline-flex items-center justify-between text-left data-[focus]:bg-blue-100 space-x-3
              bg-slate-200 dark:bg-black/20 py-1 px-4"
            >
              <span className="w-[20px]">
                <SunIcon className="w-5 h-5" />
              </span>
              <span className="text-[14px] text-black dark:text-white w-full">
                Light
              </span>
            </button>
          </MenuItem>

          <MenuItem>
            <button
              onClick={() => setTheme("dark")}
              className="w-full inline-flex items-center justify-between text-left data-[focus]:bg-blue-100 space-x-3
              bg-slate-200 dark:bg-black/20 py-1 px-4"
            >
              <span className="w-[20px]">
                <MoonIcon className="w-5 h-5" />
              </span>
              <span className="text-[14px] text-black dark:text-white w-full">
                Dark
              </span>
            </button>
          </MenuItem>
          <MenuItem>
            <button
              onClick={() => setTheme("system")}
              className="w-full inline-flex items-center justify-between text-left data-[focus]:bg-blue-100 space-x-3
              bg-slate-200 dark:bg-black/20 py-1 px-4"
            >
              <span className="w-[20px]">
                <ComputerDesktopIcon className="w-5 h-5" />
              </span>
              <span className="text-[14px] text-black dark:text-white w-full">
                System
              </span>
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </>
  );
};

export default ThemeSwitch;
