import React from "react";
import CustomImage from "./CustomImage";
import { images } from "@/data";

interface Props {
  title?: string;
  message?: string;
}

const EmptyData = ({ title, message }: Props) => {
  return (
    <section className="w-full mx-auto">
      <div className="section-container p-5 md:p-10 lg:p-20 grid grid-cols-1 items-center justify-center gap-10">
        {title && (
          <div className="text-center text-2xl font-semibold text-black/70">
            {title}
          </div>
        )}
        <div className="w-[300px] h-[300px] mx-auto">
          <CustomImage
            src={images.products.emptyBox2}
            alt="empty box"
            className="w-full h-full object-center object-cover grayscale"
            width={2000}
            height={2000}
          />
        </div>
        {message && (
          <div className="text-center text-xl text-black/70">{message}</div>
        )}
      </div>
    </section>
  );
};

export default EmptyData;
