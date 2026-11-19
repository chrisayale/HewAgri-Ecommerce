"use client";

import { CartSumary, ShoppingCardList } from "@/components/Cart";
import { useToast } from "@/context";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { clearCart } from "@/lib/redux/slices/cartSlice";
import { resetStatus } from "@/lib/redux/slices/orderSlice";
import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";

const Cart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const [isClient, setIsClient] = useState(false);

  const notify = useToast();
  const handleClearCart = () => {
    dispatch(clearCart());
    notify(`Cart Cleared`, "info");
  };

  useEffect(() => {
    setIsClient(true);
    dispatch(resetStatus());
  }, [isClient, dispatch]);

  return (
    <>
      <main className="w-full mx-auto">
        {isClient && (
          <div className="section-container p-5 md:px-10 lg:px-20 space-y-10">
            <div className="flex items-center justify-between">
              <h1 className="text-xl md:text-2xl font-bold">Shopping Cart</h1>
              {cart.totalQuantity === 0 ? null : (
                <button
                  type="button"
                  className="text-sm text-gray-500 inline-flex items-center justify-between space-x-1 md:space-x-3"
                  onClick={() => handleClearCart()}
                >
                  <XMarkIcon className="w-5 h-5 text-red-500" />
                  <span>Vider le panier</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-10 items-start justify-start gap-5">
              <div className="md:col-span-3 lg:col-span-7 border border-black/30">
                <ShoppingCardList />
              </div>
              <div className="md:col-span-2 lg:col-span-3 border border-black/30">
                <CartSumary />
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Cart;
