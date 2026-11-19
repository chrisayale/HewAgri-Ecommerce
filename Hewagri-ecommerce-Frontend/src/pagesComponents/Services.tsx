import React from "react";
import { TiWeatherDownpour } from "react-icons/ti";
import { GiCash } from "react-icons/gi";
import { PiPottedPlantFill } from "react-icons/pi";
import { IoStatsChart } from "react-icons/io5";

const Services = () => {
  const services = [
    {
      name: "Météo Agricole",
      icon: TiWeatherDownpour,
      description:
        "Les agriculteurs arrosent avant la pluie faute de prévisions fiables, gaspillant ressources et énergie. Notre service météo par SMS, utilisé par 7 800 agriculteurs au Nord-Kivu (RDC), les aide à mieux gérer leurs ressources.",
    },
    {
      name: "Prix du marché",
      icon: IoStatsChart,
      description:
        "Sans connaître les prix du marché, les agriculteurs peinent à négocier. Notre système SMS, avec un collecteur local, fournit les prix en temps réel pour améliorer leurs ventes.",
    },
    {
      name: "Crédit Agricole",
      icon: GiCash,
      description:
        "L’accès au crédit est limité pour les agriculteurs. Nous facilitons des solutions de microcrédit adaptées à leurs besoins, leur permettant d’investir et de développer leurs exploitations.",
    },
    {
      name: "Conseils Agricoles",
      icon: PiPottedPlantFill,
      description:
        "Beaucoup ignorent les pratiques durables. Nous collaborons avec des agriculteurs expérimentés pour partager des conseils adaptés.",
    },
  ];
  return (
    <section id="services" className="w-full mx-auto">
      <div className="section-container p-5 md:p-10 lg:p-20 space-y-8">
        <h2 className="text-center text-[25px] font-semibold">Nos Services</h2>
        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 items-center md:items-stretch justify-start gap-5">
          {services.map((service, index) => (
            <div
              key={index}
              className="border bg-light/50 hover:bg-light space-y-5 p-5 rounded-lg overflow-hidden"
            >
              <div className="inline-flex items-center justify-start gap-5">
                <h3 className="text-secondary-green font-bold text-[20px]">
                  {service.name}
                </h3>

                <service.icon className="text-[25px] text-secondary-green" />
              </div>
              <p className="text-[14px] select-none">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
