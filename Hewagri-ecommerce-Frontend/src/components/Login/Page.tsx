"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { CustomImage, SocialIcons } from "../shared";
import { images } from "@/data";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import LoginForm from "./LoginForm";

const Page = () => {
  const router = useRouter();

  return (
    <section className="relative w-full mx-auto">
      <div className="section-container pt-5 px-5 md:px-10 lg:px-20">
        <button
          onClick={() => router.back()}
          className="bg-gray-300 rounded-lg hover:bg-light py-3 px-5 inline-flex items-center justify-center space-x-3"
        >
          <ArrowLeftIcon className="w-5 h-5 md:w-8 md:h-8 text-primary-green" />
          <span className="text-14px hidden md:block">Retourner</span>
        </button>
      </div>
      <div className="section-container p-5 md:px-10 lg:px-20 flex flex-col items-center justify-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-stretch justify-center gap-3 md:gap-0 md:rounded-lg overflow-hidden">
          <div className="hidden bg-primary-green p-5 md:p-10 text-white md:flex flex-col items-center justify-center text-center h-[80vh]">
            <div className="w-[300px] h-[200px]">
              <CustomImage
                src={images.logos.logo4}
                alt="hewagri logo"
                className="w-full h-full object-contain object-center "
                width={1000}
                height={1000}
              />
            </div>{" "}
            <h1 className="text-[30px] font-bold text-yellow-500">
              Bienvenue Sur HewAgri
            </h1>
            <p className="text-[14px] text-light mt-5">
              Connectez-vous pour accéder à des offres exclusives, gérer vos
              commandes et profiter d&apos;une expérience d&apos;achat
              personnalisée.
            </p>
            <div className="mt-5">
              <SocialIcons color="white" />
            </div>
          </div>
          <div className="bg-secondary-green/5 flex flex-col items-center justify-center">
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
