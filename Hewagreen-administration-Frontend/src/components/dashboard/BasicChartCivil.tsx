import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const BasicChartCivil = ({ dash }: { dash: any }) => {
  interface Ville {
    designation: string;
    data: {
      total: number;
      sigle: number;
      maried: number;
      divorced: number;
      widower: number;
      other: number;
    };
  }
  let xLabels: Ville[] = [];
  console.log(dash?.per_town, "dash");

  dash?.per_town?.forEach((element: any) => {
    xLabels.push({
      designation: element?.designation,
      data: {
        total: element?.citizen?.total,
        sigle: element?.citizen?.marital_state?.single,
        maried: element?.citizen?.marital_state?.maried,
        divorced: element?.citizen?.marital_state?.divorced,
        widower: element?.citizen?.marital_state?.widowers,
        other: element?.citizen?.marital_state?.maried_other,
      },
    });
    return console.log(xLabels);
  });
  const totalData = xLabels.map((ville) => ville.data.total);
  const sigleData = xLabels.map((ville) => ville.data.sigle);
  const mariedData = xLabels.map((ville) => ville.data.maried);
  const divorcedData = xLabels.map((ville) => ville.data.divorced);
  const widowerData = xLabels.map((ville) => ville.data.widower);
  const otherData = xLabels.map((ville) => ville.data.other);
  const ville_name = xLabels.map((ville) => ville.designation);
  return (
    <div className=" flex justify-center items-center flex-col gap-4">
      <p className="font-medium text-base text-center uppercase ">état civil</p>
      <BarChart
        width={650}
        height={300}
        series={[
          { data: sigleData, label: "célibataire", color: "#b46905" },
          { data: mariedData, label: "marié", color: "#498d64" },
          { data: divorcedData, label: "divorcé", color: "#91785e" },
          { data: widowerData, label: "veuf/veuve", color: "#2a6b69" },
          { data: otherData, label: "autres", color: "#ca9c35" },
          { data: totalData, label: "total", color: "#ef4706" },
        ]}
        xAxis={[{ data: ville_name, scaleType: "band" }]}
      />
    </div>
  );
};

export default BasicChartCivil;
