"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CustomImage, EmptyData } from "../shared";
import { formatMoney } from "@/utils";
import {
  HeartIcon as HeartIcon1,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { HeartIcon as HeartIcon2 } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  decreaseQuantity,
  increaseQuantity,
  removeItemFromCart,
} from "@/lib/redux/slices/cartSlice";
import { useToast } from "@/context";

const ShoppingCardList = () => {
  const { currency, rate } = useAppSelector((state) => state.currency);
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const [isClient, setIsClient] = useState(false);
  const notify = useToast();

  const handleRemoveItem = (id: string, name: string) => {
    dispatch(removeItemFromCart(id));
    notify(`${name} removed from cart`, "info");
  };

  const handleIncreaseQuantity = (id: string) => {
    dispatch(increaseQuantity(id));
  };

  const handleDecreaseQuantity = (id: string) => {
    dispatch(decreaseQuantity(id));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    const currentItem = cart.items[id];
    if (quantity > currentItem.quantity) {
      for (let i = 0; i < quantity - currentItem.quantity; i++) {
        dispatch(increaseQuantity(id));
      }
    } else if (quantity < currentItem.quantity) {
      for (let i = 0; i < currentItem.quantity - quantity; i++) {
        dispatch(decreaseQuantity(id));
      }
    }
  };

  const handleInputChange = (id: string, value: string) => {
    const quantity = value.trim() === "" ? 1 : Math.max(1, Number(value));
    handleQuantityChange(id, quantity);
  };

  useEffect(() => {
    setIsClient(true);
  }, [isClient]);

  return (
    <section className="w-full mx-auto">
      {isClient && (
        <div className="w-full mx-auto flex flex-col items-center justify-between gap-2 p-2">
          {Object.values(cart.items).length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center ">
              <EmptyData title="Your Shopping cart is empty" />
              <Link className="text-primary-green" href={"/shop"}>
                Explorer le Marché
              </Link>
            </div>
          ) : (
            Object.values(cart.items).map((item: any, index) => (
              <div
                key={index}
                className="bg-slate-100 even:bg-gray-100 hover:bg-slate-200 p-2 md:p-3 w-full mx-auto flex flex-row items-start justify-start gap-2 md:gap-5 rounded-lg transition-all duration-150 ease-linear"
              >
                <div className="w-[100px] h-[80px] md:w-[180xp] md:h-[180xp] rounded-lg overflow-hidden p-[2px] border border-black/50">
                  <CustomImage
                    src={item.image}
                    alt="product image"
                    className="w-full h-full object-cover rounded-md"
                    width={2000}
                    height={2000}
                  />
                </div>
                <div className="w-full mx-auto flex flex-col items-start justify-between space-y-2  lg:space-y-5">
                  <div className="w-full mx-auto flex flex-row items-start justify-between space-x-2">
                    <div className="w-2/4 lg:w-1/4 flex flex-col items-start justify-between">
                      <Link href="/produits/1">
                        <span className="text-[14px] lg:text-[16px] text-black">
                          {item.name}
                        </span>
                      </Link>
                      <div className="font-semibold text-[12px] lg:hidden mt-3 notranslate">
                        {formatMoney(item.price, currency, rate)}
                      </div>
                    </div>
                    <div className="w-2/4 lg:w-3/4 text-end flex flex-row items-center justify-end lg:justify-between text-[14px]">
                      <div className="font-semibold hidden lg:block notranslate">
                        {formatMoney(item.price, currency, rate)}
                      </div>
                      <div>
                        <div className="inline-flex items-center justify-between space-x-1">
                          <button
                            type="button"
                            className="border-none outline-none bg-gray-300 p-1 rounded-md text-center flex items-center justify-center hover:bg-gray-400"
                            onClick={() => handleDecreaseQuantity(item.id)}
                          >
                            <MinusIcon className="w-3 h-3 text-black" />
                          </button>
                          <input
                            type="text"
                            className="text-center text-[12px] max-w-[41px] p-1 bg-inherit"
                            value={item.quantity}
                            onChange={(e) =>
                              handleInputChange(item.id, e.target.value)
                            }
                            // min="1"
                            required
                          />
                          <button
                            type="button"
                            className="border-none outline-none bg-gray-300 p-1 rounded-md text-center flex items-center justify-center hover:bg-gray-400"
                            onClick={() => handleIncreaseQuantity(item.id)}
                          >
                            <PlusIcon className="w-3 h-3 text-black" />
                          </button>
                        </div>
                        <div className="font-semibold lg:hidden text-[12px] mt-3 notranslate">
                          {formatMoney(
                            item.quantity * item.price,
                            currency,
                            rate
                          )}
                        </div>
                      </div>
                      <div className="font-semibold hidden lg:block notranslate">
                        {formatMoney(
                          item.quantity * item.price,
                          currency,
                          rate
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Cart Buttons */}
                  <div className="w-full mx-auto flex flex-row items-end justify-between">
                    <button
                      type="button"
                      className="inline-flex items-center justify-between space-x-2 group"
                    >
                      <HeartIcon1 className="w-5 h-5 text-red-500" />

                      <span className="hidden md:block">
                        Ajouter aux favoris
                      </span>
                    </button>
                    <button
                      type="button"
                      className="flex flex-row items-center justify-between space-x-3 hover:text-red-500"
                      onClick={() => {
                        handleRemoveItem(item.id, item.name);
                      }}
                    >
                      <TrashIcon className="w-5 h-5 text-red-400" />
                      <span className="hidden md:block">Retirer</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default ShoppingCardList;
