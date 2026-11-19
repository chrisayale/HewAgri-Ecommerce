"use client";

import React, { useState } from "react";
import { CustomImage } from "../shared";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { baseUrl } from "@/constants";
import { formatMoney } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { useToast } from "@/context";
import {
  addItemToCart,
  addItemWithQuantity,
} from "@/lib/redux/slices/cartSlice";

const Page = ({ data }: any) => {
  const { currency, rate } = useAppSelector((state) => state.currency);
  const dispatch = useAppDispatch();
  const notify = useToast();
  const [Quantity, setQuantity] = useState(1);
  const price = data.prix_plus_commission;
  const tva = data.tva;

  const IncrementQuantity = () => {
    setQuantity(Quantity + 1);
  };

  const DecrementQuantity = () => {
    if (Quantity <= 1) return;
    setQuantity(Quantity - 1);
  };

  return (
    <section className="w-full mx-auto">
      <div className="section-container p-5 md:p-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 items-stretch justify-center gap-10 drop-shadow-md">
        <div className="lg:col-span-2">
          <div className="w-full h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden">
            <CustomImage
              src={`${baseUrl}/${data.__tbl_ecom_produit.image}`}
              alt="product image"
              className="w-full h-full object-center object-cover"
              width={2000}
              height={2000}
            />
          </div>
        </div>
        <div className="lg:col-span-3 border border-black/10 p-5 text-[14px] space-y-3">
          <div className="text-black/70">
            Categorie : {data.__tbl_ecom_category.category}
          </div>
          <div className="text-[18px] font-semibold">
            {data.__tbl_ecom_produit.produit}
          </div>
          <div className="text-[18px]">
            <span className="font-semibold text-primary-green">
              <span>Prix : </span>
              <span className="notranslate">
                {formatMoney(price, currency, rate)}
              </span>
            </span>
            <span className="text-black notranslate">
              / {data.__tbl_ecom_unitesmesure.unity}
            </span>
          </div>
          <div className="text-[14px] text-black/70 flex flex-col items-start justify-center">
            <div className="inline-flex items-center justify-start space-x-1">
              <span>Tva :</span>
              <span className="text-secondary-green notranslate">
                {formatMoney(tva, currency, rate)}
              </span>
            </div>
            <div className="inline-flex items-center justify-start space-x-1">
              <span>Cooperative :</span>
              <span className="text-secondary-green notranslate">
                {data.__tbl_ecom_cooperative.cooperative}
              </span>
            </div>
            <div className="inline-flex items-center justify-start space-x-1">
              <span>Disponibilité :</span>
              <span
                className={`${
                  data.qte <= data.qte_critique
                    ? "text-red-500"
                    : "text-secondary-green"
                }`}
              >
                {data.qte} In Stock{" "}
                {data.qte >= data.qte_critique && (
                  <>
                    -{" "}
                    <span className="text-orange-400 animate-ping animate-duration-[2s] animate-delay-[0.20s]">
                      Dépêchez-vous
                    </span>
                  </>
                )}
              </span>
            </div>
          </div>
          {data.__tbl_ecom_produit.description && (
            <p className="text-black/70 border-t border-b border-gray-200 py-3">
              <span className="font-semibold text-[13px] text-black">
                Description :{" "}
              </span>
              {data.__tbl_ecom_produit.description}
            </p>
          )}

          <div className="w-full mx-auto flex flex-col lg:flex-row items-center justify-start gap-5">
            <div className="w-full lg:w-auto mx-auto flex flex-row items-center justify-center lg:justify-start gap-5">
              <div className="font-semibold">Quantité</div>
              <div className="relative flex-1 w-full lg:max-w-[100px] border border-black/30 flex flex-row items-center justify-between">
                <input
                  type="text"
                  min={1}
                  value={Quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="relative text-left lg:text-center  w-full pl-2 pr-4 py-4 lg:py-2 outline-none border-none"
                />
                <div className="absolute inset-y-0 right-0 border-l border-black/30 flex flex-col items-center justify-between w-14 lg:w-6">
                  <button
                    type="button"
                    onClick={IncrementQuantity}
                    className="bg-black/20 hover:bg-secondary-green w-full h-full flex items-center justify-center transition-all duration-100 ease-linear"
                  >
                    <PlusIcon className="w-4 h-4 text-black" />
                  </button>
                  <span className="border border-black/40 w-full" />
                  <button
                    type="button"
                    onClick={DecrementQuantity}
                    className="bg-black/20 hover:bg-secondary-green w-full h-full flex items-center justify-center transition-all duration-100 ease-linear"
                  >
                    <MinusIcon className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>
              <span className="notranslate">
                {data.__tbl_ecom_unitesmesure.unity}
              </span>
            </div>
            <div className="flex-1 h-full w-full">
              <button
                type="button"
                className="capitalize relative py-2 h-full w-full lg:w-auto bg-secondary-green px-5 text-white font-semibold hover:bg-primary-green transition-all duration-100 ease-linear text-center"
                onClick={() => {
                  dispatch(
                    addItemWithQuantity({
                      item: {
                        id: data.id,
                        name: data.__tbl_ecom_produit.produit,
                        price,
                        quantity: Quantity,
                        image: `${baseUrl}/${data.__tbl_ecom_produit.image}`,
                      },
                      quantity: Quantity,
                    })
                  );
                  notify(
                    `${data.__tbl_ecom_produit.produit} added to cart`,
                    "success"
                  );
                }}
              >
                Ajouter au panier
              </button>
            </div>
          </div>
          <div className="pt-5 flex flex-col lg:flex-row items-center justify-between lg:justify-start gap-5">
            <div className="font-medium text-[16px] lg:w-[200px] ">
              Total :{" "}
              <span className="notranslate">
                {formatMoney(Quantity * price, currency, rate)}
              </span>
            </div>
            <Link
              href={"/cart"}
              className="relative py-3 h-full w-full lg:w-auto bg-black px-5 text-white font-semibold hover:bg-black/70 transition-all duration-100 ease-linear capitalize text-center"
            >
              continuez vers le panier
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
