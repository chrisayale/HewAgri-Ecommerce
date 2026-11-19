import React from "react";
import { DefaultizedPieValueType } from "@mui/x-charts";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

const PieBasicChartTown = ({ dash }: { dash: any }) => {
  const data = [
    { label: "Goma", value: dash?.all_data?.citizen?.male, color: "#0088FE" },
    {
      label: "Butembo",
      value: dash?.all_data?.citizen?.female,
      color: "#00C49F",
    },
    { label: "Beni", value: dash?.all_data?.citizen?.dead, color: "#FFBB28" },
  ];

  const sizing = {
    margin: { right: 5 },
    // width: 200,
    height: 350,
    legend: { hidden: true },
  };
  const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

  const getArcLabel = (params: DefaultizedPieValueType) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };
  return (
    <div className=" w-full flex relative">
      <div className=" absolute w-full flex flex-col bottom-1 left-1 gap-1">
        <div className=" flex gap-1 items-center">
          <div className=" w-4 h-4 bg-teal-500 rounded-sm"></div>
          <p>Femme</p>
        </div>
        <div className=" flex gap-1 items-center">
          <div className=" w-4 h-4 bg-blue-500 rounded-sm"></div>
          <p>Homme</p>
        </div>
      </div>

      <PieChart
        series={[
          {
            outerRadius: 150,
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

export default PieBasicChartTown;
