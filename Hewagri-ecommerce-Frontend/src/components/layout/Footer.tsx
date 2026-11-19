"use client";

import React from "react";
import { SocialIcons } from "../shared";
import axios from "axios";

const Footer = () => {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value;
    setLoading(true);
    try {
      const response = await axios.post(
        "https://ecomv2.kivugreen.cd/api/services/service/newsletters",
        { email }
      );
      setStatus(response.data.status);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setStatus(error.response.status);
      } else {
        console.error("An unexpected error occurred:", error);
      }
      setLoading(false);
    } finally {
      setLoading(false);
      setEmail("");
      setTimeout(() => setStatus(0), 8000);
    }
  };

  return (
    <footer className="w-full mx-auto">
      <div className="w-full max-auto bg-light">
        <div className="section-container p-5 md:p-10 lg:px-20 grid grid-cols-1 lg:grid-cols-6 items-center justify-between gap-10">
          <div className="lg:col-span-2 space-y-5">
            <div className="text-black font-semibold text-[20px]">
              Abonnez-vous à notre newsletter
            </div>
            <p className="text-[14px] text-black/70">
              En vous abonnant à notre newsletter, vous recevrez des mises à
              jour régulières sur nos offres spéciales, nos nouveaux produits et
              nos événements à venir.
            </p>
          </div>
          <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:col-span-4">
            <form
              onSubmit={(e) => handleSubmit(e)}
              className="flex-1 w-full relative rounded-full overflow-hidden max-w-[600px]"
            >
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-5 lg:px-10 py-3 w-full outline-none text-[14px] text-black"
                placeholder="Entre votre adresse mail"
              />
              <div className="absolute inset-y-0 flex items-center justify-center right-0 rounded-full bg-secondary-green hover:bg-primary-green text-white font-semibold text-[14px] px-5 lg:px-10">
                <button type="submit">
                  {loading ? "Chargement..." : "S'abonner"}
                </button>
              </div>
            </form>

            {status !== 0 && (
              <div className="relative w-full">
                {status === 200 && (
                  <span className="flex items-center justify-center px-5 text-primary-green">
                    Merci de vous être abonné. Vous recevrez désormais les
                    dernières actualités, offres spéciales, et événements à
                    venir directement dans votre boîte mail. Nous sommes ravis
                    de vous compter parmi nous !
                  </span>
                )}

                {status === 500 && (
                  <span className="flex items-center justify-center px-5 text-red-500">
                    Vous êtes déjà abonné à notre newsletter
                  </span>
                )}
              </div>
            )}

            <div>
              <SocialIcons size={20} color="green" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
