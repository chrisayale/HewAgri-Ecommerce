import React from "react";
import { BarChart } from "@mui/x-charts";
import { ResponseDashboard } from "@/types";

const BasicChart = ({ data }: { data: ResponseDashboard }) => {
  return (
    <div className=" flex justify-center items-center flex-col gap-4">
      <p className="font-medium text-base text-center uppercase ">
        Utilisateurs & Clients
      </p>
      <BarChart
        // width={650}
        height={410}
        series={[
          {
            data: data?.data?.details?.users?.yAxis,
            label: "Utilisateurs",
            color: "#14b8a6",
          },
          {
            data: data?.data?.details?.customers?.yAxis,
            label: "Clients",
            color: "#3b82f6",
          },
        ]}
        xAxis={[
          { data: data?.data?.details?.users?.xAxis, scaleType: "band" },
          { data: data?.data?.details?.customers?.xAxis, scaleType: "band" },
        ]}
      />
    </div>
  );
};

export default BasicChart;
