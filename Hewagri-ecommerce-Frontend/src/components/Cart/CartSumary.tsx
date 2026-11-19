"use client";

import { useToast } from "@/context";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { clearCart } from "@/lib/redux/slices/cartSlice";
import { fetchLivraisons } from "@/lib/redux/slices/livraisonsSlice";
import { createOrder, resetStatus } from "@/lib/redux/slices/orderSlice";
import { formatMoney } from "@/utils";
import {
  CheckBadgeIcon,
  ChevronDoubleDownIcon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CustomImage } from "../shared";
import { images } from "@/data";
import { useModal } from "../layout/Modal";
import { DialogTitle } from "@headlessui/react";
import { set } from "lodash";

const CartSummary = () => {
  const notify = useToast();
  const { openModal, closeModal } = useModal();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currency, rate } = useAppSelector((state) => state.currency);
  const status = useAppSelector((state) => state.order.status);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { livraisons, loading } = useAppSelector((state) => state.livraisons);
  const cart = useAppSelector((state) => state.cart);
  const [isClient, setIsClient] = useState(false);
  const [openShipping, setOpenShipping] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(0);
  const [shippingData, setShippingData] = useState<any>({
    id: 0,
    type: "",
    description: "",
    lieux: "",
    frais: 0,
  });
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [payWhitAnotherPhone, setPayWhitAnotherPhone] = useState(false);
  const [paymentCurrency, setPaymentCurrency] = useState(currency);
  const [errors, setErrors] = useState<any>({});
  const [step, setStep] = useState(0);
  const user = useAppSelector(
    (state) =>
      state.auth.user as unknown as {
        phone: string;
      }
  );

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => Math.max(1, prev - 1));

  const handleShipping = (event: any) => {
    const selectedShippingMethod = parseInt(event.target.value);
    setSelectedShippingMethod(selectedShippingMethod);

    const selectedShipping = (
      livraisons as { data: { rows: any[] } }
    )?.data?.rows?.find((livraison) => livraison.id === selectedShippingMethod);

    setShippingData({
      id: selectedShipping?.id || 0,
      type: selectedShipping?.type || "",
      description: selectedShipping?.description || "",
      lieux: selectedShipping?.lieux || "",
      frais: selectedShipping?.frais_livraison || 0,
    });
  };

  // Create a function to handle the checkout process

  const handleCheckout = () => {
    if (selectedShippingMethod === 0) {
      notify("Veuillez sélectionner une méthode d'expédition", "error");
    } else {
      const checkoutData = {
        shipped_to: shippingAddress,
        payament_phone: paymentPhone,
        currency_payement: paymentCurrency,
        type_livraison: selectedShippingMethod,
        items: Object.values(cart.items).map((item) => ({
          id_produit: item.id,
          qte: item.quantity,
        })),
      };
      try {
        if (isAuthenticated) {
          dispatch(createOrder(checkoutData));
        } else {
          notify("Veuillez vous connecter pour continuer", "error");
        }
      } catch (error: any) {
        notify(error.message, "error");
      }
    }
  };

  useEffect(() => {
    setIsClient(true);
    dispatch(fetchLivraisons());
    if (status === "succeeded") {
      // notify("Commande créée avec succès", "success");
      // notify("Entrez votre code PIN pour confirmer la commande", "success");
      setStep(3);
      setTimeout(() => {
        router.push("/orders");
        dispatch(clearCart());
        dispatch(resetStatus());
      }, 1000);

      setTimeout(() => {
        closeModal();
        setStep(0);
      }, 20000);
    }

    if (status === "failed") {
      notify("La création de la commande a échoué", "error");
      dispatch(resetStatus());
    }
  }, [dispatch, status, notify, router, closeModal]);

  const handleOpen = () => {
    openModal(renderModalContent());
  };

  const renderModalContent = () => {
    return (
      <div className="relative w-[280px] md:w-[500px] lg:w-[700px]">
        {step === 1 && (
          <div className="flex flex-col items-start w-full justify-start mx-auto gap-5">
            <DialogTitle className="font-bold">
              Instructions de Paiement Mobile Money
            </DialogTitle>
            <div className="w-full space-y-3">
              <p className="text-[13px] text-black/70">
                Nous allons débiter le compte mobile money lié au{" "}
                <strong>{user.phone}</strong>. Vous pouvez également choisir un
                autre numéro pour le paiement.{" "}
              </p>

              <div
                onClick={() => setPayWhitAnotherPhone(!payWhitAnotherPhone)}
                className="w-full md:w-[80%] flex flex-row items-center justify-between text-[14px] bg-gray-200 p-2"
              >
                <span>Voulez-vous payer avec un autre numéro ?</span>
                <input
                  type="checkbox"
                  checked={payWhitAnotherPhone}
                  onChange={() => setPayWhitAnotherPhone(!payWhitAnotherPhone)}
                  className="w-4 h-4 border text-primary-green"
                />
              </div>

              {payWhitAnotherPhone && (
                <div className="w-full md:w-[80%]">
                  <label
                    htmlFor="phone"
                    className="block text-[13px] font-medium leading-6 text-dark space-x-2"
                  >
                    Numero de payement
                  </label>

                  <div className="flex items-center justify-between space-x-2 relative rounded-md overflow-hidden">
                    <input
                      type="tel"
                      id="payment-phone"
                      name="payment-phone"
                      value={paymentPhone}
                      placeholder="Entrer le numero de payement"
                      onChange={(e) => setPaymentPhone(e.target.value)}
                      minLength={9}
                      maxLength={13}
                      className="outline-none block w-full border-0 rounded-md py-1.5 text-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-green text-[12px] px-4"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Step 2 */}
        {step === 2 && (
          <div className="flex flex-col items-start w-full justify-start mx-auto gap-5">
            <DialogTitle className="font-bold">
              Résumé de la commande
            </DialogTitle>
            <div className="space-y-2 w-full">
              <div className="w-full flex flex-row items-center justify-between hover:bg-light/70 text-[13px]">
                <span>Sous-total</span>
                <span className="font-semibold notranslate">
                  {formatMoney(cart.totalPrice, currency, rate)}
                </span>
              </div>
              <div className="w-full flex flex-row items-center justify-between hover:bg-light/70 text-[13px]">
                <span>TVA</span>
                <span className="font-semibold notranslate">
                  {formatMoney(0, currency, rate)}
                </span>
              </div>
              <div className="w-full flex flex-row items-center justify-between hover:bg-light/70 text-[13px]">
                <span>Methode de livraison</span>
                <span className="font-semibold notranslate">
                  {shippingData.type}
                </span>
              </div>
              {selectedShippingMethod === 4 && (
                <div className="w-full flex flex-row items-center justify-between hover:bg-light/70 text-[13px]">
                  <span>Adresse de livraison</span>
                  <span className="font-semibold notranslate">
                    {shippingAddress}
                  </span>
                </div>
              )}
              <div className="w-full flex flex-row items-center justify-between hover:bg-light/70 text-[13px]">
                <span>Frais de livraison</span>
                <span className="font-semibold notranslate">
                  {formatMoney(shippingData.frais, currency, rate)}
                </span>
              </div>
              <div className="w-full flex flex-row items-center justify-between hover:bg-light/70 text-[13px]">
                <span>Devise</span>
                <span className="font-semibold notranslate">
                  {currency.toUpperCase()}
                </span>
              </div>
              <div className="w-full flex flex-row items-center justify-between hover:bg-light/70 text-[13px]">
                <span>Compte &nbsp;</span>
                {payWhitAnotherPhone ? (
                  <span className="font-semibold notranslate">
                    {paymentPhone}
                  </span>
                ) : (
                  <span className="font-semibold notranslate">
                    {user.phone}
                  </span>
                )}
              </div>
              <div className="w-full border-t border-black/30"></div>
              <div className="w-full flex flex-row items-center justify-between hover:bg-light/70 text-[13px]">
                <span>Total à payer &nbsp;</span>

                <span className="font-semibold notranslate">
                  {" "}
                  {formatMoney(
                    cart.totalPrice + shippingData.frais,
                    currency,
                    rate
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}

        {step === 3 && (
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
                  🔒 Ne vous inquiétez pas, vos informations sont sécurisées
                  avec nous !
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-5">
          {step === 1 && (
            <>
              <button
                onClick={closeModal}
                className="px-4 py-2 text-[14px] bg-red-400 text-white rounded-lg overflow-hidden"
              >
                Annuler
              </button>
              {payWhitAnotherPhone && paymentPhone.length >= 9 ? (
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 text-[14px] bg-blue-400 text-white rounded-lg overflow-hidden"
                >
                  Suivant
                </button>
              ) : (
                !payWhitAnotherPhone && (
                  <button
                    onClick={handleNextStep}
                    className="px-4 py-2 text-[14px] bg-blue-400 text-white rounded-lg overflow-hidden"
                  >
                    Suivant
                  </button>
                )
              )}
            </>
          )}

          {step > 1 && step < 3 && (
            <button
              onClick={handlePrevStep}
              className="px-4 py-2 text-[14px] bg-orange-400 text-white rounded-lg overflow-hidden"
            >
              Retour
            </button>
          )}
          {step === 2 && (
            <button
              onClick={handleCheckout}
              className="px-4 py-2 text-[14px] bg-primary-green text-white rounded-lg overflow-hidden"
            >
              {status === "loading" ? "Traitement ..." : "Confirmer"}
            </button>
          )}
        </div>
      </div>
    );
  };

  const handleOpenModal = () => {
    if (selectedShippingMethod === 0) {
      setErrors({
        ...errors,
        shippingMethod: "Veuillez sélectionner une méthode d'expédition",
      });
      notify("Veuillez sélectionner une méthode d'expédition", "error");
    } else if (selectedShippingMethod === 4 && shippingAddress === "") {
      setErrors({ ...errors, shippingAddress: "Veuillez entrer l'adresse" });
      notify("Veuillez entrer l'adresse de livraison", "error");
    } else {
      try {
        if (isAuthenticated) {
          setStep(1);
          handleOpen();
        } else {
          notify("Veuillez vous connecter pour continuer", "error");
        }
      } catch (error: any) {
        notify(error.message, "error");
      }
    }
  };

  useEffect(() => {
    if (step >= 1) {
      handleOpen();
    }
  }, [step, status, payWhitAnotherPhone, paymentPhone]);

  return (
    <div className="w-full p-5 space-y-8">
      <div className="font-semibold text-[16px]">Résumé de la commande</div>
      {isClient && cart.totalPrice > 0 && (
        <div className="space-y-5">
          <div className="w-full flex flex-row items-center justify-between text-[14px]">
            <span>Sous-total</span>
            <span className="font-semibold notranslate">
              {formatMoney(cart.totalPrice, currency, rate)}
            </span>
          </div>
          <div className="w-full flex flex-row items-center justify-between text-[14px]">
            <span>TVA</span>
            <span className="font-semibold notranslate">
              {formatMoney(0, currency, rate)}
            </span>
          </div>

          <div className="relative w-full cursor-pointer flex flex-col items-center justify-between text-[14px]">
            <button
              className={`p-1 bg-gray-100 w-full text-start flex flex-row items-center justify-between`}
              type="button"
              onClick={() => setOpenShipping(!openShipping)}
            >
              <span className="text-[14px]">Méthode de livraison</span>
              <ChevronDoubleDownIcon
                className={`w-4 h-4 text-black font-bold transition-all duration-200 ease-linear ${
                  openShipping && "rotate-180"
                }`}
              />
            </button>
            <AnimatePresence>
              {openShipping && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full rounded-b-lg overflow-hidden bg-dark/20 p-2"
                >
                  {loading ? (
                    <div>Loading</div>
                  ) : (
                    (livraisons as { data: { rows: any[] } })?.data?.rows?.map(
                      (livraison) => (
                        <div
                          onClick={() =>
                            setTimeout(() => {
                              setOpenShipping(!openShipping);
                            }, 200)
                          }
                          key={livraison.id}
                          className="w-full space-y-2"
                        >
                          <input
                            type="radio"
                            id={livraison.id}
                            name="shipping_method"
                            value={livraison.id}
                            checked={selectedShippingMethod === livraison.id}
                            onChange={handleShipping}
                            className="hidden"
                          />
                          <label
                            htmlFor={livraison.id}
                            className={`block w-full text-black rounded-md p-2 mb-2 space-y-2 ${
                              selectedShippingMethod === livraison.id
                                ? "bg-primary-green/40"
                                : "bg-white hover:bg-primary-green/20"
                            }`}
                          >
                            <div className="w-full inline-flex items-center justify-between font-semibold">
                              <span className="capitalize text-[12px]">
                                {livraison.type.trim()}
                              </span>
                              <span className="text-[10px] notranslate">
                                {formatMoney(
                                  livraison.frais_livraison,
                                  currency,
                                  rate
                                )}
                              </span>
                            </div>
                            <div className="text-[11px]">
                              {livraison.description.trim()}
                            </div>

                            <div className="text-[11px]">
                              <span>Lieux : </span>{" "}
                              <span>{livraison.lieux.trim()}</span>
                            </div>
                          </label>
                        </div>
                      )
                    )
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {shippingData.type && (
            <>
              <div className="w-full flex flex-row items-center justify-between text-[14px]">
                <span className="font-semibold text-center w-full text-primary-green">
                  {shippingData.type}
                </span>
              </div>
              <div className="w-full flex flex-row items-center justify-between text-[14px]">
                <span>Frais de livraison</span>
                <span className="font-semibold notranslate">
                  {formatMoney(shippingData.frais, currency, rate)}
                </span>
              </div>
              {selectedShippingMethod === 4 ? (
                <div className="w-full">
                  <label
                    htmlFor="phone"
                    className="block text-[13px] font-medium leading-6 text-dark space-x-2"
                  >
                    Address de Livraison
                  </label>

                  <div className="mt-1 relative rounded-md overflow-hidden">
                    <textarea
                      id="shipping-adress"
                      name="shipping-adress"
                      value={shippingAddress}
                      placeholder="Entrer l'Adresse de livraison"
                      onChange={(e) => setShippingAddress(e.target.value)}
                      minLength={0}
                      className={`outline-none block w-full border-0 rounded-md py-1.5 text-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-green text-[14px] px-4 
                    
                    `}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-row items-center justify-between text-[14px]">
                  <span className="text-nowrap">Adresse de livraison</span>
                  <span className="font-semibold">{shippingData.lieux}</span>
                </div>
              )}
            </>
          )}
          <div className="w-full border-t border-black/30"></div>
          <div className="w-full flex flex-row items-center justify-between text-[14px]">
            <span>Total à payer</span>
            <span className="font-semibold notranslate">
              {formatMoney(
                cart.totalPrice + shippingData.frais,
                currency,
                rate
              )}
            </span>
          </div>

          {/* Mode de payment */}
          <fieldset className="border border-black  p-5">
            <legend className="px-2 text-center text-[14px]">
              Paiement pris en charge
            </legend>
            <div className="w-full grid grid-cols-4 items-center justify-center gap-4">
              <div className="w-full h-[50px] rounded-md overflow-hidden">
                <CustomImage
                  src={images.logos.airtel}
                  alt="africel"
                  className="w-full h-full object-contain object-center"
                  width={500}
                  height={500}
                />
              </div>
              <div className="w-full h-[50px] rounded-md overflow-hidden">
                <CustomImage
                  src={images.logos.mpesa}
                  alt="africel"
                  className="w-full h-full object-contain object-center"
                  width={500}
                  height={500}
                />
              </div>
              <div className="w-full h-[50px] rounded-md overflow-hidden">
                <CustomImage
                  src={images.logos.orange}
                  alt="africel"
                  className="w-full h-full object-contain object-center"
                  width={500}
                  height={500}
                />
              </div>
              <div className="w-full h-[50px] rounded-md overflow-hidden">
                <CustomImage
                  src={images.logos.africel}
                  alt="africel"
                  className="w-full h-full object-contain object-center"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </fieldset>

          {isAuthenticated ? (
            cart.totalPrice > 0 && (
              <button
                type="submit"
                onClick={() => handleOpenModal()}
                className="text-white bg-secondary-green hover:bg-primary-green py-3 px-5 text-center rounded-lg w-full"
              >
                {/* {status === "loading" ? "Traitement ..." : "Passer à la caisse"} */}
                Passer à la caisse
              </button>
            )
          ) : (
            <Link
              href={"/login"}
              className="text-white block bg-primary-green hover:bg-secondary-green py-3 px-5 text-center rounded-lg w-full"
            >
              Connectez-vous pour continuer
            </Link>
          )}
          <div className="text-center text-[14px] space-y-5">
            <p>ou</p>
            <Link
              className="text-[14px] text-secondary-green font-semibold"
              href={"/shop"}
            >
              &larr; Continuer vos achats &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSummary;
