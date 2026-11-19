"use client";

import Link from "next/link";
import React from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  ShoppingBagIcon,
  EyeIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import CustomImage from "./CustomImage";
import { StaticImageData } from "next/image";
import { useToast } from "@/context";
import { formatMoney } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { addItemToCart } from "@/lib/redux/slices/cartSlice";

interface ProductCardProps {
  id: string;
  name: string | any;
  price: number;
  discountRate?: number;
  rating?: number;
  image: string | StaticImageData | any;
  currency?: string;
  unity?: string;
  cooperative?: string;
}

const ProductCard = ({
  id,
  name,
  price,
  discountRate,
  rating,
  image,
  currency,
  unity,
  cooperative,
}: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const { currency: newCurrency, rate } = useAppSelector(
    (state) => state.currency
  );
  const notify = useToast();

  return (
    <div className="group border border-secondary-green bg-light transition-all duration-300 ease-linear hover:border-primary-green drop-shadow-md rounded-lg overflow-hidden">
      <div className="relative w-full h-[150px] lg:h-[180px]">
        <Link href={`/produits/${id}`} className="w-full h-full">
          <CustomImage
            src={image}
            alt={`${name} image`}
            width={1000}
            height={1000}
            className="w-full h-full object-center object-cover"
          />
        </Link>

        {discountRate && discountRate > 0 && (
          <div className="absolute top-3 left-3 lg:top-5 lg:left-5 bg-red-600 rounded-md text-white p-2 text-[12px]">
            Sale {discountRate}%
          </div>
        )}

        <div className="absolute bottom-3  lg:bottom-5 -right-20 group-hover:right-3 lg:group-hover:right-5 bg-yellow-200 rounded-full text-black flex flex-col items-center justify-center space-y-1 transition-all duration-300 ease-linear overflow-hidden drop-shadow-lg">
          <Link
            href={`/produits/${id}`}
            aria-label="view product"
            className="hover:bg-primary-green hover:text-white w-full flex items-center justify-center p-3"
          >
            <EyeIcon className="w-5 h-5" />
          </Link>
          {/* <button
            type="button"
            onClick={() => notify(`${name} added to wishlist`, "success")}
            aria-label="add to wishlist"
            className="hover:bg-primary-green hover:text-white w-full flex items-center justify-center p-3"
          >
            <HeartIcon className="w-5 h-5" />
          </button> */}
        </div>
      </div>
      <div className="p-2 lg:p-3 relative">
        <h2>
          <Link
            href={`/produits/${id}`}
            className="text-[14px] font-semibold text-black/70 hover:text-secondary-green"
          >
            {name}
          </Link>
        </h2>
        {cooperative && (
          <div className="text-[12px] font-medium text-black">
            <span>By : </span>{" "}
            <span className="text-secondary-green/70 notranslate">
              {cooperative}
            </span>
          </div>
        )}

        <p className="inline-flex items-center justify-start text-start space-x-2 text-[14px] mt-2">
          <span className="font-semibold">
            {discountRate && discountRate > 0
              ? (price - (price * discountRate) / 100).toFixed(2)
              : formatMoney(price, newCurrency, rate)}
          </span>
          {discountRate && discountRate > 0 && (
            <span className="text-black/60 line-through notranslate">
              {formatMoney(price, newCurrency, rate)}{" "}
            </span>
          )}
          <span className="text-[12px] notranslate text-primary-green">
            {" / "}
            {unity}
          </span>
        </p>
        {rating && (
          <div className="flex items-center justify-start">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={`w-4 h-4  ${
                  index + 1 <= rating ? "text-orange-400" : "text-black/40"
                }`}
              />
            ))}
          </div>
        )}
        <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center px-2 lg:px-5">
          <button
            aria-label="add to cart"
            type="button"
            className="bg-white p-2 rounded-full overflow-hidden text-black hover:text-white hover:bg-primary-green transition-all duration-200 ease-in-out"
            onClick={() => {
              dispatch(addItemToCart({ id, name, price, quantity: 1, image }));
              notify(`${name} added to cart`, "success");
            }}
          >
            <ShoppingBagIcon className="w-6 h-6 notranslate" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
