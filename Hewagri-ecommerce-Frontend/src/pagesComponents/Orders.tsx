"use client";

import { useModal } from "@/components/layout/Modal";
import { useToast } from "@/context";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { resetAuthStatus, setStatus } from "@/lib/redux/slices/authSlice";
import { fetchOrders, retryOrder } from "@/lib/redux/slices/orderSlice";
import { formatMoney } from "@/utils";
import { DialogTitle } from "@headlessui/react";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Order {
  id: string;
  transaction: string;
  createdAt: string; // Add the createdAt field
  prix_total: number;
  state: number; // Add the state field
}

interface OrdersState {
  loading: boolean;
  status: string;
  orders: {
    data: {
      rows: Order[];
    };
  };
}

const groupByTransaction = (rows: Order[]) => {
  return rows?.reduce((acc: Record<string, Order[]>, row: Order) => {
    const { transaction } = row;
    if (!acc[transaction]) {
      acc[transaction] = [];
    }
    acc[transaction].push(row);
    return acc;
  }, {});
};

const Orders = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currency, rate } = useAppSelector((state) => state.currency);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { loading, status, orders } = useAppSelector(
    (state: { order: OrdersState }) => state.order
  );
  const notify = useToast();
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    if (!isAuthenticated) {
      notify("Vous devez vous connecter pour accéder à vos commandes", "info");
      // dispatch(resetAuthStatus());
      // dispatch(logout());
      // router.push("/");
    }
    dispatch(fetchOrders());
    dispatch(resetAuthStatus());
    return;
  }, [isAuthenticated, router, notify, dispatch]);
  // const [loadRery, setLoadRetry] = React.useState(false);
  const [loadRetry, setLoadRetry] = useState<Record<string, boolean>>({});

  const groupedData = groupByTransaction(orders?.data?.rows || []);

  const handleRePayOrder = async (transaction: string) => {
    setLoadRetry((prev) => ({ ...prev, [transaction]: true }));
    try {
      await dispatch(retryOrder({ id_transaction: transaction }));
      handleOpenModal();
      setTimeout(() => {
        closeModal();
      }, 10000);
    } catch (error) {
      setLoadRetry((prev) => ({ ...prev, [transaction]: false }));

      notify("Erreur lors de la tentative de paiement", "error");
      closeModal();
    } finally {
      setLoadRetry((prev) => ({ ...prev, [transaction]: false }));
    }
  };

  const handleOpenModal = () => {
    openModal(
      <div className="space-y-5 flex flex-col items-center justify-center">
        <DialogTitle>Bienvenu sur Hewagri</DialogTitle>
        <div className="flex flex-col items-start w-full justify-start mx-auto gap-5">
          <div className="w-full mx-auto flex flex-col items-center justify-center gap-5">
            <CheckBadgeIcon className="w-16 h-16 text-green-500" />
            <div className="w-full text-start space-y-5">
              <div className="text-[14px] text-black/70">
                <strong>🎉 Votre commande est presque terminée !</strong> Pour
                confirmer et finaliser votre achat en toute sécurité, veuillez
                entrer votre code PIN.
              </div>
              <div className="text-[14px] text-black/70">
                <strong>💳 Étape finale : </strong>
                Validation du paiement Votre commande n&apos;attend plus que
                votre confirmation pour être traitée immédiatement.
              </div>

              <div className="text-[14px] text-black/70">
                🔒 Ne vous inquiétez pas, vos informations sont sécurisées avec
                nous !
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="section-container p-5 md:px-10 lg:px-20">
        Chargement ...
      </div>
    );

  return (
    <main className="w-full mx-auto">
      <div className="section-container p-5 md:px-10 lg:px-20 flex flex-col items-center justify-start space-y-5">
        {isAuthenticated ? (
          <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-dark uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th scope="col" className="px-6 py-3">
                    Transaction
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Heure / Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Produit(s)
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total
                  </th>

                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              {Object.entries(groupedData).length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={6} className="p-5 text-center">
                      Aucune commande passée
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {Object.entries(groupedData).map(
                    ([transaction, orderGroup], index) => (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {index + 1}
                        </td>
                        <td
                          scope="col"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {transaction}
                        </td>
                        <td
                          scope="col"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {orderGroup[0].createdAt}
                        </td>

                        <td className="px-6 py-4">
                          {orderGroup.length} Produit
                          {orderGroup.length > 1 ? "s" : ""}
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          {formatMoney(
                            orderGroup.reduce(
                              (total, item) => total + item.prix_total,
                              0
                            ),
                            currency,
                            rate
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="w-full mx-auto flex flex-row item-center justify-between space-x-2">
                            {orderGroup[0].state === 0 && (
                              <button
                                onClick={() => handleRePayOrder(transaction)}
                                type="button"
                                className={`font-medium text-white py-1.5 px-3 rounded-md ${
                                  loadRetry[transaction]
                                    ? "bg-primary-green/60"
                                    : "bg-orange-600"
                                }`}
                              >
                                {loadRetry[transaction] ? (
                                  <span>Payment en cours ...</span>
                                ) : (
                                  <span>Payer la commande</span>
                                )}
                              </button>
                            )}

                            <Link
                              href={`/orders/${transaction}`}
                              className="flex items-center justify-center font-medium text-white py-1.5 px-3 bg-primary-green rounded-md "
                            >
                              Voir
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              )}
            </table>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center space-y-5">
            <h1 className="text-xl font-bold text-center">
              Vous devez vous connecter pour accéder à vos commandes
            </h1>
            <Link href="/login">
              <span className="text-primary-green">Se connecter</span>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;
