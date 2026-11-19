/* eslint-disable react/no-unescaped-entities */
"use client";

import { Disclosure, DisclosureButton } from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CustomImage, SearchInput, SocialIcons } from "../shared";
import Link from "next/link";
import { RiCustomerService2Line } from "react-icons/ri";
import { formatMoney, formatPhoneNumber } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import BreadCrumbs from "../BreadCrumbs";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import InstallButton from "../InstallButton";
import ProfileButton from "./ProfileButton";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import Filter from "../Home/Filter";
import CurrencySwitcher from "./CurrencySwitcher";
import { fetchRate } from "@/lib/redux/slices/currencySlice";

const navigation = [
  { name: "Home", href: "/", current: true, class: "notranslate" },
  { name: "Market", href: "/shop", current: true, class: "" },
  { name: "Services", href: "/services", current: false, class: "" },
  { name: "Nous Contacter", href: "contact", current: false, class: "" },
  { name: "Panier", href: "/cart", current: false, class: "" },
];

export default function Navbar() {
  const { currency, rate } = useAppSelector((state) => state.currency);
  const cart = useAppSelector((state) => state.cart);
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathName = usePathname();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchRate());
    setIsClient(true);
  }, [dispatch, isClient]);

  return (
    <Disclosure as="nav" className={`relative w-full mx-auto text-[14px]`}>
      <div className="relative bg-primary-green flex flex-col space-y-5 w-full">
        {/* Top Bar */}
        <div
          className="w-full z-50 bg-primary-green section-container px-5 md:px-10 lg:px-20 flex flex-row flex-wrap 
        items-center justify-center md:justify-between text-white pt-5 gap-5"
        >
          <div className="flex flex-row items-center justify-between w-full md:w-auto md:justify-start space-x-5">
            <span className="text-[16px] hidden">Suivez-nous :</span>
            <SocialIcons />
            <InstallButton />
          </div>

          <div className="inline-flex items-center justify-between w-full md:w-auto space-x-5 ">
            <CurrencySwitcher />
            <LanguageSwitcher />

            <div className="inline-flex items-center justify-end space-x-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    href={"/login"}
                    className="hover:text-yellow-300 text-white font-semibold"
                  >
                    Se connecter
                  </Link>
                  {/* <span>/</span>
                  <Link
                    href={"/register"}
                    className="text-yellow-200 hover:text-white font-semibold"
                  >
                    S&apos;inscrire
                  </Link> */}
                </>
              ) : (
                <>
                  <ProfileButton />
                </>
              )}
            </div>
          </div>
          <div className="w-full mt-4 border-t border-gray-300/70 shadow drop-shadow-md" />
        </div>

        {/* Menu features */}
        <div className="mt-[150px] section-container px-5 md:px-10 lg:px-20 flex flex-row items-center justify-between">
          <Link href={"/"} className="w-[150px]">
            <CustomImage
              src={"/images/logos/logo4.png"}
              alt="HewAgri logo"
              className="w-full h-full object-cover object-center"
              width={1000}
              height={1000}
            />
          </Link>
          {(pathName === "/shop" || pathName === "/") && (
            <div className="hidden lg:block flex-1">
              <div className="max-w-md mx-auto">
                <SearchInput />
              </div>
            </div>
          )}
          <div className="flex flex-row items-center justify-end space-x-5">
            <Link
              href="tel:+243853628926"
              target="_blank"
              className="flex flex-row items-center justify-center space-x-2"
            >
              <div className="block md:hidden">
                <RiCustomerService2Line color="white" size={38} />
              </div>
              <div className="hidden md:block">
                <RiCustomerService2Line color="white" size={50} />
              </div>
              <div className="hidden md:flex flex-col items-start justify-center space-y-1">
                <span className="text-white text-[11px]">service client</span>
                <span className="text-yellow-200 text-[14px] font-semibold notranslate">
                  {formatPhoneNumber("+243853628926")}
                </span>
              </div>
            </Link>
            <Link
              href={"/cart"}
              className="flex flex-row items-center justify-center"
            >
              <div className="relative">
                <ShoppingBagIcon className="w-10 md:w-14 h-10 md:h-14 text-white" />

                {isClient && cart.totalQuantity !== 0 && (
                  <div className="rounded-full absolute top-1 right-1 bg-red-600 w-4 md:w-6 h-4 md:h-6 flex items-center justify-center">
                    <span className="text-[10px] md:text-[12px] text-white notranslate">
                      {Object.keys(cart?.items).length}
                    </span>
                  </div>
                )}
              </div>

              <div className="hidden md:flex flex-col space-y-1">
                <span className="text-white text-[11px]">Panier :</span>
                {isClient && cart.totalPrice !== 0 ? (
                  <span className="text-yellow-200 font-bold notranslate">
                    {formatMoney(cart.totalPrice, currency, rate)}
                  </span>
                ) : (
                  <span className="text-yellow-200 font-bold notranslate">
                    {formatMoney(0, currency, rate)}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>

        {(pathName === "/shop" || pathName === "/") && (
          <div className="section-container px-5 md:px-10 lg:px-20 block lg:hidden w-full mx-auto">
            <SearchInput />
          </div>
        )}

        <div className="bg-light py-2 md:py-4">
          <div className="section-container px-5 md:px-10 lg:px-20 flex flex-row items-center justify-between ">
            <nav className="flex md:hidden" aria-label="Breadcrumb">
              <BreadCrumbs />
            </nav>

            <nav className="hidden md:inline-flex items-center justify-start space-x-10">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={`relative font-semibold hover:text-primary-green ${
                    pathName === item.href ? "text-primary-green" : "text-black"
                  }  ${item.class}`}
                >
                  {item.name}
                  {isClient &&
                    item.name === "Panier" &&
                    cart.totalPrice !== 0 && (
                      <div className="p-1 notranslate rounded-full w-5 h-5 flex items-center justify-center absolute -top-3 -right-3 text-center text-[10px] bg-red-400 text-white">
                        {Object.keys(cart?.items).length}
                      </div>
                    )}
                </Link>
              ))}
            </nav>

            {(pathName === "/shop" || pathName === "/") && (
              <div className="ml-auto inline-flex items-center justify-end space-x-3">
                {/* Mobile menu button*/}
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="md:hidden group relative inline-flex items-center justify-center rounded-md p-2"
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {isFilterOpen ? (
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-8 w-8 text-red-600 group-data-[open]:block"
                    />
                  ) : (
                    <AdjustmentsHorizontalIcon
                      aria-hidden="true"
                      className="block h-8 w-8 text-black group-data-[open]:hidden"
                    />
                  )}
                </button>
              </div>
            )}

            <div className="ml-auto inline-flex items-center justify-end space-x-3">
              {/* Mobile menu button*/}
              <DisclosureButton
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden group relative inline-flex items-center justify-center rounded-md p-2"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block h-8 w-8 text-black group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden h-8 w-8 text-red-600 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full backdrop-blur-md bg-white p-5 md:hidden overflow-hidden"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={`relative text-black w-full bg-dark/20 hover:bg-dark hover:text-white border-black p-3 inline-flex items-center justify-start space-x-5 ${item.class}`}
                >
                  <span>{item.name}</span>
                  {isClient &&
                    item.name === "Panier" &&
                    cart.totalPrice !== 0 && (
                      <span className="p-1 rounded-lg w-5 h-5 flex items-center justify-center  text-center text-[10px] bg-red-400 text-white notranslate">
                        {Object.keys(cart?.items).length}
                      </span>
                    )}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full backdrop-blur-md bg-white p-5 md:hidden overflow-hidden"
          >
            <Filter />
          </motion.div>
        )}
      </AnimatePresence>
    </Disclosure>
  );
}
