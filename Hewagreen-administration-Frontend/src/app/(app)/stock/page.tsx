"use client";
import { _commandes } from "@/controller/tanstack/commande/getCommande.service";
import { Tabs, TabsProps } from "antd";
import React from "react";
import HomeAllStock from "./tout/page";
import HomeStockByCoop from "./stockbycoop/page";

const Home = () => {
  const tabsItems: TabsProps["items"] = [
    {
      key: "tout-stock",
      label: "Tout stocks",
      children: <HomeAllStock />,
    },

    {
      key: "tout-par-coop",
      label: "Stocks par coopérative",
      children: <HomeStockByCoop />,
    },
  ];

  return (
    <div>
      <div>
        <main>
          <h1 className="font-semibold text-xl">Stocks</h1>
          <div className="mt-3">
            <Tabs type="card" items={tabsItems} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
