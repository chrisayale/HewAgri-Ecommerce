/* eslint-disable react/no-unescaped-entities */
"use client";

import { useToast } from "@/context";
import React, { useEffect } from "react";

interface ErrorProps {
  error: string | any;
}

const Error = ({ error }: ErrorProps) => {
  const notify = useToast();

  useEffect(() => {
    notify(`${error}`, "error");
  }, [error, notify]);

  return (
    <div className="w-full h-auto p-10 bg-red-300/10 space-y-4">
      <h1 className="text-black text-center text-[20px] font-semibold">
        Une erreur s&apos;est produit
      </h1>
      <p className="text-center">
        Nous travaillons activement pour résoudre l&apos;erreur. Merci de
        revenir dans un moment
      </p>
      <p className="text-center capitalize flex flex-wrap items-center justify-center space-x-2">
        <span className="font-semibold">message d&apos;erreur :</span>
        <span className="text-red-500">{error}</span>
      </p>
    </div>
  );
};

export default Error;
