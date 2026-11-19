import React from "react";
import Filter from "../Home/Filter";
import ProductsGrid from "../ProductsGrid";

const Page = () => {
  return (
    <section className="w-full mx-auto">
      <div className="section-container p-5 md:p-10 lg:p-20">
        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-10 md:gap-5">
          <div className="hidden md:block md:col-span-3">
            <Filter />
          </div>
          <div className="md:col-span-7 space-y-10 lg:space-y-20">
            <ProductsGrid />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
