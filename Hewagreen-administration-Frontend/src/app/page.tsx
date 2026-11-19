"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useLogin, useLoginBanque } from "@/controller/tanstack/auth/useAuthCredential";
import Loader from "@/components/global/loader/Loader";
import { LoginCredentials } from "@/types";
import { Tabs, Tab } from "@nextui-org/react";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [selected, setSelected] = useState("admin");
  const [credentials, setCredentials] = useState<LoginCredentials>({
    phone: "",
    password: "",
  });

  const { mutateAsync: login, isLoading: isLoadingAdmin, error } = useLogin();
  const { mutateAsync: loginBanque, isLoading: isLoadingBanque } = useLoginBanque();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(credentials);
      console.log("Login réussi");
    } catch (error) {
      console.error("Erreur lors de la tentative de login:", error);
    }
  };

  const handleSubmitBangk = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await loginBanque(credentials);
      console.log("Login réussi");
    } catch (error) {
      console.error("Erreur lors de la tentative de login:", error);
    }
  };

  // Reset credentials when the selected tab changes
  useEffect(() => {
    setCredentials({ phone: "", password: "" });
  }, [selected]);

  // Stocker la valeur de selected dans localStorage chaque fois qu'elle change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("rolebylogin", selected);
    }
    
  }, [selected]);

  return (
    <section className="bg-gray-50 dark:bg-background">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="/"
          className="flex flex-col gap-6 items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <Image src="/HewAgrii.png" alt="logo" width={150} height={150} />
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Connexion
            </h1>

            <Tabs
              fullWidth
              size="md"
              aria-label="Tabs form"
              selectedKey={selected}
              onSelectionChange={(key) => setSelected(key as string)}
            >
              <Tab
                key="admin"
                title={
                  <div className={`flex justify-center items-center w-full px-4 py-2 rounded-lg transition-all duration-300 
                    ${selected === "admin" ? "bg-green-600 text-white font-bold shadow-lg" : "bg-white text-gray-900 hover:bg-gray-200 hover:shadow-md"}`}>
                    Administrateur
                  </div>
                }>
                <form
                  className="space-y-6 md:space-y-6"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Téléphone ou email
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Téléphone ou email"
                      value={credentials.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={credentials.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      >
                        {showPassword ? (
                          <EyeOutlined />
                        ) : (
                          <EyeInvisibleOutlined />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white bg-green-600 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    {isLoadingAdmin ? <Loader /> : " Connexion"}
                  </button>
                </form>
              </Tab>

              <Tab
                key="banque"
                title={
                  <div className={`flex justify-center items-center w-full px-4 py-2 rounded-lg transition-all duration-300 
                    ${selected === "banque" ? "bg-green-600 text-white font-bold shadow-lg" : "bg-white text-gray-900 hover:bg-gray-200 hover:shadow-md"}`}>
                    Banque
                  </div>
                }>
                <form
                  className="space-y-6 md:space-y-6"
                  onSubmit={handleSubmitBangk}
                >
                  <div>
                    <label
                      htmlFor="email-banque"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Téléphone ou email
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="email-banque"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Téléphone ou email"
                      value={credentials.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password-banque"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password-banque"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={credentials.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      >
                        {showPassword ? (
                          <EyeOutlined />
                        ) : (
                          <EyeInvisibleOutlined />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white bg-green-600 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    {isLoadingBanque ? <Loader /> : " Connexion"}
                  </button>
                </form>
              </Tab>
            </Tabs>

          </div>
        </div>
      </div>
    </section>
  );
}