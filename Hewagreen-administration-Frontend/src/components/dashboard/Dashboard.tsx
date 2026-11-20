"use client";
import React from "react";
import PieBasicChart from "./PieBasicChart";
import BasicCard from "./model/BasicCard";
import DashData from "./DashData";
import BasicChart from "./BasicChart";
import BasicChartMenage from "./BasicChartMenage";
import BasicChartCivil from "./BasicChartCivil";
import BasicChartAge from "./BasicChartAge";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoManOutline, IoWomanOutline } from "react-icons/io5";
import { RxDropdownMenu } from "react-icons/rx";
import { BsPersonArmsUp } from "react-icons/bs";
import { ImManWoman } from "react-icons/im";
import { MdOutlineFiberManualRecord } from "react-icons/md";
import { GiDeathStar } from "react-icons/gi";
import { CgProductHunt } from "react-icons/cg";
import { ResponseDashboard } from "@/types";
import { BiCustomize } from "react-icons/bi";
import { Box, Skeleton, Grid } from "@mui/material";

const Dashboard = ({ data }: { data: ResponseDashboard | undefined }) => {
  // Afficher un squelette pendant le chargement
  if (!data) {
    return (
      <div className="flex-grow px-1 py-4 overflow-auto">
        <Grid container spacing={6} className="xl:grid xl:grid-cols-4 gap-6 flex flex-col">
          {/* Cartes de stats - Skeleton */}
          <Grid item xs={12} xl={4}>
            <Grid container spacing={6} className="xl:grid xl:grid-cols-4 gap-6 flex flex-col md:grid md:grid-cols-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid key={i} item xs={12} sm={6} xl={3}>
                  <Skeleton variant="rectangular" height={120} className="bg-white shadow-md rounded-md" />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Pie Chart - Skeleton */}
          <Grid item xs={12} xl={4} className="min-[1600px]:col-span-1">
            <Skeleton variant="rectangular" height={400} className="bg-white shadow-md rounded-md p-2" />
          </Grid>

          {/* Bar Chart - Skeleton */}
          <Grid item xs={12} xl={12} className="min-[1600px]:col-span-3">
            <Skeleton variant="rectangular" height={450} className="bg-white shadow-md rounded-md p-2" />
          </Grid>
        </Grid>
      </div>
    );
  }

  // Si les données existent mais sont incomplètes
  const stats = data.data?.stats;
  const details = data.data?.details;

  return (
    <div>
      <div className="flex-grow px-1 py-4 overflow-auto ">
        <div className="xl:grid xl:grid-cols-4 gap-6 flex flex-col ">
          <div className=" p-0 xl:col-span-4 min-[1600px]:col-span-3 ">
            <div className="xl:grid xl:grid-cols-4 gap-6 flex flex-col md:grid md:grid-cols-2">
              <div className=" col-span-1 bg-white shadow-md  rounded-md">
                <BasicCard
                  title="Cooperative"
                  color="bg-cyan-600"
                  icon={
                    <HiOutlineUserGroup
                      fontSize="24px "
                      className=" text-cyan-600"
                    />
                  }
                  value={stats?.cooperatives ?? 0}
                  percent={stats?.cooperatives ? stats.cooperatives / 100 : 0}
                  tag="citoyens"
                />
              </div>
              <div className=" col-span-1 bg-white shadow-md  rounded-md">
                <BasicCard
                  color="bg-blue-500"
                  title="Produits"
                  icon={
                    <CgProductHunt
                      fontSize="24px  "
                      className=" text-blue-500"
                    />
                  }
                  value={stats?.products ?? 0}
                  percent={stats?.products ? stats.products / 100 : 0}
                  tag="homme"
                />
              </div>
              <div className=" col-span-1 bg-white shadow-md  rounded-md">
                <BasicCard
                  color="bg-teal-500"
                  title="Utilisateurs"
                  icon={
                    <IoWomanOutline
                      fontSize="24px  "
                      className=" text-teal-500"
                    />
                  }
                  value={stats?.users ?? 0}
                  percent={stats?.users ? stats.users / 100 : 0}
                  tag="femme"
                />
              </div>

              <div className=" col-span-1 bg-white shadow-md  rounded-md">
                <BasicCard
                  color="bg-green-600"
                  title="Commandes"
                  icon={
                    <ImManWoman fontSize="24px  " className=" text-green-600" />
                  }
                  value={stats?.commandes ?? 0}
                  percent={stats?.commandes ? stats.commandes / 100 : 0}
                  tag="mariés"
                />
              </div>
              <div className=" col-span-1 bg-white shadow-md  rounded-md">
                <BasicCard
                  color="bg-yellow-800"
                  title="Banques"
                  icon={
                    <BsPersonArmsUp
                      fontSize="24px  "
                      className=" text-yellow-900"
                    />
                  }
                  value={stats?.banks ?? 0}
                  percent={stats?.banks ? stats.banks / 100 : 0}
                  tag="divorcés"
                />
              </div>
              <div className=" col-span-1 bg-white shadow-md  rounded-md">
                <BasicCard
                  color="bg-yellow-600"
                  title="Clients"
                  icon={
                    <BiCustomize
                      fontSize="24px "
                      className=" text-yellow-600"
                    />
                  }
                  value={stats?.customers ?? 0}
                  percent={stats?.customers ? stats.customers / 100 : 0}
                  tag="divorcés"
                />
              </div>
            </div>
          </div>
          <div className="p-2 min-[1600px]:col-span-1 col-span-2 bg-white shadow-md  rounded-md">
            <PieBasicChart
              _data={data}
            />
          </div>
          <div className="  col-span-4 ">
            <div className=" w-full">
              <BasicChart data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;