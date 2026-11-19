"use client";
import { _commandes } from "@/controller/tanstack/commande/getCommande.service";
import { Tabs, TabsProps } from "antd";
import React from "react";
import HomeCategorieCoop from "./categoriecoop/page";
import HomeCategorieProduit from "./categorieproduit/page";
import HomeSOusCategorie from "./souscategorie/page";


const Home = () => {
  const tabsItems: TabsProps["items"] = [
    {
      key: "tout-coopera",
      label: "Catégorie Cooperative",
      children: <HomeCategorieCoop />,
    },
    {
      key: "cmd-produit",
      label: "Catégorie Produit",
      children: <HomeCategorieProduit />,
    },
    {
      key: "cmd-sous",
      label: "Sous Catégorie",
      children: <HomeSOusCategorie />,
    },
     
  ];


  return <div>
    <div>
      <main>
        <h2>Catégorie</h2>
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
