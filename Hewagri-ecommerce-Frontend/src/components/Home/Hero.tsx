"use client";

import React, { useEffect } from "react";
import HeroCard from "./HeroCard";
import { LiaShippingFastSolid } from "react-icons/lia";
import { RiCustomerServiceFill, RiSecurePaymentLine } from "react-icons/ri";
import { IconContext } from "react-icons";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import { images } from "@/data";
import { Autoplay } from "swiper/modules";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { fetchCarousels } from "@/lib/redux/slices/carouselSlice";
import { CustomImage } from "../shared";

const Hero = () => {
  const dispatch = useAppDispatch();
  const { carousels, loading } = useAppSelector((state) => state.carousels);

  const features = [
    {
      title: "Livraison Gratuite",
      icon: LiaShippingFastSolid,
      description: "Profitez de la livraison gratuite sur 10 de vos commandes",
    },
    {
      title: "Paiement Sécurisé",
      icon: RiSecurePaymentLine,
      description: "Nous garantissons la sécurité de vos paiements",
    },
    {
      title: "Service Client",
      icon: RiCustomerServiceFill,
      description: "Accédez instantanément 24h/7 à notre équipe de support.",
    },
  ];

  useEffect(() => {
    dispatch(fetchCarousels());
  }, [dispatch]);

  return (
    <section id="home-hero" className="w-full mx-auto space-y-5">
      {loading ? (
        <div className="w-full text-center">Loading</div>
      ) : (carousels as { data: { rows: any[] } })?.data?.rows?.length === 0 ? (
        <div className="relative w-full mx-auto flex flex-col items-center justify-center z-30 rounded-lg overflow-hidden">
          <div className="w-full flex flex-col items-center justify-center z-40 p-5 tex-white space-y-3 min-h-[200px]">
            <h1 className="text-yellow-200 font-bold text-[25px] leading-[28px] md:text-[30px] md:leading-[30px] lg:text-[40px] lg:leading-[40px] text-center">
              Un Fruit Offert avec Chaque Commande !
            </h1>
            <p className="text-light/90 text-[14px] text-center ">
              Régalez-vous avec un fruit juteux offert à chaque achat, pour une
              pause gourmande et saine.
            </p>
          </div>
          <div className="absolute inset-0 w-full h-full z-30">
            <div className="absolute inset-0 bg-black/60" />
            <CustomImage
              src={images.products.product3}
              alt={`fruit image image`}
              className="w-full h-full object-center object-cover"
              width={1000}
              height={1000}
            />
          </div>
        </div>
      ) : (
        <Swiper
          loop={true}
          autoplay={{ delay: 5000 }}
          modules={[Autoplay]}
          className="mySwipper"
        >
          {(carousels as { data: { rows: any[] } })?.data?.rows?.map(
            (carousel, index) => (
              <SwiperSlide key={index}>
                <HeroCard
                  title={carousel.title}
                  description={carousel.sub_title}
                  image={carousel.carousel}
                />
              </SwiperSlide>
            )
          )}
        </Swiper>
      )}
      <div className="z-50 grid grid-cols-1 lg:grid-cols-3 items-stretch justify-between w-full gap-5">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-row items-center justify-center bg-light p-3 gap-3 rounded-lg"
          >
            <div>
              <IconContext.Provider
                value={{ color: "green", className: "text-[50px]" }}
              >
                <div>
                  <feature.icon size={50} />
                </div>
              </IconContext.Provider>
            </div>
            <div className="flex flex-col items-start justify-center space-y-1">
              <span className="font-semibold text-[14px]">{feature.title}</span>
              <span className="text-[12px]">{feature.description}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
