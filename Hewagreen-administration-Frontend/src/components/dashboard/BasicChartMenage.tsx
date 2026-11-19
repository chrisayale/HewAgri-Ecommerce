import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const BasicChartMenage = ({ dash }: { dash: any }) => {
  interface Ville {
    designation: string;
    data: {
      total: number;
      location: number;
      owner: number;
    };
  }
  let xLabels: Ville[] = [];
  console.log(dash?.per_town, "dash");

  dash?.per_town?.forEach((element: any) => {
    xLabels.push({
      designation: element?.designation,
      data: {
        total: element?.menage?.total,
        location: element?.menage?.location,
        owner: element?.menage?.owner,
      },
    });
    return console.log(xLabels);
  });
  const totalData = xLabels.map((ville) => ville.data.total);
  const locData = xLabels.map((ville) => ville.data.location);
  const ownerData = xLabels.map((ville) => ville.data.owner);
  const ville_name = xLabels.map((ville) => ville.designation);
  return (
    <div className=" flex justify-center items-center flex-col gap-4">
      <p className="font-medium text-base text-center uppercase">Ménages</p>
      <BarChart
        width={650}
        height={300}
        series={[
          {
            data: ownerData,
            label: "propiétaire",
            stack: "stack1",
            color: "#075985",
          },
          { data: locData, label: "locataire", color: "#aa05b4" },
          { data: totalData, label: "total", color: "#ef4706" },
        ]}
        xAxis={[{ data: ville_name, scaleType: "band" }]}
      />
    </div>
  );
};

export default BasicChartMenage;
