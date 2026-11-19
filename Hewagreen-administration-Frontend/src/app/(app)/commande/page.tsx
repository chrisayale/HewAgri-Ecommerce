"use client";
import { _commandes } from "@/controller/tanstack/commande/getCommande.service";
import { Tabs, TabsProps } from "antd";
import React from "react";
import ToutleCommannde from "./toutlecommande/page";
import CommaParStatusValidee from "./commandeencours/page";
import CommaTraiter from "./commandetraiter/page";
import CommandeNonPayer from "./commandenonpayer/page";
import CommandeAnnuler from "./commandeannuler/page";
import CommaLivrer from "./commandelivrer/page";
import CmdReference from "./reference/page";

const Home = () => {
  const tabsItems: TabsProps["items"] = [
    {
      key: "tout-commande",
      label: " Toute les commandes",
      children: <ToutleCommannde />,
    },
    {
      key: "cmd-etat",
      label: "Commandes payées",
      children: <CommaTraiter />,
    },
    {
      key: "cmd-nonpayer",
      label: "Commandes non payées",
      children: <CommandeNonPayer />,
    },
    {
      key: "cmd-annuler",
      label: "Commandes Annulées",
      children: <CommandeAnnuler />,
    },
    
    
    {
      key: "cmd-payer",
      label: "Commandes livraison encours",
      children: <CommaParStatusValidee />,
    },
    {
      key: "cmd-livrer",
      label: "Commandes livrées",
      children: <CommaLivrer />,
    },

    {
      key: "cmd-transaction",
      label: "Commande par Reference",
      children: <CmdReference />,
    },
    // {
    //   key: "cmd-coop",
    //   label: "Commande par Cooperative",
    //   children: <CommaParCooperative />,
    // },
    
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
        <h2 className="font-semibold text-xl">Commandes</h2>
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
