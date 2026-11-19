"use client";

import Link from "next/link";
import React from "react";
import { StarIcon } from "@heroicons/react/24/solid";
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

const ListProductCard = ({
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
    <div className="group border border-secondary-green bg-light transition-all duration-300 ease-linear hover:border-primary-green drop-shadow-md rounded-lg overflow-hidden flex flex-row items-center justify-start px-2 ">
      <Link
        href={`/produits/${id}`}
        className="w-1/3 h-[110px] rounded-lg overflow-hidden"
      >
        <CustomImage
          src={image}
          alt={`${name} image`}
          width={1000}
          height={1000}
          className="w-full h-full object-center object-cover"
        />
      </Link>

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

        <button
          aria-label="add to cart"
          type="button"
          className="mt-2 bg-white p-2 rounded-lg overflow-hidden text-black hover:text-white hover:bg-primary-green transition-all duration-200 ease-in-out w-full text-[14px]"
          onClick={() => {
            dispatch(addItemToCart({ id, name, price, quantity: 1, image }));
            notify(`${name} added to cart`, "success");
          }}
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
};

export default ListProductCard;
