import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const BasicChartAge = ({ dash }: { dash: any }) => {
  interface Ville {
    designation: string;
    data: {
      total: number;
      zero_to_six: number;
      seven_to_twelve: number;
      thirteen_to_seventeen: number;
      eighteen_more: number;
    };
  }
  let xLabels: Ville[] = [];
  console.log(dash?.per_town, "dash");

  dash?.per_town?.forEach((element: any) => {
    xLabels.push({
      designation: element?.designation,
      data: {
        total: element?.citizen?.total,
        zero_to_six: element?.citizen?.citizen_age?.zero_to_six,
        seven_to_twelve: element?.citizen?.citizen_age?.six_to_twelve,
        thirteen_to_seventeen:
          element?.citizen?.citizen_age?.twelve_to_eighteen,
        eighteen_more: element?.citizen?.citizen_age?.eighteen_or_more,
      },
    });
    return console.log(xLabels);
  });
  const totalData = xLabels.map((ville) => ville.data.total);
  const zero_to_sixData = xLabels.map((ville) => ville.data.zero_to_six);
  const seven_to_twelveData = xLabels.map(
    (ville) => ville.data.seven_to_twelve
  );
  const thirteen_to_seventeenData = xLabels.map(
    (ville) => ville.data.thirteen_to_seventeen
  );
  const eighteen_moreData = xLabels.map((ville) => ville.data.eighteen_more);
  const ville_name = xLabels.map((ville) => ville.designation);
  return (
    <div className=" flex justify-center items-center flex-col gap-4">
      <p className="font-medium text-base text-center uppercase ">
        Population par tranche d&apos;ages
      </p>
      <BarChart
        width={650}
        height={300}
        series={[
          { data: zero_to_sixData, label: "0-6", color: "#14b8a6" },
          { data: seven_to_twelveData, label: "7-12", color: "#3b82f6" },
          { data: thirteen_to_seventeenData, label: "13-17", color: "#14b8a6" },
          { data: eighteen_moreData, label: "18 ou plus", color: "#3b82f6" },
          { data: totalData, label: "total", color: "#ef4706" },
        ]}
        xAxis={[{ data: ville_name, scaleType: "band" }]}
      />
    </div>
  );
};

export default BasicChartAge;
