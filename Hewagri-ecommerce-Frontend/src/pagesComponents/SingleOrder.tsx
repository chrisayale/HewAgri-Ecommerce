"use client";

import { CustomImage } from "@/components/shared";
import { baseUrl } from "@/constants";
import { useAppSelector } from "@/lib/hook";
import { formatMoney } from "@/utils";
import React, { useRef } from "react";
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";

const SingleOrder = ({ data }: any) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { currency, rate } = useAppSelector((state) => state.currency);

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  if (!data || !data.rows || !Array.isArray(data.rows)) {
    return <div>No data available</div>; // Display a fallback if there's no data
  }

  // Group data by common fields
  const groupedData = data.rows.reduce((acc: any, item: any) => {
    const groupKey = JSON.stringify({
      transaction: item.transaction,
      payament_phone: item.payament_phone,
      type_livraison: item.type_livraison,
      __tbl_ecom_typelivraison: item.__tbl_ecom_typelivraison,
      is_pending: item.is_pending,
      state: item.state,
      shipped_to: item.shipped_to,
      createdAt: item.createdAt,
    });

    if (!acc[groupKey]) {
      acc[groupKey] = {
        transaction: item.transaction,
        payament_phone: item.payament_phone,
        type_livraison: item.type_livraison,
        __tbl_ecom_typelivraison: item.__tbl_ecom_typelivraison,
        is_pending: item.is_pending,
        state: item.state,
        shipped_to: item.shipped_to,
        createdAt: item.createdAt,
        products: [],
      };
    }

    // Add product to the group
    acc[groupKey].products.push({
      id: item.id,
      id_produit: item.id_produit,
      qte: item.qte,
      prix_total: item.prix_total,
      prix_unit: item.prix_unit,
      currency: item.currency,
      __tbl_ecom_produit: item.__tbl_ecom_produit,
    });

    return acc;
  }, {});

  // function formatDate(createdAt: any) {
  //   const dateParts = createdAt?.split(", ")[1].split("/");

  //   const formattedDate = new Date(
  //     `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
  //   );

  //   if (isNaN(formattedDate.getTime())) {
  //     return "Invalid Date";
  //   }

  //   return formattedDate.toLocaleDateString("fr-FR", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //   });
  // }

  const result = Object.values(groupedData);

  return (
    <section className="w-full mx-auto">
      <div className="section-container p-5 md:p-10 lg:px-20 grid grid-cols-1 items-center justify-center gap-10">
        {result.map((order: any, index: number) => (
          <div
            ref={invoiceRef}
            className="w-full space-y-5 mx-auto"
            key={index}
          >
            <div className="w-full grid grid-cols-1 md:grid-cols-2 mx-auto gap-5">
              <div className="space-y-5">
                <div className="w-full flex flex-col items-start justify-between">
                  <div className="text-md md:text-xl lg:text-2xl flex">
                    <span className="">Commande #</span>
                    <span className="notranslate font-semibold">
                      {order.transaction}
                    </span>
                  </div>
                  <div className="text-[14px] text-primary-green text-start">
                    <span className="">Commande passée le </span>
                    <span>{order.createdAt}</span>
                  </div>
                </div>
                <div className="flex flex-col items-start text-[14px]">
                  <div className="inline-flex items-center justify-start gap-1">
                    <p>Numero de payement :</p>
                    <p className="font-semibold"> {order.payament_phone}</p>
                  </div>
                  <div className="inline-flex items-center justify-start gap-1">
                    <p>Type de livraison :</p>
                    <p className="font-semibold">
                      {" "}
                      {order?.__tbl_ecom_typelivraison?.type}
                    </p>
                  </div>
                  <div className="inline-flex items-center justify-start gap-1">
                    <p>Adresse de livraison:</p>
                    <p className="font-semibold"> {order.shipped_to}</p>
                  </div>
                  <div className="inline-flex items-center justify-start gap-1">
                    <p>Status: </p>
                    <p className="font-semibold">
                      {/* {order.is_pending ? "En cours ..." : "Livré"} */}
                      {order.state === 0
                        ? "non payé"
                        : order.state === 1
                        ? "Commande annuléeayé"
                        : order.state === 2
                        ? "encours de livraison,"
                        : order.state === 3
                        ? "payée possibilité de livraison"
                        : order.state === 4
                        ? "Commande annulée"
                        : null}
                    </p>
                  </div>

                  <div className="mt-2 inline-flex items-center justify-start gap-1">
                    <p>Total Payé : </p>
                    <p className="font-semibold">
                      {formatMoney(
                        order.products.reduce(
                          (total: any, item: any) => total + item.prix_total,
                          0
                        ),
                        currency,
                        rate
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <QRCode
                  value={`https://hewagri.vercel.app/orders/${order.transaction}`}
                  size={200}
                />
              </div>
            </div>

            <div className="w-full mx-auto grid items-start justify-start grid-cols-1 gap-5 text-[12px] md:text-[14px]">
              {order.products.map((product: any, index: number) => (
                <div
                  className="w-full border mx-auto flex flex-row gap-3 items-center justify-star p-1 bg-light/50 overflow-hidden rounded-lg"
                  key={index}
                >
                  <div className="w-[100px] h-[100px] border rounded-lg overflow-hidden">
                    <CustomImage
                      src={`${baseUrl}/${product?.__tbl_ecom_produit?.image}`}
                      alt="hewagri logo"
                      className="w-full h-full object-cover object-center"
                      width={500}
                      height={500}
                    />
                  </div>

                  <div className="text-[12px] space-y-1">
                    <div>
                      <p className="notranslate">
                        {product?.__tbl_ecom_produit?.produit}
                      </p>
                      <p className="text-black/70">
                        {product?.__tbl_ecom_produit?.description}
                      </p>
                    </div>
                    <div>
                      <p>Quantity: {product.qte}</p>
                      <p>
                        Prix unitaire :{" "}
                        {formatMoney(
                          product.prix_total / product.qte,
                          currency,
                          rate
                        )}
                      </p>
                    </div>

                    <p className="font-semibold">
                      Total : {formatMoney(product.prix_total, currency, rate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="bg-primary-green text-white py-2 px-5 text-center"
          onClick={() => handlePrint()}
        >
          Imprimer
        </button>
      </div>
    </section>
  );
};

export default SingleOrder;
