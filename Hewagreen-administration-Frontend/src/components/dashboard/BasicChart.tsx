import React from "react";
import { BarChart } from "@mui/x-charts";
import { ResponseDashboard } from "@/types";
import { Box, Typography, Skeleton } from "@mui/material";

const BasicChart = ({ data }: { data: ResponseDashboard | undefined }) => {
  // Vérifier si les données sont valides
  const usersData = data?.data?.details?.users;
  const customersData = data?.data?.details?.customers;

  const hasValidData =
    Array.isArray(usersData?.xAxis) && usersData.xAxis.length > 0 &&
    Array.isArray(usersData?.yAxis) && usersData.yAxis.length > 0 &&
    Array.isArray(customersData?.xAxis) && customersData.xAxis.length > 0 &&
    Array.isArray(customersData?.yAxis) && customersData.yAxis.length > 0;

  // Si pas de données, afficher un état vide
  if (!data) {
    return (
      <Box className="flex justify-center items-center flex-col gap-4 h-[410px]">
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="rectangular" width="100%" height={350} />
      </Box>
    );
  }

  if (!hasValidData) {
    return (
      <Box className="flex justify-center items-center flex-col gap-4 h-[410px] bg-white rounded-md shadow-md p-6">
        <Typography variant="body1" color="text.secondary" className="text-center">
          Aucune donnée disponible pour le graphique
        </Typography>
      </Box>
    );
  }

  return (
    <div className="flex justify-center items-center flex-col gap-4">
      <Typography variant="body1" className="font-medium text-base text-center uppercase">
        Utilisateurs & Clients
      </Typography>
      <BarChart
        height={410}
        series={[
          { data: usersData.yAxis, label: "Utilisateurs", color: "#14b8a6" },
          { data: customersData.yAxis, label: "Clients", color: "#3b82f6" },
        ]}
        xAxis={[
          { data: usersData.xAxis, scaleType: "band" },
          { data: customersData.xAxis, scaleType: "band" },
        ]}
      />
    </div>
  );
};

export default BasicChart;