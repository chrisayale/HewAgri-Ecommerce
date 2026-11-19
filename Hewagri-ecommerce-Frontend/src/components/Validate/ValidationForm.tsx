/* eslint-disable react/no-unescaped-entities */
"use client";

import { useToast } from "@/context";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  resendVerificationCode,
  verifyUser,
} from "@/lib/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ValidationForm() {
  const router = useRouter();
  const notify = useToast();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const [status, setStatus] = useState<number | null>(null);
  const phone =
    typeof window !== "undefined" ? localStorage.getItem("phone") : null;

  const [verificationData, setVerificationData] = useState({
    id_user: phone || "",
    verification_code: "" as string | number,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationData({
      ...verificationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(verifyUser(verificationData));

      if (verifyUser.fulfilled.match(resultAction)) {
        const { status } = resultAction.payload;
        setStatus(status);
      } else if (verifyUser.rejected.match(resultAction)) {
        const { status } = resultAction.payload as {
          status: number | any;
          message: string;
        };
        setStatus(status);
      }
    } catch (error) {
      notify("An error occurred during verification", "error");
      console.error("An error occurred", error);
    }
  };

  const handleResendCode = async () => {
    try {
      const resultAction = await dispatch(
        resendVerificationCode({ id_user: verificationData.id_user })
      );

      if (resendVerificationCode.fulfilled.match(resultAction)) {
        const { status } = resultAction.payload;
        notify("Verification code resent", "success");
        // setStatus(status);
      } else if (resendVerificationCode.rejected.match(resultAction)) {
        const { status } = resultAction.payload as {
          status: number | any;
          message: string;
        };
        setStatus(status);
      }
    } catch (error) {
      notify("An error occurred during verification", "error");
      console.error("An error occurred", error);
    }
  };

  useEffect(() => {
    if (status === 200 && !loading) {
      notify("Account Verified!", "success");
      if (typeof window !== "undefined") {
        localStorage.removeItem("phone");
      }
      router.push("/shop");
    } else if (status === 403 && !loading) {
      notify("Invalid Verification code", "error");
    }
  }, [status, loading, router, notify]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-dark">
          Entrez le code de vérification
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-2">
        <p>
          <span>Nous avons envoyé un code au </span>
          <span className="text-primary-green">
            {verificationData.id_user}.{" "}
          </span>
          <span>Si vous ne l&apos;avez pas reçu, </span>
          <button
            type="button"
            className="text-primary-green font-semibold"
            onClick={() => handleResendCode()}
          >
            {loading ? "..." : " Renvoyer le code"}
          </button>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="id_user"
              className="block text-[14px] font-medium leading-6 text-dark"
            >
              Numéro de téléphone
            </label>
            <div className="mt-2">
              <input
                disabled
                id="id_user"
                name="id_user"
                type="text"
                required
                value={verificationData.id_user}
                minLength={9}
                maxLength={13}
                onChange={handleInputChange}
                className="outline-none block w-full rounded-md border-0 py-1.5 text-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-green text-[14px] px-4"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="verification_code"
              className="block text-[14px] font-medium leading-6 text-dark"
            >
              Code de vérification
            </label>
            <div className="mt-2">
              <input
                id="verification_code"
                name="verification_code"
                type="number"
                placeholder="Enter code"
                required
                value={verificationData.verification_code}
                onChange={(e) => {
                  setVerificationData({
                    ...verificationData,
                    verification_code: parseInt(e.target.value),
                  });
                }}
                className="block outline-none w-full rounded-md border-0 py-1.5 text-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-green text-[14px] px-4"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary-green px-3 py-1.5 text-[14px] font-semibold text-white shadow-sm hover:bg-secondary-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green"
            >
              {loading ? "Chargement ..." : "Valider"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
