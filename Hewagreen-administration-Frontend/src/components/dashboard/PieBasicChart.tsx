import React from "react";
import { DefaultizedPieValueType } from "@mui/x-charts";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { ResponseDashboard } from "@/types";

const PieBasicChart = ({ _data }: { _data: ResponseDashboard }) => {
  const data = [
    {
      label: "Banques",
      value: _data?.data?.stats?.banks,
      color: "#16a34a",
    },
    {
      label: "Utilisateurs",
      value: _data?.data?.stats?.users,
      color: "#713f12",
    },
    {
      label: "Commandes",
      value: _data?.data?.stats?.commandes,
      color: "#f97316",
    },
    {
      label: "Produits",
      value: _data?.data?.stats?.products,
      color: "#ca8a04",
    },
    {
      label: "Cooperative",
      value: _data?.data?.stats?.cooperatives,
      color: "#FFBB28",
    },
    {
      label: "Clients",
      value: _data?.data?.stats?.customers,
      color: "#ca8a0190",
    },
  ];

  const sizing = {
    margin: { right: 5 },
    // width: 200,
    height: 280,
    legend: { hidden: true },
  };
  const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

  const getArcLabel = (params: DefaultizedPieValueType) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(2)}%`;
  };
  return (
    <div className=" w-full flex relative">
      <div className=" absolute w-full flex flex-col bottom-[0px] left-1 gap-1">
        <div className=" flex gap-1 items-center">
          <div className=" w-4 h-4  bg-lime-600 rounded-sm"></div>
          <p className=" text-[12px]">Banques</p>
        </div>
        <div className=" flex gap-1 items-center">
          <div className=" w-4 h-4 bg-yellow-900 rounded-sm"></div>
          <p className=" text-[12px]">Utilisateurs</p>
        </div>
        <div className=" flex gap-1 items-center">
          <div className=" w-4 h-4 bg-orange-500 rounded-sm"></div>
          <p className=" text-[12px]">Commandes</p>
        </div>
        <div className=" flex gap-1 items-center">
          <div className=" w-4 h-4 bg-yellow-600 rounded-sm"></div>
          <p className=" text-[12px]">Produits</p>
        </div>
        <div className=" flex gap-1 items-center">
          <div className=" w-4 h-4 bg-lime-800 rounded-sm"></div>
          <p className=" text-[12px]">Cooperatives</p>
        </div>
        <div className=" flex gap-1 items-center">
          <div className=" w-4 h-4 bg-yellow-500 rounded-sm"></div>
          <p className=" text-[12px]">Clients</p>
        </div>
      </div>

      <PieChart
        series={[
          {
            outerRadius: 120,
            data,
            arcLabel: getArcLabel,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "white",
            fontSize: 15,
            // width: "100%",
          },
        }}
        {...sizing}
      />
    </div>
  );
};

export default PieBasicChart;
