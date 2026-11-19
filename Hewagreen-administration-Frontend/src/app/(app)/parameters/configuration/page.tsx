"use client";
import { _commandes } from "@/controller/tanstack/commande/getCommande.service";
import { Tabs, TabsProps } from "antd";
import React from "react";
import HomeRoles from "./roles/page";
import HomeUniteMesure from "./unitemesure/page";
import HomeTypeLivraison from "./typelivraison/page";
import HomeTaux from "./taux/page";


const Home = () => {
  const tabsItems: TabsProps["items"] = [
    {
      key: "tout-roles",
      label: "Roles",
      children: <HomeRoles />,
    },
    {
      key: "cmd-mesure",
      label: "Unité de mesure",
      children: <HomeUniteMesure />,
    },
    {
      key: "cmd-type",
      label: "Type Livraison",
      children: <HomeTypeLivraison />,
    },
    {
      key: "cmd-taux",
      label: "Taux",
      children: <HomeTaux />,
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
