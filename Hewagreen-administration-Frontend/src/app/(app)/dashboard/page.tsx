"use client";
import Dashboard from "@/components/dashboard/Dashboard";
import SpinLoader from "@/components/global/lazy/SpinLoader";
import useAuth from "@/controller/hooks/useAuth";
import { _dashboard } from "@/controller/tanstack/dashboard/getDashboard.service";
import { useQuery } from "react-query";

const Home = () => {
  const { token } = useAuth();
  const { data: dataDashboard, isLoading: dataDashboradLoad } = useQuery(
    "auth-dashbord",
    () => _dashboard(token!)
  );
  return (
    <div>
      {dataDashboradLoad ? <SpinLoader /> : <Dashboard data={dataDashboard} />}
    </div>
  );
};

export default Home;
