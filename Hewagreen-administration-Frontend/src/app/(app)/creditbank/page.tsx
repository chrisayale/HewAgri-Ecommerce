"use client";
import { _commandes } from "@/controller/tanstack/commande/getCommande.service";
import { Tabs, TabsProps } from "antd";
import React from "react";
import ToutCreditsBanque from "./toutcredits/page";
import CreditByStatus from "./creditstatus/page";
import CreditByCoopEtStatus from "./creditbycoopetstatus/page";
import CreditByMember from "./creditbymember/page";


const Home = () => {
  const tabsItems: TabsProps["items"] = [
    {
      key: "tout-credits",
      label: "Tout les credits",
      children: <ToutCreditsBanque />,
    },
    
    {
        key: "cmd-coop",
        label: "Crédits par coopérative",
        children: <CreditByCoopEtStatus />,
      },
      
      {
        key: "cmd-non-payee",
        label: "Crédits par membre",
        children: <CreditByMember />,
      },
   
    {
      key: "cmd-etat",
      label: "Crédits par etat",
      children: <CreditByStatus />,
    },
    
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
        <h2 className="font-semibold text-xl">Crédits</h2>
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
