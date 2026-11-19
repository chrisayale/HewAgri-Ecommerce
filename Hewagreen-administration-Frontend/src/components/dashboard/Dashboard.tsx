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

const Dashboard = ({ data }: { data: any }) => {
  console.log(data);
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
                  value={data?.data?.stats?.cooperatives}
                  percent={data?.data?.stats?.cooperatives / 100}
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
                  value={data?.data?.stats?.products}
                  percent={data?.data?.stats?.products / 100}
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
                  value={data?.data?.stats?.users}
                  percent={data?.data?.stats?.users / 100}
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
                  value={data?.data?.stats?.commandes}
                  percent={data?.data?.stats?.commandes / 100}
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
                  value={data?.data?.stats?.banks}
                  percent={data?.data?.stats?.banks / 100}
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
                  value={data?.data?.stats?.customers}
                  percent={data?.data?.stats?.customers / 100}
                  tag="divorcés"
                />
              </div>
            </div>
          </div>
          <div className="p-2 min-[1600px]:col-span-1 col-span-2 bg-white shadow-md  rounded-md">
            <PieBasicChart
              _data={data}
              // dash={dash?.data}
            />
          </div>
          {/* <div className=" p-2 col-span-4 bg-white  rounded-md">
            <DashData
            //  dash={dash?.data}
            />
          </div> */}
          <div className="  col-span-4 ">
            <div className=" w-full">
              <BasicChart data={data} />
            </div>
          </div>
          {/* <div className=" p-2 col-span-4 bg-white rounded-md max-md:hidden ">
            <div className="2xl:grid 2xl:grid-cols-4 gap-6">
              <div className=" p-2 col-span-2 ">
                <BasicChartCivil
                //  dash={dash?.data}
                />
              </div>
              <div className=" p-2 col-span-2 ">
                <BasicChartAge
                //  dash={dash?.data}
                />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
