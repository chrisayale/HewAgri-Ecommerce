"use client";

import React from "react";
import { ThemeProvider as Provider } from "next-themes";
import { Footer, Navbar } from "@/components/layout";
import { usePathname } from "next/navigation";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  return (
    <main className="w-full mx-auto">
      {/* <Provider defaultTheme="light" enableSystem> */}
      {pathName === "/login" || pathName === "/register" ? null : <Navbar />}
      {children}
      {pathName === "/login" || pathName === "/register" ? null : <Footer />}
      {/* </Provider> */}
    </main>
  );
};

export default ThemeProvider;
