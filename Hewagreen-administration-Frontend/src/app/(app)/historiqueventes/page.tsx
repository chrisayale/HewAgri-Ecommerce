"use client";
import { _commandes } from "@/controller/tanstack/commande/getCommande.service";
import { Tabs, TabsProps } from "antd";
import React from "react";
import VenteParCooperative from "./ventecooperative/page";
import VenteParMembre from "./ventemembre/page";


const Home = () => {
  const tabsItems: TabsProps["items"] = [
    {
      key: "vente-par-cooperative",
      label: "historique de vente par coopérative",
      children: <VenteParCooperative />,
    },
    
    // {
    //     key: "vente-par-membre",
    //     label: "historique d'approvisionnement par membre",
    //     children: <VenteParMembre />,
    //   },
    
  ];

  Donc:

  {/*1. Toutes les commandes 
  2. Commandes payées 
  2. Commandes non payées 
  3. Commandes Annulées
  4. Commandes livraison encours 
  5. Commandes livrées
  */ }
  return <div>
    <div>
      <main>
        <h2 className="font-semibold text-xl">Hsitorique de vente par coopérative</h2>
        <div
          className="mt-3"
          
        >
          <Tabs type="card" items={tabsItems} />
        </div>
      </main>
    </div>
  </div>;
};

export default Home;
