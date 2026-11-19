"use client";
import React from "react";
import { CustomImage } from "../shared";
import { images } from "@/data";
import { StaticImageData } from "next/image";
import { baseUrl } from "@/constants";

interface HeroCardProps {
  title: string;
  description: string;
  image: StaticImageData | string | any;
}

const HeroCard = ({ title, description, image }: HeroCardProps) => {
  return (
    <div className="relative w-full mx-auto flex flex-col items-center justify-center z-30 rounded-lg overflow-hidden">
      <div className="w-full flex flex-col items-center justify-center z-40 p-5 tex-white space-y-3 min-h-[200px]">
        <h1 className="text-yellow-200 font-bold text-[25px] leading-[28px] md:text-[30px] md:leading-[30px] lg:text-[40px] lg:leading-[40px] text-center">
          {title}
        </h1>
        <p className="text-light/90 text-[14px] text-center ">{description}</p>
      </div>
      <div className="absolute inset-0 w-full h-full z-30">
        <div className="absolute inset-0 bg-black/60" />
        <CustomImage
          src={`${baseUrl}/${image}`}
          alt={`${title} image`}
          className="w-full h-full object-center object-cover"
          width={1000}
          height={1000}
        />
      </div>
    </div>
  );
};

export default HeroCard;
