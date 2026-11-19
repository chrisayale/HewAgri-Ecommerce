"use client";
import { SingleProduct } from "@/pagesComponents";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { fetchProductById } from "@/lib/redux/slices/productsSlice";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { EmptyData, ErrorComponent } from "@/components/shared";

const Product = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.products as { [key: string]: any }
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id as string));
    }
  }, [id, dispatch]);

  const product = products[id as string];

  if (loading)
    return (
      <section className="w-full mx-auto">
        <div className="animate-pulse section-container p-5 md:p-10 lg:p-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 items-stretch justify-center gap-10">
          <div className="lg:col-span-2">
            <div className="w-full h-[300px] bg-black/10 overflow-hidden"></div>
          </div>
          <div className="lg:col-span-3 border border-black/10 p-5 text-[14px] space-y-3">
            <div className="p-2 bg-black/10 min-w-[100px]"></div>
            <div className="p-2 bg-black/10 min-w-[100px]"></div>
            <div className="p-2 bg-black/10 min-w-[100px]"></div>
            <div className="text-[14px] text-black/70 flex flex-col items-start justify-center">
              <div className="inline-flex items-center justify-start space-x-1">
                <span className="p-2 bg-black/10 min-w-[100px]"></span>
                <span className="p-2 bg-black/10 min-w-[100px]"></span>
              </div>
              <div className="inline-flex items-center justify-start space-x-1">
                <span className="p-2 bg-black/10 min-w-[100px]"></span>
                <span className="p-2 bg-black/10 min-w-[100px]"></span>
              </div>
              <div className="inline-flex items-center justify-start space-x-1">
                <span className="p-2 bg-black/10 min-w-[100px]"></span>
                <span className="p-2 bg-black/10 min-w-[100px]"></span>
              </div>
            </div>

            <p className="p-2 bg-black/10 min-w-[100px]"></p>

            <div className="w-full mx-auto flex flex-col lg:flex-row items-center justify-start gap-5">
              <div className="w-full lg:w-auto mx-auto flex flex-row items-center justify-center lg:justify-start gap-5">
                <div className="p-2 bg-black/10 min-w-[100px]"></div>
                <div className="p-2 bg-black/10 min-w-[100px]"></div>
                <span className="p-2 bg-black/10 min-w-[100px]"></span>
              </div>
              <div className="p-2 bg-black/10 min-w-[100px]"></div>
            </div>
            <div className="pt-5 flex flex-col lg:flex-row items-center justify-between lg:justify-start gap-5">
              <div className="p-2 bg-black/10 min-w-[100px]"></div>
              <div className="p-2 bg-black/10 min-w-[100px]"></div>
            </div>
          </div>
        </div>
      </section>
    );
  if (error)
    return (
      <div className="section-container p-5 md:px-10 lg:px-20">
        <ErrorComponent error={error} />
      </div>
    );
  if (!product)
    return (
      <EmptyData
        title="Opps, Ce produit n'est pas disponible"
        message="Retournez à la page précédente"
      />
    );

  return (
    <>
      <div className="w-full section-container px-5 pt-5 md:px-10 lg:px-20">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-secondary-green text-black px-3 py-2 rounded-lg"
        >
          <span className="sr-only">Retourner</span>
          <ArrowLeftIcon className="w-8 h-8" />
        </button>
      </div>
      <SingleProduct data={product} />
    </>
  );
};

export default Product;
