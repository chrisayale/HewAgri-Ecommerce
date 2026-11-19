"use client";

import { images } from "@/data";
import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";

interface CustomImageProps {
  alt: string;
  src: StaticImageData | string | any;
  className?: string;
  width?: number;
  height?: number;
  [key: string]: any;
}

const CustomImage = ({
  src,
  alt,
  width,
  height,
  className,
  ...props
}: CustomImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(images.logos.logo2);
  };

  return (
    <Image
      className={className}
      src={imgSrc}
      width={width}
      height={height}
      alt={alt}
      onError={handleError}
      priority={true}
      {...props}
    />
  );
};

export default CustomImage;
