import { Page } from "@/components/SingleProduct";
import React from "react";

const SingleProduct = ({ data }: any) => {
  return (
    <main className="w-full mx-auto">
      <Page data={data} />
    </main>
  );
};

export default SingleProduct;
