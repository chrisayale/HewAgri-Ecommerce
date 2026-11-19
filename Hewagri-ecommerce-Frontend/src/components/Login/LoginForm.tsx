"use client";

import { useToast } from "@/context";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  loginUser,
  resetAuthStatus,
  setStatus,
} from "@/lib/redux/slices/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useModal } from "../layout/Modal";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { DialogTitle } from "@headlessui/react";

export default function LoginForm() {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const notify = useToast();
  const dispatch = useAppDispatch();
  const { loading, status, message, data, error } = useAppSelector(
    (state) => state.auth
  );

  const [credentials, setCredentials] = useState({
    phone: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(loginUser(credentials));
    } catch (error) {
      notify("Invalid email or password", "error");
      console.error("An error occurred", error);
    }
  };

  const handleOpenModal = () => {
    openModal(
      <div className="space-y-5 flex flex-col items-center justify-center">
        <DialogTitle>Bienvenu sur Hewagri</DialogTitle>
        <CheckBadgeIcon className="w-16 h-16 text-green-500" />
      </div>
    );
  };

  useEffect(() => {
    if (status === 200 && !loading) {
      notify("Login successful!", "success");
      dispatch(resetAuthStatus());
      handleOpenModal();
      setTimeout(() => {
        closeModal();
        window.location.href = "/";
      }, 5000);
    } else if (status === 406 && !loading) {
      if (typeof window !== "undefined") {
        localStorage.setItem("phone", credentials.phone);
      }
      router.push("/validation");
      notify("Please verify your account", "info");
      dispatch(setStatus(null));
    } else if (status === 500 && !loading) {
      notify("Invalid phone/email or password", "error");
      dispatch(setStatus(null));
    }
  }, [
    status,
    error,
    notify,
    loading,
    router,
    credentials.phone,
    dispatch,
    closeModal,
  ]);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-dark">
            Connectez-vous à votre compte
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 transition-all duration-300 eas"
          >
            {error && status !== 406 && !loading ? (
              <span className="block text-[14px] font-medium leading-6 text-red-500">
                Numéro de téléphone ou mot de passe incorrect!
              </span>
            ) : error && status === 406 && !loading ? (
              <span className="block text-[14px] font-medium leading-6 text-orange-400">
                Veuillez vérifier votre compte !
              </span>
            ) : null}
            <div>
              <label
                htmlFor="phone"
                className="block text-[14px] font-medium leading-6 text-dark"
              >
                Numéro de téléphone ou email
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  required
                  placeholder="Ex: +243 999 999 999"
                  minLength={9}
                  value={credentials.phone}
                  onChange={handleInputChange}
                  className="outline-none block w-full rounded-md border-0 py-1.5 text-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-green text-[14px] px-4"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-[14px] font-medium leading-6 text-dark"
                >
                  Mot de passe
                </label>
                <div className="text-[14px]">
                  <Link
                    href="/reset-password"
                    className="font-semibold text-primary-green hover:text-secondary-green"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  required
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="block outline-none w-full rounded-md border-0 py-1.5 text-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-green text-[14px] px-4"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-primary-green px-3 py-1.5 text-[14px] font-semibold text-white shadow-sm hover:bg-secondary-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green"
              >
                {loading ? "Chargement ..." : "Se connecter"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-[14px] text-gray-500">
            Vous n&apos;avez pas de compte ?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary-green hover:text-secondary-green"
            >
              Inscrivez-vous maintenant
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
