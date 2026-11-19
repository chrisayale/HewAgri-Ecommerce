"use client";

import { SocialIcons } from "@/components/shared";
import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [errors, setErrors] = useState<any>({});
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let errors: any = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (form.name.length < 3)
      errors.name = "Full Name must be greater than 3 characters";
    if (form.phone.length < 9)
      errors.phone = "Phone number must be greater than 9 numbers";
    if (!regex.test(form.email)) errors.email = "Please enter a valid email";
    if (!form.email) errors.email = "Email is required";
    if (!form.message) errors.message = "Your message is required";
    if (form.message.length < 5)
      errors.message = "Your message must be greater than 5 characters";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sendEmail = (data: {}) => {
    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAIL_SERVICE!,
        process.env.NEXT_PUBLIC_EMAIL_TEMPLATE!,
        data,
        process.env.NEXT_PUBLIC_EMAIL_USER!
      )
      .then(
        () => {
          setLoading(false);
          setSuccess(true);
          setForm({ name: "", phone: "", email: "", message: "" });
          setErrors({});
          setTimeout(() => {
            setSuccess(false);
          }, 5000);
        },
        (error) => {
          setLoading(false);
          setFailure(true);
          setSuccess(false);
          setTimeout(() => {
            setFailure(false);
          }, 5000);
        }
      );
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      sendEmail(form);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <main id="contact" className="w-full mx-auto">
      <section className="w-full mx-auto">
        <div className="section-container p-5 md:p-10 lg:p-20 space-y-8">
          <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start justify-start">
            <div className="space-y-5">
              <div className="font-bold text-[30px] leading-[35px] text-primary-green">
                Entrez en contact avec HewAgri pour plus d&apos;informations !
              </div>
              <p className="text-[14px]">
                Vous avez des questions ou besoin d&apos;informations ?
                N&apos;hésitez pas à nous contacter ! Qu&apos;il s&apos;agisse
                de services, de collaboration ou simplement de curiosité, nous
                sommes là pour vous. Contactez-nous dès aujourd&apos;hui !
              </p>
              <div className="space-y-2 text-[16px]">
                <div className="text-[14px]">
                  <span className="font-bold">Email :&nbsp;</span>
                  <a
                    href="mailto:info@kivugreen.com"
                    target="_blank"
                    className="notranslate text-primary-green"
                  >
                    info@kivugreen.com
                  </a>
                </div>
                <div className="text-[14px]">
                  <span className="font-bold">Telephone :&nbsp;</span>
                  <a
                    href="tel:+243853628926"
                    target="_blank"
                    className="notranslate text-primary-green"
                  >
                    +243 987 654 321
                  </a>
                </div>

                <div className="text-[14px]">
                  <span className="font-bold">Adresse :&nbsp;</span>
                  <span className="notranslate text-primary-green">
                    136 La frontiere Katindo Goma RDC
                  </span>
                </div>

                <div className="text-[14px] inline-flex items-center justify-start gap-3">
                  <span className="font-bold">Reseaux sociaux :&nbsp;</span>
                  <SocialIcons size={18} color="green" />
                </div>
              </div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              autoComplete="off"
            >
              <div className="w-full">
                <input
                  type="text"
                  className="w-full text-[14px] py-2 px-5 placeholder:text-black/50 outline-none border border-primary-green rounded-lg"
                  name="name"
                  placeholder="Nom complet"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && (
                  <span className="block first-letter:uppercase text-red-500/80 font-[400] text-sm mt-1">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="w-full">
                  <input
                    type="email"
                    className="w-full text-[14px] py-2 px-5 placeholder:text-black/50 outline-none border border-primary-green rounded-lg"
                    name="email"
                    placeholder="Adresse email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                  {errors.email && (
                    <span className="block first-letter:uppercase text-red-500/80 font-[400] text-sm mt-1">
                      {errors.email}
                    </span>
                  )}
                </div>
                <div className="w-full">
                  <input
                    type="number"
                    className="w-full text-[14px] py-2 px-5 placeholder:text-black/50 outline-none border border-primary-green rounded-lg"
                    name="phone"
                    placeholder="Numéro de téléphone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                  {errors.phone && (
                    <span className="block first-letter:uppercase text-red-500/80 font-[400] text-sm mt-1">
                      {errors.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full">
                <textarea
                  placeholder="Votre Message"
                  className="w-full text-[14px] py-2 px-5 placeholder:text-black/50 outline-none border border-primary-green rounded-lg"
                  name="message"
                  value={form.message}
                  rows={4}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />
                {errors.message && (
                  <span className="block first-letter:uppercase text-red-500/80 font-[400] text-sm mt-1">
                    {errors.message}
                  </span>
                )}
              </div>

              <div className="w-full">
                <div className="hidden lg:block w-full lg:col-span-3">
                  {success && (
                    <div
                      className="w-full bg-green-200 py-2 px-5 rounded-lg text-[14px] text-center 
            font-[500] text-green-700"
                    >
                      Email sent successfully
                    </div>
                  )}
                  {failure && (
                    <div
                      className="w-full bg-red-200 py-2 px-5 rounded-lg text-[14px] text-center 
            font-[500] text-red-700"
                    >
                      Email non envoyé ! Veuillez réessayer
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full md:w-auto mr-auto bg-primary-green text-white py-2 px-5 rounded-lg text-center"
              >
                <span className="sr-only">
                  {loading === true ? "envoie en cours ..." : "Send message"}
                </span>
                <span className="">
                  {loading === true ? "Envoie ... " : "Envoyer"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
