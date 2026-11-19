"use client";

import React, { useState } from "react";
import Hero from "./Hero";
import Filter from "./Filter";
import ProductsGrid from "../ProductsGrid";
import { SliderValue } from "@nextui-org/react";
import { useAppSelector } from "@/lib/hook";

const Page = () => {
  const search = useAppSelector((state) => state.filter.search);
  const categories = useAppSelector((state) => state.filter.categoryIds);
  const cooperatives = useAppSelector((state) => state.filter.cooperativeIds);

  return (
    <section className="w-full mx-auto">
      <div className="section-container p-5 md:p-10 lg:p-20">
        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-10 md:gap-5">
          <div className="hidden md:block md:col-span-3">
            <Filter />
          </div>
          <div className="md:col-span-7 space-y-10">
            {search === "" &&
            categories.length === 0 &&
            cooperatives.length === 0 ? (
              <Hero />
            ) : null}
            <ProductsGrid />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
