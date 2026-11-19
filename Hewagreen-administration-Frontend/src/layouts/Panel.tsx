"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import useAuth from "@/controller/hooks/useAuth";
import { useRouter } from "next/navigation";
import Loader from "@/components/global/loader/Loader";

const Panel = ({ children }: { children: React.ReactNode }) => {
  const [localSession, setLocalSession] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let token: string | null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("authToken");
    }

    setLocalSession(token!);

    if (!token!) {
      router.push("/");
    }
  }, [router]);

  if (!localSession) {
    return (
      <div className=" h-[100vh] w-full justify-center flex items-center">
        <p></p>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default Panel;
