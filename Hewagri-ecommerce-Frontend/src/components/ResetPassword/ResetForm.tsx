"use client";
import { useToast } from "@/context";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  requestPasswordReset,
  resetAuthStatus,
  resetPassword,
  setStatus,
} from "@/lib/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ResetForm = () => {
  const [steps, setSteps] = React.useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div className="p-5 flex flex-col items-center justify-center text-center">
      {steps === 1 && (
        <RequestResetForm
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          setSteps={setSteps}
        />
      )}
      {steps === 2 && <ResetWithCodeForm setSteps={setSteps} />}
    </div>
  );
};

interface RequestResetFormProps {
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  setSteps: React.Dispatch<React.SetStateAction<number>>;
}

const RequestResetForm: React.FC<RequestResetFormProps> = ({
  phoneNumber,
  setPhoneNumber,
  setSteps,
}) => {
  const dispatch = useAppDispatch();
  const notify = useToast();
  const { loading } = useAppSelector((state) => state.auth);

  const handleInputChange = (e: any) => setPhoneNumber(e.target.value);
  // Submit phone number to request password reset
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(
        requestPasswordReset({ phone: phoneNumber })
      );

      if (requestPasswordReset.fulfilled.match(resultAction)) {
        notify("Code envoyé avec succès", "success");
        localStorage.setItem("code_phone", phoneNumber);
        setSteps(2);
      } else if (requestPasswordReset.rejected.match(resultAction)) {
        notify("Vérifiez votre numéro de téléphone et réessayez", "error");
        console.error("An error occurred", resultAction.payload);
      }
    } catch (error) {
      notify("Une erreur s'est produite. Reesayer !", "error");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-xl font-bold leading-9 tracking-tight text-dark">
          Entrez votre numero de téléphone
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-2 text-[14px]">
        <p>
          <span>
            Entrez votre numéro de téléphone pour recevoir un code de
            réinitialisation
          </span>
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
                id="id_user"
                name="id_user"
                type="text"
                required
                minLength={9}
                maxLength={13}
                value={phoneNumber}
                onChange={handleInputChange}
                className="outline-none block w-full rounded-md border-0 py-1.5 text-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-green text-[14px] px-4"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary-green px-3 py-1.5 text-[14px] font-semibold text-white shadow-sm hover:bg-secondary-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green"
            >
              {loading ? "Envoie ..." : "Envoyer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface RequestResetWithCOdeFormProps {
  setSteps: React.Dispatch<React.SetStateAction<number>>;
}

const ResetWithCodeForm: React.FC<RequestResetWithCOdeFormProps> = ({
  setSteps,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const notify = useToast();
  const { loading } = useAppSelector((state) => state.auth);
  const [verificationData, setVerificationData] = useState({
    phone: localStorage.getItem("code_phone") || "",
    verification_code: "",
    password: "",
  });

  // Submit code and new password to reset password

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(resetPassword(verificationData));

      if (resetPassword.fulfilled.match(resultAction)) {
        notify("Mot de passe réinitialisé avec succès", "success");
        dispatch(resetAuthStatus());
        dispatch(setStatus(null));
        setTimeout(() => router.push("/login"), 3000);
      } else if (resetPassword.rejected.match(resultAction)) {
        notify(
          "Code incorrect. Veuillez réessayer avec un code correct.",
          "error"
        );
        console.error("An error occurred", resultAction.payload);
      }
    } catch (error) {
      notify("Une erreur s'est produite. Reesayer !", "error");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-xl font-bold leading-9 tracking-tight text-dark">
          Changer le mot de passe
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-2 text-[14px] space-y-1">
        <p>
          <span>
            Entrez le code de réinitialisation envoyé à votre numéro de
            téléphone et votre nouveau mot de passe
          </span>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Numero de telephone */}
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
                minLength={9}
                maxLength={13}
                value={verificationData.phone}
                onChange={(e) =>
                  setVerificationData({
                    ...verificationData,
                    phone: e.target.value,
                  })
                }
                className="outline-none block w-full rounded-md border-0 py-1.5 text-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-green text-[14px] px-4"
              />
            </div>
          </div>
          {/* Code de reinitialisation */}
          <div>
            <label
              htmlFor="verification_code"
              className="block text-[14px] font-medium leading-6 text-dark"
            >
              Code de réinitialisation
            </label>
            <div className="mt-2">
              <input
                id="verification_code"
                name="verification_code"
                type="text"
                required
                minLength={6}
                maxLength={6}
                value={verificationData.verification_code}
                onChange={(e) =>
                  setVerificationData({
                    ...verificationData,
                    verification_code: e.target.value,
                  })
                }
                className="outline-none block w-full rounded-md border-0 py-1.5 text-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-green text-[14px] px-4"
              />
            </div>
          </div>

          {/* Nouveau mot de passe */}
          <div>
            <label
              htmlFor="password"
              className="block text-[14px] font-medium leading-6 text-dark"
            >
              Nouveau mot de passe
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={verificationData.password}
                onChange={(e) =>
                  setVerificationData({
                    ...verificationData,
                    password: e.target.value,
                  })
                }
                className="outline-none block w-full rounded-md border-0 py-1.5 text-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-green text-[14px] px-4"
              />
            </div>
          </div>
          <div className="">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary-green px-3 py-1.5 text-[14px] font-semibold text-white shadow-sm hover:bg-secondary-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green"
            >
              {loading ? "Réinitialisation ..." : "Réinitialiser"}
            </button>
          </div>
          <div>
            <button
              type="button"
              className="text-primary-green font-semibold"
              onClick={() => setSteps(1)}
            >
              <span>Renvoyer le code?</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetForm;
